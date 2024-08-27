export default interface DefaultConfiguration {
  sendConversationStart?: boolean;
  customAction?: any;
  customActionData?: any;
  endUser?:any;
  projectName?: string;
  tenant?: string;
  integrationId?: string;
  clientId?: any;
  channel: string;
  fullName?: string;
  enableNdUi?: boolean;
  getResponseData?: Function;
  locale?:string
}
