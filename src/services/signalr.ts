import * as signalR from '@microsoft/signalr';
import 'react-native-url-polyfill/auto';

class SignalRClient {
  connected: boolean;
  newUrl?: string;
  connection: any;
  onMessageFunc!: (d: any, m: any) => void;
  onTyping?: (d: any, m: any) => void;
  // Yeni /chathub sözleşmesi: sunucu conversationId'yi kendisi üretir ve
  // her frame'in sessionToken taşıması gerekir. Bu iki değer, bağlantı
  // örneği boyunca (reconnect dahil) tek doğruluk kaynağıdır.
  conversationId?: string;
  sessionToken?: string;

  constructor(url?: string) {
    this.connected = false;
    this.newUrl = url;
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
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Error)
      .withAutomaticReconnect()
      .withUrl(this.newUrl!, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    this.connection.onerror = () => {
      this.reconnectAsync();
    };

    this.connection.onclose(async () => {
      await this.reconnectAsync().then(() => {});
    });
  };

  connectAsync = async () => {
    if (
      this.connection === undefined ||
      this.connection?._connectionState === 'Disconnected'
    ) {
      await this.buildConnection();
    }
    // 'connected' bayragini start() COZULDUKTEN sonra isaretle; aksi halde
    // baglanti hala 'Connecting' iken invoke calisip "not in Connected State"
    // hatasi (unhandled rejection) uretir.
    return await this.connection
      .start({
        withCredentials: false,
      })
      .then(() => {
        this.connected = true;
      })
      .catch(() => {
        this.connected = false;
        this.reconnectAsync();
      });
  };

  // invoke/send oncesi baglantinin gercekten 'Connected' olmasini garanti et.
  // 'Connecting'/'Reconnecting' sirasinda start() bitene kadar bekler.
  ensureConnected = async () => {
    if (
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
      // SendMessageAsync artık Task<string> dönüyor. sendConversationStart=false
      // akışında örtük başlatma yapıp { conversationId, sessionToken } dönebilir.
      const frame = this.applySession(payload);
      const result = await this.connection.invoke('SendMessageAsync', frame);
      return this.adoptSession(result);
    } catch (e) {
      // Geçersiz/eksik sessionToken veya kopuk bağlantı -> tekrar bağlanmayı tetikle.
      this.connected = false;
      console.error('SendMessageAsync error', JSON.stringify(e));
      return null;
    }
  };

  ontyping = async (func: (d: any, m: any) => void) => {
    this.onTyping = func;
    await this.connection.on('OnTyping', (...args: any[]) => {
      // En guncel handler'i kullan; tanimsizsa cagirma (reconnect yarisi).
      if (typeof this.onTyping === 'function') {
        (this.onTyping as any)(...args);
      }
    });
  };

  onmessage = async (func: (d: any, m: any) => void) => {
    this.onMessageFunc = func;
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
    await this.buildConnection();
    await this.connectAsync();
    // Handler'lari yalnizca daha once set edildiyse yeniden bagla; aksi halde
    // 'ReceiveMessage' icin undefined callback kaydedilir ve mesaj gelince
    // "Cannot read property 'apply' of undefined" hatasi olusur.
    if (typeof this.onMessageFunc === 'function') {
      await this.onmessage(this.onMessageFunc);
    }
    if (typeof this.onTyping === 'function') {
      await this.ontyping(this.onTyping);
    }
  };

  startConversation = async (payload?: any) => {
    try {
      await this.ensureConnected();
      // StartConversation artık JSON döner: { conversationId, sessionToken, traceId }.
      // İstemcinin gönderdiği conversationId yok sayılır; dönen id'yi benimseriz.
      const result = await this.connection.invoke('StartConversation', payload);
      return this.adoptSession(result);
    } catch (e) {
      console.error('StartConversation error', JSON.stringify(e));
      return null;
    }
  };

  continueConversation = async (payload?: any) => {
    try {
      await this.ensureConnected();
      // ContinueConversation mesaj JSON'undaki sessionToken doğrulanır.
      const frame = this.applySession(payload);
      return await this.connection.invoke('ContinueConversation', frame);
    } catch (e) {
      console.error('ContinueConversation error', JSON.stringify(e));
      return null;
    }
  };

  endConversation = async (payload: any) => {
    try {
      await this.ensureConnected();
      // EndConversation mesaj JSON'undaki sessionToken doğrulanır.
      const frame = this.applySession(payload);
      return await this.connection.invoke('EndConversation', frame);
    } catch (e) {
      console.error('EndConversation error', JSON.stringify(e));
      return null;
    }
  };

  messageStatusChange = async (func: () => void) => {
    await this.connection.on('ChatMessageStatusChangeEvent', func);
  };

  close() {
    // Konuşma bittiğinde oturum bilgisini temizle ki bir sonraki
    // StartConversation tertemiz başlasın.
    this.conversationId = undefined;
    this.sessionToken = undefined;
    this.connection.close();
  }
}

export default SignalRClient;
