import { BaseController } from '../common/base.controller';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';
import { IChatMessageService } from './chatMessage.service.interface';
import { ChatMessage } from './chatMessage.entity';
import { Socket } from 'socket.io';

@injectable()
export class ChatMessageController extends BaseController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ChatMessageService) private chatMessageService: IChatMessageService,
	) {
		super(loggerService);
	}

	async createMessage(socket: Socket, message: ChatMessage): Promise<void> {
		try {
			const result = await this.chatMessageService.createMessage(message);
			if (!result) {
				socket.emit('error', 'Не удалось создать сообщение');
			} else {
				const receiverId = String(message.receiverId);

				socket.broadcast.to(receiverId).emit('messageCreated', result);

				socket.emit('messageCreated', result);
			}
		} catch (error) {
			socket.emit('error', 'Внутренняя ошибка сервера');
		}
	}

	async getMessagesByUsers(socket: Socket, userAId: number, userBId: number): Promise<void> {
		try {
			const messages = await this.chatMessageService.getMessagesByUsers(userAId, userBId);
			socket.emit('messages', messages);
		} catch (error) {
			socket.emit('error', 'Внутренняя ошибка сервера');
		}
	}
	async getLastMessageByChat(socket: Socket, userId: number): Promise<void> {
		try {
			const lastMessage = await this.chatMessageService.getLastMessageByChat(userId);
			socket.emit('lastMessage', lastMessage);
		} catch (error) {
			socket.emit('error', 'Внутренняя ошибка сервера');
		}
	}
}
