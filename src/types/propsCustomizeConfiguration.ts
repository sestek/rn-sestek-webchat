export default interface PropsCustomizeConfiguration {
  headerColor?: string;
  headerText?: string;
  bottomColor?: string;
  bottomInputText?: string;
  bottomVoiceIcon?: IconType;
  bottomSendIcon?: IconType;
  incomingIcon?: IconType;
  incomingText?: string;
  incomingTextColor?: string;
  outgoingIcon?: IconType;
  outgoingText?: string;
  outgoingTextColor?: string;
  messageColor?: string;
  messageBoxColor?: string;
  bodyColorOrImage?: BodyColorOrImageType;
  firstIconHide?: boolean;
  firsIcon?: IconType;
  firstColor?: string;
  firstSize?: number;
  closeIcon?: any;
  hideIcon?: any;
  leftMessageBoxColor?: string
  sliderMinimumTrackTintColor?: string;
  sliderMaximumTrackTintColor?: string;
  sliderThumbTintColor?: string;
  sliderPlayImage?: BodyColorOrImageType;
  sliderPauseImage?: BodyColorOrImageType;
  closeModalSettings: object,
  beforeAudioClick?: () => Promise<void>;
}

interface BodyColorOrImageType {
  type: 'image' | 'color';
  value: any;
}

export interface IconType {
  type: 'uri' | 'component';
  value: any;
}
