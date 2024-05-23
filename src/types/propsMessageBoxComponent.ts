import type PropsModules from './propsModules';

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
  modules: PropsModules;
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
}
