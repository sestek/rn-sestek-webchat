import type { SignalRClient } from "../services";
import type PropsCustomizeConfiguration from "./propsCustomizeConfiguration";
import type PropsDefaultConfiguration from "./propsDefaultConfiguration";

export default interface PropsModalComponent {
    defaultConfiguration: PropsDefaultConfiguration;
    customizeConfiguration: PropsCustomizeConfiguration;
    placeholderText?: string;
    headerText?: string;
    visible: boolean;
    closeModal: () => void;
    closeConversation: () => void;
    sessionId: string;
    client: SignalRClient;
}