export interface ChatModalProps {
  triggerVisible: () => void;
  startConversation: () => void;
  endConversation: () => void;
  conversationStatus: boolean;
  messageList: any;
  startStorageSession: () => void;
}
