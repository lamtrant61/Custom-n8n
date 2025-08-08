import type { Request, Response, NextFunction } from 'express';
import { AUTH_COOKIE_NAME } from '@/constants';
import { Container } from '@n8n/di';
import { UserRepository } from '@n8n/db';
import { JwtService } from '@/services/jwt.service';

// Extend Express Request interface to include 'user'
declare global {
	namespace Express {
		interface Request {
			user_info?: any;
		}
	}
}

interface AuthJwtPayload {
	/** User Id */
	id: string;
	/** This hash is derived from email and bcrypt of password */
	hash: string;
	/** This is a client generated unique string to prevent session hijacking */
	browserId?: string;
	/** This indicates if mfa was used during the creation of this token */
	usedMfa?: boolean;
}

interface IssuedJWT extends AuthJwtPayload {
	exp: number;
}

export class AuthMiddleware {
	private userRepository: UserRepository;
	private jwtService: JwtService;

	constructor() {
		this.userRepository = Container.get(UserRepository);
		this.jwtService = Container.get(JwtService);
	}
	authTenant = async (req: Request, res: Response, next: NextFunction) => {
		const token = req.cookies[AUTH_COOKIE_NAME];
		if (!token) {
			return res.status(401).json({ error: 'Unauthorized access - No token provided' });
		}
		const user = await this.resolveJwt(token as string);
		if (!user) {
			return res.status(401).json({ error: 'Unauthorized access - Invalid token' });
		}
		req.user_info = user;
		console.log(`User authenticated: ${JSON.stringify(user)}, userrrrrrrrrrrrrrrrrrrrr`);

		return next();
	};
	resolveJwt = async (token: string) => {
		const jwtPayload: IssuedJWT = this.jwtService.verify(token, {
			algorithms: ['HS256'],
		});
		const user = await this.userRepository.findOne({
			where: { id: jwtPayload.id },
		});
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	};
}
