import { PrismaService } from './database/prisma.service';
export const TYPES = {
	Application: Symbol.for('Application'),
	ILogger: Symbol.for('ILogger'),
	UserController: Symbol.for('UserController'),
	ExceptionFilter: Symbol.for('ExceptionFilter'),
	UserService: Symbol.for('UserService'),
	ConfigService: Symbol.for('ConfigService'),
	PrismaService: Symbol.for('PrismaService'),
	UsersRepository: Symbol.for('UsersRepository'),
	ChatMessageService: Symbol.for('ChatMessageService'),
	ChatMessageRepository: Symbol.for('ChatMessageRepository'),
	ChatMessageController: Symbol.for('ChatMessageController'),
};
