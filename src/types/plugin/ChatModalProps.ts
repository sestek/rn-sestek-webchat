export interface ChatModalProps {
  triggerVisible: () => void;
  startConversation: () => void;
  endConversation: () => Promise<boolean>;
  conversationStatus: boolean;
  messageList: any;
  startStorageSession: () => Promise<boolean>;
}
