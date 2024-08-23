
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
  currentPlayingUrl:any // Merkezi durumu buradan geçiriyoruz
  setCurrentPlayingUrl: any // Merkezi durumu güncellemek için fonksiyonu geçiriyoruz
  messageIndex:any // Burada index değerini geçiyoruz
  messageData:any // Ya da doğrudan mesaj verisini geçiriyoruz
}
