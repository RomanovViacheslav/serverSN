import { ChatMessageModel, Prisma } from '@prisma/client';
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

	async getMessagesByUsers(userAId: number, userBId: number): Promise<ChatMessageModel[]> {
		return this.prismaService.client.chatMessageModel.findMany({
			where: {
				OR: [
					{ senderId: userAId, receiverId: userBId },
					{ senderId: userBId, receiverId: userAId },
				],
			},
		});
	}
	async getLastMessageByChat(userId: number): Promise<ChatMessageModel[] | null> {
		const distinctReceiverIds = await this.prismaService.client.chatMessageModel.findMany({
			where: {
				OR: [{ senderId: userId }, { receiverId: userId }],
			},
			select: {
				receiverId: true,
			},
			distinct: ['receiverId'],
		});

		const lastMessages: ChatMessageModel[] = [];

		for (const { receiverId } of distinctReceiverIds) {
			const lastMessage = await this.prismaService.client.chatMessageModel.findFirst({
				where: {
					OR: [
						{ senderId: userId, receiverId },
						{ senderId: receiverId, receiverId: userId },
					],
				},
				orderBy: { createdAt: 'desc' },
			});

			if (lastMessage) {
				lastMessages.push(lastMessage);
			}
		}

		return lastMessages;
	}
}
