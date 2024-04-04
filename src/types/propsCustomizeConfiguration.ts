export default interface PropsCustomizeConfiguration {
  headerColor?: string;
  headerText?: string;
  headerTextColor?: string;
  headerHideIcon?: IconType;
  headerCloseIcon?: IconType;
  bottomColor?: string;
  bottomInputText?: string;
  bottomInputBackgroundColor?: string;
  bottomInputBorderColor?: string;
  bottomVoiceIcon?: IconType;
  bottomVoiceStopIcon?: IconType;
  bottomVoiceDisabledIcon?: IconType;
  bottomSendIcon?: IconType;
  bottomAttachmentIcon?: IconType;
  bottomInputSendButtonColor?: string;
  userMessageBoxIcon?: IconType;
  userMessageBoxTextColor?: string;
  userMessageBoxHeaderName?: string;
  userMessageBoxHeaderNameColor?: string;
  chatBotMessageIcon?: IconType;
  chatBotMessageBoxTextColor?: string;
  chatBotMessageBoxHeaderName?: string;
  chatBotMessageBoxHeaderNameColor?: string;
  chatBotMessageBoxBackground?: string;
  chatBotMessageBoxButtonBackground?: string;
  chatBotMessageBoxButtonBorderColor?: string;
  chatBotMessageBoxButtonTextColor?: string;
  chatBotCarouselSettings?: CarouselSettings;
  chatBody?: BodyColorOrImageType;
  chatBodyTimeBackground?: string;
  chatStartButtonHide?: boolean;
  chatStartButton?: IconType;
  chatStartButtonBackground?: string;
  chatStartButtonBackgroundSize?: number;
  userMessageBoxBackground?: string;
  audioSliderSettings?: AudioSliderSettings;
  closeModalSettings?: CloseModalSettings;
  indicatorColor?: string;
  permissionAudioCheck?: () => Promise<void>;
}

interface BodyColorOrImageType {
  type: 'image' | 'color';
  value: any;
}

export interface IconType {
  type: 'uri' | 'component';
  value: any;
}

interface CarouselSettings {
  nexButtonIcon?: IconType;
  prevButtonIcon?: IconType;
  buttonGroup?: {
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

interface CloseModalSettings {
  use: boolean;
  text: string;
  textColor: string;
  background: string;
  buttons: {
    yesButton: {
      text: string;
      textColor: string;
      background: string;
      borderColor: string;
    };
    noButton: {
      text: string;
      textColor: string;
      background: string;
      borderColor: string;
    };
  };
}

export interface AudioSliderSettings {
  userSliderMinimumTrackTintColor: string;
  userSliderMaximumTrackTintColor: string;
  userSliderThumbTintColor: string;
  userSliderPlayImage: IconType;
  userSliderPauseImage: IconType;
  botSliderMinimumTrackTintColor: string;
  botSliderMaximumTrackTintColor: string;
  botSliderThumbTintColor: string;
  botSliderPlayImage: IconType;
  botSliderPauseImage: IconType;
}
