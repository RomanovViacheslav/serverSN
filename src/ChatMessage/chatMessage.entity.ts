export class ChatMessage {
	constructor(
		private readonly _content: string,
		private readonly _senderId: number,
		private readonly _receiverId: number,
	) {}

	get content(): string {
		return this._content;
	}

	get senderId(): number {
		return this._senderId;
	}

	get receiverId(): number {
		return this._receiverId;
	}
}
