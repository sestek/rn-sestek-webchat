
export default interface PropsMessageBoxComponent {
  position: 'left' | 'right';
  type:
    | 'text'
    | 'system'
    | 'file'
    | 'location'
    | 'message'
    | 'audio'
    | 'typing';
  activity: any;
  changeInputData: (text: string) => void;
  sendMessage: any;
  onTitleClick?: () => void;
  onForwardClick?: () => void;
  date?: Date;
  data?: {};
  onClick?: () => void;
  onOpen?: () => void;
  onDownload?: () => void;
  forwarded?: boolean;
  status: null;
  dateString?: string;
  notch?: boolean;
  renderAddCmp: any;
  userMessageBoxTextColor: string;
  url:string
  defaultConfiguration:any

}
