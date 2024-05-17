import type PropsCustomizeConfiguration from './propsCustomizeConfiguration';
import type PropsModules from './propsModules';

export default interface PropsAudio {
  url: string;
  modules: PropsModules;
  customizeConfiguration: PropsCustomizeConfiguration;
  position?:string
  key?: string
}
