export default interface PropsFooterComponent {
    placeholderText?: string;
    inputData: string;
    changeInputData: (text: string) => void;
    sendMessage: any;
}