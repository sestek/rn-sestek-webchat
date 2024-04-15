import { PropsDefaultConfiguration } from '.';
import PropsCustomizeConfiguration from './propsCustomizeConfiguration';

export default interface PropsHeaderComponent {
  hideModal: Function;
  clickClosedConversationModalFunc: Function;
  defaultConfiguration: PropsDefaultConfiguration;
  customizeConfiguration: PropsCustomizeConfiguration;
  headerText?: string;
  closeIcon?: any;
  hideIcon?: any;
  closeModalStatus?: boolean;
  closeConversation: Function;
}
