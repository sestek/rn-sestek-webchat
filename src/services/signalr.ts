import * as signalR from '@microsoft/signalr';
import 'react-native-url-polyfill/auto';

class SignalRClient {
  connected: boolean;
  newUrl?: string;
  connection: any;
  connecting?: Promise<void>;
  onMessageFunc!: (d: any, m: any) => void;
  onTyping?: (d: any, m: any) => void;
  conversationId?: string;
  sessionToken?: string;
  connectionGeneration: number;
  attachedGeneration?: number;
  onReattachNeeded?: () => void;
  // Kapatmayi biz mi tetikledik? stop() cagrisi ilgili baglantinin onclose'unu
  // atesliyor; bu bayrak olmadan onclose yeni bir reconnect turu baslatiyor ve
  // dongu kendini besliyordu (loglarda 17 ms icinde uc "Connection disconnected").
  intentionalClose: boolean = false;
  // reconnectAsync'e yeniden giris kilidi.
  reconnecting?: Promise<void>;

  constructor(url?: string) {
    this.connected = false;
    this.newUrl = url;
    this.connectionGeneration = 0;
    this.onMessageFunc;
    this.connection;
  }

  // StartConversation / SendMessageAsync dönüşündeki
  // { conversationId, sessionToken, traceId } bilgisini benimse ve sakla.
  adoptSession = (result: any) => {
    if (!result) {
      return result;
    }
    let data = result;
    if (typeof result === 'string') {
      try {
        data = JSON.parse(result);
      } catch {
        return result;
      }
    }
    if (data && typeof data === 'object') {
      if (data.conversationId) {
        this.conversationId = data.conversationId;
      }
      if (data.sessionToken) {
        this.sessionToken = data.sessionToken;
      }
      if (this.conversationId) {
        this.attachedGeneration = this.connectionGeneration;
      }
    }
    return data;
  };

  // Giden her frame'e sessionToken ekle ve (biliniyorsa) sunucunun ürettiği
  // conversationId'yi yaz. Bir SignalR bağlantısı tek konuşmaya kilitlendiği
  // ve farklı conversationId taşıyan frame reddedildiği için bu zorunludur.
  applySession = (payload: any) => {
    if (typeof payload !== 'string') {
      return payload;
    }
    try {
      const obj = JSON.parse(payload);
      if (this.conversationId) {
        obj.conversationId = this.conversationId;
      }
      if (this.sessionToken) {
        obj.sessionToken = this.sessionToken;
      }
      return JSON.stringify(obj);
    } catch {
      return payload;
    }
  };

  buildConnection = async () => {
    this.connectionGeneration += 1;

    // Onceki baglantiyi TAMAMEN sok. Eskiden eski HubConnection nesnesi
    // handler'lariyla hayatta kaliyordu: hepsi ayni this.onMessageFunc'i
    // cagirdigi icin her mesaj birden fazla kez isleniyordu ve tek bir
    // EndConversation sunucuya iki kez ulasiyordu.
    const stale = this.connection;
    if (stale) {
      try {
        stale.off('ReceiveMessage');
        stale.off('OnTyping');
        stale.off('ChatMessageStatusChangeEvent');
      } catch {}
      try {
        this.intentionalClose = true;
        await stale.stop();
      } catch {} finally {
        this.intentionalClose = false;
      }
    }

    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Error)
      .withAutomaticReconnect()
      .withUrl(this.newUrl!, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    // NOT: HubConnection'da `onerror` diye bir API yok (close() gibi). Eskiden
    // buraya bir alan atanip duruyordu, hicbir zaman cagrilmadi -- kaldirildi.

    this.connection.onreconnected(() => {
      this.connectionGeneration += 1;
      this.connected = true;
      if (this.conversationId) {
        this.onReattachNeeded?.();
      }
    });

    const owned = this.connection;
    this.connection.onclose(async () => {
      // Bizim tetikledigimiz kapatmalarda (stop/close/buildConnection) yeniden
      // baglanma. Ayrica bu handler yalnizca AKTIF baglantiya aitse is yapsin:
      // eski bir nesnenin gecikmis onclose'u yeni baglantiyi dusurmemeli.
      if (this.intentionalClose || this.connection !== owned) {
        return;
      }
      this.connected = false;
      await this.reconnectAsync();
    });
  };

  connectAsync = async () => {
    if (this.connecting) {
      return await this.connecting;
    }

    this.connecting = (async () => {
      if (
        this.connection === undefined ||
        this.connection?._connectionState === 'Disconnected'
      ) {
        await this.buildConnection();
      }
      try {
        await this.connection.start({ withCredentials: false });
        this.connected = true;
        if (this.conversationId) {
          this.onReattachNeeded?.();
        }
      } catch (e) {
        this.connected = false;
        console.error('connectAsync error', e);
      }
    })();

    try {
      return await this.connecting;
    } finally {
      this.connecting = undefined;
    }
  };
  ensureConnected = async () => {
    if (this.connecting) {
      await this.connecting;
    } else if (
      this.connection === undefined ||
      this.connection?.state === 'Disconnected' ||
      this.connection?._connectionState === 'Disconnected'
    ) {
      await this.reconnectAsync();
    }
    let waited = 0;
    while (
      this.connection &&
      this.connection.state !== 'Connected' &&
      waited < 10000
    ) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      waited += 100;
    }
    return this.connection?.state === 'Connected';
  };

  sendAsync = async (payload?: any) => {
    try {
      await this.ensureConnected();
      const frame = this.applySession(payload);
      const result = await this.connection.invoke('SendMessageAsync', frame);
      return this.adoptSession(result);
    } catch (e) {
      // Geçersiz/eksik sessionToken veya kopuk bağlantı -> tekrar bağlanmayı tetikle.
      this.connected = false;
      console.error('SendMessageAsync error', e);
      return null;
    }
  };

  ontyping = async (func: (d: any, m: any) => void) => {
    this.onTyping = func;
    this.connection.off('OnTyping');
    await this.connection.on('OnTyping', (...args: any[]) => {
      // En guncel handler'i kullan; tanimsizsa cagirma (reconnect yarisi).
      if (typeof this.onTyping === 'function') {
        (this.onTyping as any)(...args);
      }
    });
  };

  onmessage = async (func: (d: any, m: any) => void) => {
    this.onMessageFunc = func;
    this.connection.off('ReceiveMessage');
    await this.connection.on('ReceiveMessage', (...args: any[]) => {
      // En guncel handler'i kullan; tanimsizsa cagirma (reconnect yarisi).
      if (typeof this.onMessageFunc === 'function') {
        (this.onMessageFunc as any)(...args);
      }
    });
  };

  receiveMessage = async () => {
    await this.connection.on('ReceiveMessage', () => {});
  };

  reconnectAsync = async () => {
    // Yeniden giris kilidi: previous.stop() ilgili baglantinin onclose'unu
    // atesliyor, o da buraya geri donuyordu. Kilit olmadan her kopusta birden
    // fazla baglanti aciliyor ve hepsi ayni handler'lari besliyordu.
    if (this.reconnecting) {
      return this.reconnecting;
    }

    this.reconnecting = (async () => {
      if (this.connecting) {
        await this.connecting;
      } else {
        const previous = this.connection;
        this.connection = undefined;
        if (previous?.stop) {
          try {
            this.intentionalClose = true;
            await previous.stop();
          } catch {
          } finally {
            this.intentionalClose = false;
          }
        }
        await this.connectAsync();
      }
      if (typeof this.onMessageFunc === 'function') {
        await this.onmessage(this.onMessageFunc);
      }
      if (typeof this.onTyping === 'function') {
        await this.ontyping(this.onTyping);
      }
    })();

    try {
      return await this.reconnecting;
    } finally {
      this.reconnecting = undefined;
    }
  };

  startConversation = async (payload?: any) => {
    try {
      await this.ensureConnected();
      const result = await this.connection.invoke('StartConversation', payload);
      return this.adoptSession(result);
    } catch (e) {
      console.error('StartConversation error', e);
      return null;
    }
  };

  continueConversation = async (payload?: any) => {
    try {
      await this.ensureConnected();
      // ContinueConversation mesaj JSON'undaki sessionToken doğrulanır.
      const frame = this.applySession(payload);
      const result = await this.connection.invoke(
        'ContinueConversation',
        frame
      );
      this.attachedGeneration = this.connectionGeneration;
      return this.adoptSession(result);
    } catch (e) {
      console.error('ContinueConversation error', e);
      return null;
    }
  };

  endConversation = async (payload: any) => {
    try {
      await this.ensureConnected();
      // EndConversation mesaj JSON'undaki sessionToken doğrulanır.
      const frame = this.applySession(payload);
      await this.connection.invoke('EndConversation', frame);
      return true;
    } catch (e) {
      console.error('EndConversation error', e);
      return false;
    }
  };

  needsReattach = () =>
    !!this.conversationId &&
    this.attachedGeneration !== this.connectionGeneration;

  messageStatusChange = async (func: () => void) => {
    await this.connection.on('ChatMessageStatusChangeEvent', func);
  };

  // DIKKAT: @microsoft/signalr'in HubConnection'inda close() YOK; yalnizca
  // start() / stop() / onclose() var. Eskiden burada connection.close()
  // cagriliyordu ve her End Conversation'da sessizce TypeError firlatiyordu:
  // soket acik kaliyor, connected true kaliyordu. Sonraki acilista
  // useChat'in [client.connected] effect'i "zaten bagli" sanip initSocket'i
  // atliyor, dolayisiyla startOfConversation hic gonderilmiyordu -> ekranda
  // sadece history goruluyor, yeni konusma baslamiyordu.
  async close() {
    this.conversationId = undefined;
    this.sessionToken = undefined;
    this.attachedGeneration = undefined;
    this.connecting = undefined;

    const previous = this.connection;
    // Once state'i temizle: onclose handler'i reconnectAsync'i tetikliyor,
    // stop() sirasinda kendimizi yeniden baglamayalim.
    this.connection = undefined;
    this.connected = false;
    this.reconnecting = undefined;

    if (previous?.stop) {
      try {
        this.intentionalClose = true;
        previous.off('ReceiveMessage');
        previous.off('OnTyping');
        previous.off('ChatMessageStatusChangeEvent');
        await previous.stop();
      } catch (e) {
        console.warn('SignalR connection could not be stopped cleanly', e);
      } finally {
        this.intentionalClose = false;
      }
    }
  }
}

export default SignalRClient;
