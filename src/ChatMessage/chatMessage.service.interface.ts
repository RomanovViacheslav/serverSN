import { ChatMessageModel } from '@prisma/client';
import { ChatMessage } from './chatMessage.entity';

export interface IChatMessageService {
	createMessage: (message: ChatMessage) => Promise<ChatMessageModel | null>;
	getMessagesByUsers: (userAId: number, userBId: number) => Promise<ChatMessageModel[]>;
	getLastMessageByChat: (userId: number, userBId: number) => Promise<ChatMessageModel | null>;
}
