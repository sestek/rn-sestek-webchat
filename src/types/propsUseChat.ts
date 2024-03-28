import type { SignalRClient } from 'src/services';
import type DefaultConfiguration from './propsDefaultConfiguration';

export default interface PropsUseChat {
  url: string;
  defaultConfiguration: DefaultConfiguration;
  sessionId: string;
  client: SignalRClient;
  rnfs: any;
}
