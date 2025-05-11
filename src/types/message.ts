
export type ThreadType = 'direct' | 'group' | 'support';

export interface MessageParticipant {
  userId: string;
  name: string;
  avatar?: string;
  role: string;
  schoolId?: string;
}

export interface MessageThread {
  id: string;
  title: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  participants: MessageParticipant[];
  threadType: ThreadType;
  unreadCount?: number;
  lastMessage?: {
    content: string;
    senderId: string;
    senderName: string;
  };
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  senderName?: string;
  senderAvatar?: string;
}
