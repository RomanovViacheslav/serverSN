import { ChatMessageModel } from '.prisma/client';
import { ChatMessage } from './chatMessage.entity';

export interface IChatMessageRepository {
	create: (message: ChatMessage) => Promise<ChatMessageModel>;
	getMessagesByUsers: (userAId: number, userBId: number) => Promise<ChatMessageModel[]>;
	getLastMessageByChat: (userId: number) => Promise<ChatMessageModel[] | null>;
}
