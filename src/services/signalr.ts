import * as signalR from '@microsoft/signalr';
import 'react-native-url-polyfill/auto';

class SignalRClient {
  connected: boolean;
  newUrl?: string;
  connection: any;
  onMessageFunc!: (d: any, m: any) => void;
  onTyping?: (d: any, m: any) => void;

  constructor(url?: string) {
    this.connected = false;
    this.newUrl = url;
    this.onMessageFunc;
    this.connection;
  }
  buildConnection = async () => {
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Error)
      .withAutomaticReconnect()
      .withUrl(this.newUrl ?? '', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    console.log('geldi build !');

    this.connection.onerror = () => {
      console.log('onerror !');
      this.reconnectAsync();
    };

    this.connection.onclose(async () => {
      await this.reconnectAsync().then(() => {
        console.log('hata 1!!!!!!!');
      });
    });
  };

  connectAsync = async () => {
    console.log('üstte : ', this.connection);

    if (
      this.connection === undefined ||
      this.connection?._connectionState === 'Disconnected'
    ) {
      await this.buildConnection();
    }
    this.connected = true;
    return await this.connection
      .start({
        withCredentials: false,
      })
      .catch((e) => {
        console.log('errorsssss !', e);
        console.log(this.connection);
        // this.reconnectAsync();
      });
  };

  sendAsync = async (...args: any) => {
    console.log('sende geldi !');
    if (!this.connected) {
      let val = this.reconnectAsync();
      return val;
    }
    this.connection
      .send('SendMessage', ...args)
      .then(() => {})
      .catch(() => {
        this.connected = false;
      });
  };

  ontyping = async (func: (d: any, m: any) => void) => {
    console.log('typing geldi !');
    this.onMessageFunc = func;
    await this.connection.on('OnTyping', func);
  };

  onmessage = async (func: (d: any, m: any) => void) => {
    console.log('on message geldi !');
    this.onMessageFunc = func;
    await this.connection.on('ReceiveMessage', func);
  };

  receiveMessage = async () => {
    console.log('receiveMessage geldi !');
    await this.connection.on('ReceiveMessage', (message: any) => {});
  };

  reconnectAsync = async () => {
    console.log('reconnect !!!');
    await this.buildConnection();
    await this.connectAsync();
    await this.onmessage(this.onMessageFunc);
  };

  startConversation = async (...args: any) => {
    await this.connection.invoke('StartConversation', ...args);
  };

  continueConversation = async (...args: any) => {
    console.log('signal contiune !');
    await this.connection.send('ContinueConversation', ...args);
  };

  endConversation = async (args: any) => {
    console.log('end geldi !');
    if (!this.connected) {
      let val = await this.reconnectAsync();
      return val;
    }
    this.connection.send('EndConversation', args);
  };

  messageStatusChange = async (func: () => void) => {
    await this.connection.on('ChatMessageStatusChangeEvent', func);
  };

  close() {
    this.connection.close();
  }
}

export default SignalRClient;
