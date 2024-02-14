import type { SignalRClient } from "../services";
import type PropsCustomizeConfiguration from "./propsCustomizeConfiguration";
import type PropsDefaultConfiguration from "./propsDefaultConfiguration";
import type PropsModules from "./propsModules";

export default interface PropsModalComponent {
    url: string;
    defaultConfiguration: PropsDefaultConfiguration;
    customizeConfiguration: PropsCustomizeConfiguration;
    placeholderText?: string;
    headerText?: string;
    visible: boolean;
    closeModal: () => void;
    closeConversation: () => void;
    sessionId: string;
    client: SignalRClient;
    modules: PropsModules;
    closedModalManagment: any;
    clickClosedConversationModalFunc: Function;
}