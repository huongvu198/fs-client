export interface Message {
  id: string;
  conversationId: string;
  senderId: number;
  content: string;
  senderName: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  clientId: string;
  adminId: string;
  isClosed: boolean;
  lastMessageAt: string;
}
