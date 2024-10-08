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
    this.connected = true;
    return await this.connection
      .start({
        withCredentials: false,
      })
      .catch(() => {
        this.reconnectAsync();
      });
  };

  sendAsync = async (...args: any) => {
    if (!this.connected) {
      let val = this.reconnectAsync();
      return val;
    }
    this.connection
      .send('SendMessageAsync', ...args)
      .then(() => {})
      .catch(() => {
        this.connected = false;
      });
  };

  ontyping = async (func: (d: any, m: any) => void) => {
    this.onMessageFunc = func;
    await this.connection.on('OnTyping', func);
  };

  onmessage = async (func: (d: any, m: any) => void) => {
    this.onMessageFunc = func;
    await this.connection.on('ReceiveMessage', func);
  };

  receiveMessage = async () => {
    await this.connection.on('ReceiveMessage', () => {});
  };

  reconnectAsync = async () => {
    await this.buildConnection();
    await this.connectAsync();
    await this.onmessage(this.onMessageFunc);
  };

  startConversation = async (...args: any) => {
    if (
      this.connection === undefined ||
      this.connection?._connectionState === 'Disconnected'
    ) {
      return await this.buildConnection();
    }
    return await this.connection.send('StartConversation', ...args);
  };

  continueConversation = async (...args: any) => {
    if (
      this.connection === undefined ||
      this.connection?._connectionState === 'Disconnected'
    ) {
      return await this.buildConnection();
    }
    await this.connection.send('ContinueConversation', ...args);
  };

  endConversation = async (args: any) => {
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
