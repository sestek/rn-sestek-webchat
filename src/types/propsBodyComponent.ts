import { ScrollView } from 'react-native';
import type PropsModules from './propsModules';

export default interface PropsBodyComponent {
  messageList: any[];
  changeInputData: (text: string) => void;
  sendMessage: any;
  modules: PropsModules;
  scrollViewRef: React.RefObject<ScrollView>;
}
