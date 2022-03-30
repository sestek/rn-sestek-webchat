export default interface PropsMessageBoxComponent {
    position: 'left' | 'right';
    type: 'text' | 'system' | 'file' | 'location',
    text: string;
    title?: string;
    titleColor?: string;
    onTitleClick?: () => void;
    onForwardClick?: () => void;
    date?: Date;
    data?: {};
    onClick?: () => void;
    onOpen?: () => void;
    onDownload?: () => void;
    forwarded?: boolean;
    status: null,
    dateString?: string;
    notch?: boolean;
    avatar: any;
    renderAddCmp: any;
}