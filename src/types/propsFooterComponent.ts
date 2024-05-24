import { ScrollView } from 'react-native';

export default interface PropsFooterComponent {
  inputData: string;
  changeInputData: (text: string) => void;
  sendMessage: any;
  sendAudio: any;
  sendAttachment?: any;
  scrollViewRef: React.RefObject<ScrollView>;
}
