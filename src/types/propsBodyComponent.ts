import { ScrollView } from 'react-native';

export default interface PropsBodyComponent {
  messageList: any[];
  changeInputData: (text: string) => void;
  sendMessage: any;
  scrollViewRef: React.RefObject<ScrollView>;
  url:string;
  defaultConfiguration:any
}
