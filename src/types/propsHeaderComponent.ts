import { PropsDefaultConfiguration } from '.';

export default interface PropsHeaderComponent {
  hideModal: Function;
  clickClosedConversationModalFunc: Function;
  defaultConfiguration: PropsDefaultConfiguration;
  closeIcon?: any;
  hideIcon?: any;
  closeModalStatus?: boolean;
  closeConversation: Function;
}
