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
		const distinctReceiverIds = await this.prismaService.client.userModel.findMany({
			where: {
				OR: [
					{ messagesSent: { some: { receiverId: userId } } },
					{ messagesReceived: { some: { senderId: userId } } },
				],
			},
			select: {
				id: true,
				messagesSent: { where: { receiverId: userId }, orderBy: { createdAt: 'desc' }, take: 1 },
				messagesReceived: { where: { senderId: userId }, orderBy: { createdAt: 'desc' }, take: 1 },
			},
		});

		const lastMessages: ChatMessageModel[] = [];

		for (const user of distinctReceiverIds) {
			const lastSentMessage = user.messagesSent[0];
			const lastReceivedMessage = user.messagesReceived[0];

			if (lastSentMessage && lastReceivedMessage) {
				// Сравнивайте дату отправленного и принятого сообщений, чтобы определить последнее сообщение
				const lastMessage =
					lastSentMessage.createdAt > lastReceivedMessage.createdAt
						? lastSentMessage
						: lastReceivedMessage;
				lastMessages.push(lastMessage);
			} else if (lastSentMessage) {
				lastMessages.push(lastSentMessage);
			} else if (lastReceivedMessage) {
				lastMessages.push(lastReceivedMessage);
			}
		}

		return lastMessages;
	}
}
