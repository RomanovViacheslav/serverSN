import { ChatMessageModel } from '@prisma/client';
import { ChatMessage } from './chatMessage.entity';

export interface IChatMessageService {
	createMessage: (message: ChatMessage) => Promise<ChatMessageModel | null>;
	getMessagesBySenderId: (senderId: number) => Promise<ChatMessageModel[]>;
	getMessagesByReceiverId: (receiverId: number) => Promise<ChatMessageModel[]>;
}
