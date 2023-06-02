import { hash, compare } from 'bcryptjs';

export class User {
	private _password: string;
	constructor(
		private readonly _email: string,
		private readonly _login: string,
		private readonly _name: string,
		private readonly _lastName: string,
		private readonly _phoneNumber: string,
		passwordHash?: string,
	) {
		if (passwordHash) {
			this._password = passwordHash;
		}
	}
	get email(): string {
		return this._email;
	}
	get name(): string {
		return this._name;
	}
	get lastName(): string {
		return this._lastName;
	}
	get login(): string {
		return this._login;
	}
	get phoneNumber(): string {
		return this._phoneNumber;
	}

	get password(): string {
		return this._password;
	}

	public async setPassword(pass: string, salt: number): Promise<void> {
		this._password = await hash(pass, Number(salt));
	}
	public async comparePassword(pass: string): Promise<boolean> {
		return await compare(pass, this._password);
	}
}
