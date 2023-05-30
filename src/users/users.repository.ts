import { UserModel } from '.prisma/client';
import { User } from './user.entity';
import { IUsersRepository } from './user.repository.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async create({ email, password, name, lastName, login, phoneNumber }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
				lastName,
				login,
				phoneNumber,
			},
		});
	}
	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
	async findAll(currentUserEmail: string): Promise<UserModel[]> {
		return this.prismaService.client.userModel.findMany({
			where: {
				email: {
					not: currentUserEmail,
				},
			},
		});
	}
}
