import type PropsCustomizeConfiguration from './propsCustomizeConfiguration';
import type PropsModules from './propsModules';

export default interface PropsBodyComponent {
  messageList: any[];
  changeInputData: (text: string) => void;
  sendMessage: any;
  customizeConfiguration: PropsCustomizeConfiguration;
  modules: PropsModules;
}
