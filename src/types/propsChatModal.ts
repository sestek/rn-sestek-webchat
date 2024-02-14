import type PropsCustomizeConfiguration from './propsCustomizeConfiguration';
import type PropsDefaultConfiguration from './propsDefaultConfiguration';
import type PropsModules from './propsModules';

export default interface PropsChatModal {
  modules: PropsModules;
  defaultConfiguration: PropsDefaultConfiguration;
  customizeConfiguration: PropsCustomizeConfiguration;
  url?: string;
}
