import { BaseController } from '../common/base.controller';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';
import { IChatMessageService } from './chatMessage.service.interface';
import { ChatMessage } from './chatMessage.entity';
import { AuthMiddleware } from '../common/auth.middleware';
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
				// Обработка ошибки создания сообщения
				socket.emit('error', 'Не удалось создать сообщение');
			} else {
				// Отправка успешного ответа клиенту
				socket.emit('messageCreated', result);
			}
		} catch (error) {
			// Обработка других ошибок
			socket.emit('error', 'Внутренняя ошибка сервера');
		}
	}

	async getMessagesBySenderId(socket: Socket, senderId: number): Promise<void> {
		try {
			const messages = await this.chatMessageService.getMessagesBySenderId(senderId);
			socket.emit('messages', messages);
		} catch (error) {
			socket.emit('error', 'Внутренняя ошибка сервера');
		}
	}

	async getMessagesByReceiverId(socket: Socket, receiverId: number): Promise<void> {
		try {
			const messages = await this.chatMessageService.getMessagesByReceiverId(receiverId);
			socket.emit('messages', messages);
		} catch (error) {
			socket.emit('error', 'Внутренняя ошибка сервера');
		}
	}
}
