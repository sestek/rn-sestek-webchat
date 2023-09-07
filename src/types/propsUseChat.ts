import type { SignalRClient } from 'src/services';
import type DefaultConfiguration from './propsDefaultConfiguration';

export default interface PropsUseChat {
  url: string;
  defaultConfiguration: DefaultConfiguration;
  messages: any[];
  responseData: any;
  sessionId: string;
  client: SignalRClient;
  rnfs: any;
}
