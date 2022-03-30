export default interface PropsModalComponent {
    placeholderText?: string;
    headerText?: string;
    visible: boolean;
    closeModal: () => void;
}