import type { SignalRClient } from '../services';
import type PropsDefaultConfiguration from './propsDefaultConfiguration';

export default interface PropsModalComponent {
  url: string;
  defaultConfiguration: PropsDefaultConfiguration;
  placeholderText?: string;
  headerText?: string;
  visible: boolean;
  hideModal: () => void;
  closeConversation: () => void;
  sessionId: string;
  client: SignalRClient;
  closedModalManagment: any;
  clickClosedConversationModalFunc: Function;
}
