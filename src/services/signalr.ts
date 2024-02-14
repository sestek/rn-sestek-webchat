import * as signalR from '@aspnet/signalr';

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
      .withUrl(this.newUrl ?? '')
      .build();

    this.connection.onerror = () => {
      this.reconnectAsync();
    };

    this.connection.onclose(async () => {
      await this.reconnectAsync().then(() => {});
    });
  };

  connectAsync = async () => {
    if (this.connection === undefined) {
      await this.buildConnection();
    }
    this.connected = true;
    return await this.connection.start({
      withCredentials: false,
    });
  };

  sendAsync = async (...args: any) => {
    if (!this.connected) {
      let val = await this.reconnectAsync();
      return val;
    }
    await this.connection.invoke('SendMessage', ...args).catch(() => {
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
    await this.connection.on('ReceiveMessage', (message: any) => {});
  };

  reconnectAsync = async () => {
    await this.buildConnection();
    await this.connectAsync();
    await this.onmessage(this.onMessageFunc);
  };

  startConversation = async (...args: any) => {
    await this.connection.invoke('StartConversation', ...args);
  };

  continueConversation = async (...args: any) => {
    await this.connection.invoke('ContinueConversation', ...args);
  };

  endConversation = async (...args: any) => {
    await this.connection.invoke('EndConversation', ...args);
  };

  messageStatusChange = async (func: () => void) => {
    await this.connection.on('ChatMessageStatusChangeEvent', func);
  };

  close() {
    this.connection.close();
  }
}

export default SignalRClient;
