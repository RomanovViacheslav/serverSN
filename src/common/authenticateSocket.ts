import { Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { IUsersRepository } from '../users/user.repository.interface';

export function authenticateSocket(
	socket: Socket,
	secret: string,
	usersRepository: IUsersRepository,
): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const token = socket.handshake.headers.authorization?.split(' ')[1];

		if (token) {
			verify(token, secret, async (err, payload) => {
				if (err) {
					reject(err);
				} else if (payload && typeof payload !== 'string' && 'email' in payload) {
					const email = payload.email;
					try {
						const user = await usersRepository.find(email);
						if (user) {
							socket.data.userId = user.id;
							console.log(socket.data);
							resolve(true);
						} else {
							reject(new Error('Пользователь не найден'));
						}
					} catch (error) {
						reject(error);
					}
				} else {
					reject(new Error('Неверный формат токена'));
				}
			});
		} else {
			reject(new Error('Токен аутентификации не предоставлен'));
		}
	});
}
