import type PropsModules from './propsModules';

export default interface PropsAudio {
  url: string;
  modules: PropsModules;
  position?:string
  key?: string
}
