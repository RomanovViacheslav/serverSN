import { ChatMessageModel } from '.prisma/client';
import { ChatMessage } from './chatMessage.entity';

export interface IChatMessageRepository {
	create: (message: ChatMessage) => Promise<ChatMessageModel>;
	getMessagesBySenderId: (senderId: number) => Promise<ChatMessageModel[]>;
	getMessagesByReceiverId: (receiverId: number) => Promise<ChatMessageModel[]>;
}
