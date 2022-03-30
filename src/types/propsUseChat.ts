export default interface PropsUseChat {
    defaultConfiguration: DefaultConfiguration;
    messages: any[];
}


interface DefaultConfiguration {
    sendConversationStart: boolean;
    customAction?: any;
    customActionData?: any;
    projectName: string;
    clientId?: any;
    channel: string;
    tenant: string;
    fullName?: string;
}