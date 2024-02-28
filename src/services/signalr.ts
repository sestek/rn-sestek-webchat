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
    this.connection
      .send('SendMessage', ...args)
      .then(() => {
        console.log('gitttiiii...');
      })
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

  endConversation = () => {
    // this.connection.send('EndOfConversation').then(() => {
    //   console.log('end socket !');
    // });
    this.connection.send(
      'SendMessage',
      'Mobilf4192a60-fc5d-46c7-a990-4f6b9398757f',
      'Deneme',
      undefined,
      { tel: '900000000000' },
      'TestHL',
      'mobile-testing',
      'mobil',
      'Default',
      undefined
    );
  };

  messageStatusChange = async (func: () => void) => {
    await this.connection.on('ChatMessageStatusChangeEvent', func);
  };

  close() {
    this.connection.close();
  }
}

export default SignalRClient;
