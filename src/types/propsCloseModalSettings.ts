export interface PropsCloseModalSettings {
  text?: string;
  textColor?: string;
  background?: string;
  buttons?: ButtonGroupsType;
  closeModal?: any;
  setCloseModal?: any;
  closeConversation?: any;
  closeModalSettings?: any;
  getResponseData?: Function;
}

export interface ButtonGroupsType {
  yesButton: ButtonTypes;
  noButton: ButtonTypes;
}

export interface ButtonTypes {
  text: string;
  textColor: string;
  borderColor: string | '';
  background: string;
}
