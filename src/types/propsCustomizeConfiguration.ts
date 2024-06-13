export default interface PropsCustomizeConfiguration {
  headerColor?: string;
  headerTextStyle?:any;
  headerHideIcon?: IconType;
  headerCloseIcon?: IconType;
  headerAlignmentType?: HeaderAlignmentType;
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
  userMessageBoxTextColor?: string;
  chatBotMessageIcon?: IconType;
  chatBotMessageBoxTextColor?: string;
  chatBotMessageBoxBackground?: string;
  chatBotMessageBoxButtonBackground?: string;
  chatBotMessageBoxButtonBorderColor?: string;
  chatBotMessageBoxButtonTextColor?: string;
  chatBotMessageBoxAvatarIconSize?: number;
  chatBotCarouselSettings?: CarouselSettings;
  chatBody?: BodyColorOrImageType;
  chatBodyMessageBoxGap?: number;
  chatBodyTimeBackground?: string;
  chatStartButtonHide?: boolean;
  chatStartButton?: IconType;
  chatStartButtonBackground?: string;
  chatStartButtonBackgroundSize?: number;
  userMessageBoxBackground?: string;
  audioSliderSettings?: AudioSliderSettings;
  closeModalSettings?: CloseModalSettings;
  indicatorColor?: string;
  fontSettings?: FontSettings;
  permissionAudioCheck?: () => Promise<void>;
  language?: {
    [key: string]: {
      headerText: string;
      bottomInputText:string;
      closeModalText:string;
      closeModalYesButtonText:string;
      closeModalNoButtonText:string
    };
  };
  dateSettings?:{
    use?:boolean;
    backgroundColor?:string;
    textColor?:string;
    borderRadius?:number;
  },
  autoPlayAudio?: boolean
}

interface BodyColorOrImageType {
  type: 'image' | 'color';
  value: any;
}

type HeaderAlignmentType = 'textToLeft' | 'textToRight' | 'textToCenter';

export interface IconType {
  type: 'url' | 'component' | undefined;
  value: string | React.ReactElement | React.ReactNode;
}

export interface FontSettings {
  titleFontSize?:number;
  subtitleFontSize?:number;
  descriptionFontSize?:number;
}

interface CarouselSettings {
  nextButtonIcon?: IconType;
  prevButtonIcon?: IconType;
  buttonGroup?: {
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

interface CloseModalSettings {
  use: boolean;
  textColor: string;
  background: string;
  buttons: {
    yesButton: {
      textColor: string;
      background: string;
      borderColor: string;
    };
    noButton: {
      textColor: string;
      background: string;
      borderColor: string;
    };
  };
}

export interface AudioSliderSettings {
  userSliderMinimumTrackTintColor?: string;
  userSliderMaximumTrackTintColor?: string;
  userSliderThumbTintColor?: string;
  userSliderPlayImage?: IconType;
  userSliderPauseImage?: IconType;
  botSliderMinimumTrackTintColor?: string;
  botSliderMaximumTrackTintColor?: string;
  botSliderThumbTintColor?: string;
  botSliderPlayImage?: IconType;
  botSliderPauseImage?: IconType;
}
