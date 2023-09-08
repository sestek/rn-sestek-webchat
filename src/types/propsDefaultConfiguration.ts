export default interface DefaultConfiguration {
  sendConversationStart: boolean;
  customAction?: any;
  customActionData?: any;
  projectName: string;
  clientId?: any;
  channel: string;
  tenant: string;
  fullName?: string;
  enableNdUi?: boolean;
  getResponseData: Function;
}
