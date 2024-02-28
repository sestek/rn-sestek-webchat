import type PropsCustomizeConfiguration from './propsCustomizeConfiguration';
import type PropsModules from './propsModules';

export default interface PropsMessageBoxComponent {
  customizeConfiguration: PropsCustomizeConfiguration;
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
  title?: string;
  titleColor?: string;
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
  avatar: any;
  renderAddCmp: any;
  userMessageBoxTextColor: string;
}
