import { ScrollView } from 'react-native';
import type PropsModules from './propsModules';

export default interface PropsFooterComponent {
  inputData: string;
  changeInputData: (text: string) => void;
  sendMessage: any;
  sendAudio: any;
  sendAttachment?: any;
  modules: PropsModules;
  scrollViewRef: React.RefObject<ScrollView>;
}
