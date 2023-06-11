import { ExceptionFilter } from './errors/exception.filter';
import express, { Express } from 'express';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import { UserController } from './users/users.controller';
import { ChatMessageController } from './ChatMessage/chatMessage.controller';
import { ILogger } from './logger/logger.interface';
import { injectable, inject } from 'inversify';
import { TYPES } from './types';
import { json } from 'body-parser';
import 'reflect-metadata';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import cors from 'cors';
import { AuthMiddleware } from './common/auth.middleware';
import { authenticateSocket } from './common/authenticateSocket';
import { UsersRepository } from './users/users.repository';

@injectable()
export class App {
	app: Express;
	serverIO: SocketIOServer;
	httpServer: HTTPServer;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ChatMessageController) private chatMessageController: ChatMessageController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.UsersRepository) private usersRepository: UsersRepository,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(cors());
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoute(): void {
		this.app.use('/users', this.userController.router);
	}

	useWebSocket(): void {
		this.serverIO.use(async (socket, next) => {
			try {
				await authenticateSocket(socket, this.configService.get('SECRET'), this.usersRepository);
				next();
			} catch (error) {
				next(new Error('Ошибка аутентификации'));
			}
		});
		this.serverIO.on('connection', (socket: Socket) => {
			this.logger.log(`${socket.id} user connected`);

			socket.on('createMessage', (message) => {
				this.chatMessageController.createMessage(this.serverIO, message);
			});

			socket.on('getMessagesBySenderId', (senderId) => {
				this.chatMessageController.getMessagesBySenderId(socket, senderId);
			});

			socket.on('getMessagesByReceiverId', (receiverId) => {
				this.chatMessageController.getMessagesByReceiverId(socket, receiverId);
			});

			socket.on('disconnect', () => {
				this.logger.log(`${socket.id} отсоединен`);
			});
		});
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoute();
		this.useExceptionFilters();
		await this.prismaService.connect();

		this.httpServer = createServer(this.app);
		this.serverIO = new SocketIOServer(this.httpServer, {
			cors: {
				origin: 'http://localhost:3000',
			},
		});

		this.useWebSocket();

		this.httpServer.listen(this.port, () => {
			this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
		});
	}
}
