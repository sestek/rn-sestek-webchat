import type PropsCustomizeConfiguration from "./propsCustomizeConfiguration";
import type PropsModules from "./propsModules";

export default interface PropsFooterComponent {
    placeholderText?: string;
    inputData: string;
    changeInputData: (text: string) => void;
    sendMessage: any;
    sendAudio: any;
    modules: PropsModules;
    customizeConfiguration: PropsCustomizeConfiguration;
}