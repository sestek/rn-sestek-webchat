import type PropsCustomizeConfiguration from './propsCustomizeConfiguration';

export default interface PropsBodyComponent {
  messageList: any[];
  changeInputData: (text: string) => void;
  sendMessage: any;
  customizeConfiguration: PropsCustomizeConfiguration;
}
