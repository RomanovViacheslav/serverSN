import { ChatMessageModel } from '@prisma/client';
import { ChatMessage } from './chatMessage.entity';
import { IChatMessageRepository } from './chatMessage.repository.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IChatMessageService } from './chatMessage.service.interface';

@injectable()
export class ChatMessageService implements IChatMessageService {
	constructor(
		@inject(TYPES.ChatMessageRepository) private chatMessageRepository: IChatMessageRepository,
	) {}

	async createMessage(message: ChatMessage): Promise<ChatMessageModel | null> {
		return this.chatMessageRepository.create(message);
	}

	async getMessagesByUsers(userAId: number, userBId: number): Promise<ChatMessageModel[]> {
		return this.chatMessageRepository.getMessagesByUsers(userAId, userBId);
	}
	async getLastMessageByChat(userAId: number, userBId: number): Promise<ChatMessageModel | null> {
		return this.chatMessageRepository.getLastMessageByChat(userAId, userBId);
	}
}
