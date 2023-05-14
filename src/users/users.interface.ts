import { NextFunction, Request, Response } from 'express';

export interface IUsers {
	login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	register: (req: Request, res: Response, next: NextFunction) => void;
}
