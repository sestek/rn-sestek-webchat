interface PropsCloseModalSettings {
  text: string;
  textColor: string;
  background: string;
  buttons: ButtonGroupsType;
}

interface ButtonGroupsType {
  yesButton: ButtonTypes;
  noButton: ButtonTypes;
}

interface ButtonTypes {
  text: string;
  textColor: string;
  borderColor: string | '';
  background: string;
}
