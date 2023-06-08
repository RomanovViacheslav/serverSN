import { ChatMessageModel } from '@prisma/client';
import { ChatMessage } from './chatMessage.entity';
import { IChatMessageRepository } from './chatMessage.repository.interface';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { IChatMessageService } from './chatMessage.service.interface';

@injectable()
export class ChatMessageService implements IChatMessageService {
	constructor(
		@inject(TYPES.ChatMessageRepository) private chatMessageRepository: IChatMessageRepository,
	) {}

	async createMessage(message: ChatMessage): Promise<ChatMessageModel | null> {
		// Дополнительная логика, проверки и валидация данных сообщения
		return this.chatMessageRepository.create(message);
	}

	async getMessagesBySenderId(senderId: number): Promise<ChatMessageModel[]> {
		return this.chatMessageRepository.getMessagesBySenderId(senderId);
	}

	async getMessagesByReceiverId(receiverId: number): Promise<ChatMessageModel[]> {
		return this.chatMessageRepository.getMessagesByReceiverId(receiverId);
	}
}
