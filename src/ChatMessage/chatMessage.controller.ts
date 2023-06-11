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

	async createMessage(serverIO: any, message: ChatMessage): Promise<void> {
		try {
			const result = await this.chatMessageService.createMessage(message);
			if (!result) {
				// Обработка ошибки создания сообщения
				serverIO.emit('error', 'Не удалось создать сообщение'); // Используем serverIO.emit для отправки сообщения всем подключенным пользователям
			} else {
				// Отправка успешного ответа клиенту
				serverIO.emit('messageCreated', result); // Используем serverIO.emit для отправки сообщения всем подключенным пользователям
			}
		} catch (error) {
			// Обработка других ошибок
			serverIO.emit('error', 'Внутренняя ошибка сервера'); // Используем serverIO.emit для отправки сообщения всем подключенным пользователям
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
			console.log(messages);

			socket.emit('messages', messages);
		} catch (error) {
			socket.emit('error', 'Внутренняя ошибка сервера');
		}
	}
}
