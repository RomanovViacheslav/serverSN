import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;
	@IsString({ message: 'Не указан пароль' })
	password: string;
	@IsString({ message: 'Не указан логин' })
	login: string;
	@IsString({ message: 'Не указано имя' })
	name: string;
	@IsString({ message: 'Не указано фамилия' })
	lastName: string;
	@IsString({ message: 'Не указан номер телефона' })
	phoneNumber: string;
}
