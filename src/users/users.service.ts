import { UserModel } from '@prisma/client';
import { UsersRepository } from './users.repository';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { ConfigService } from './../config/config.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './users.service.interface';
import { injectable, inject } from 'inversify';
import { IUsersRepository } from './user.repository.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private UsersRepository: IUsersRepository,
	) {}
	async createUser({
		email,
		name,
		lastName,
		login,
		phoneNumber,
		password,
	}: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, login, name, lastName, phoneNumber);
		const salt = this.configService.get<number>('SALT');
		await newUser.setPassword(password, salt);
		const existedUser = await this.UsersRepository.find(email);
		if (existedUser) {
			return null;
		}
		return this.UsersRepository.create(newUser);
	}
	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.UsersRepository.find(email);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(
			existedUser.email,
			existedUser.login,
			existedUser.name,
			existedUser.lastName,
			existedUser.phoneNumber,
			existedUser.password,
		);
		return newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.UsersRepository.find(email);
	}

	async getAllUserInfo(email: string): Promise<UserModel[]> {
		return this.UsersRepository.findAll(email);
	}
}
