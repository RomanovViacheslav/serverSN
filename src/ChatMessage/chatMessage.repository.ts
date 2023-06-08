import { ChatMessageModel } from '.prisma/client';
import { ChatMessage } from './chatMessage.entity';
import { IChatMessageRepository } from './chatMessage.repository.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';

@injectable()
export class ChatMessageRepository implements IChatMessageRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(message: ChatMessage): Promise<ChatMessageModel> {
		return this.prismaService.client.chatMessageModel.create({
			data: {
				content: message.content,
				senderId: message.senderId,
				receiverId: message.receiverId,
			},
		});
	}

	async getMessagesBySenderId(senderId: number): Promise<ChatMessageModel[]> {
		return this.prismaService.client.chatMessageModel.findMany({
			where: {
				senderId,
			},
		});
	}

	async getMessagesByReceiverId(receiverId: number): Promise<ChatMessageModel[]> {
		return this.prismaService.client.chatMessageModel.findMany({
			where: {
				receiverId,
			},
		});
	}
}
