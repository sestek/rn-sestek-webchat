import { PropsDefaultConfiguration } from '.';

export default interface PropsHeaderComponent {
  hideModal: Function;
  clickClosedConversationModalFunc: Function;
  headerText?: string;
  closeIcon?: any;
  hideIcon?: any;
  closeModalStatus?: boolean;
  closeConversation: Function;
  defaultConfiguration: PropsDefaultConfiguration;
}
