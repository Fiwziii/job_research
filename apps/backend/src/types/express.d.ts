import { JwtUserRequest } from "./interface";

declare global {
    namespace Express {
        interface Request {
            users: JwtUserRequest,
            jwtToken: string
        }
    }
}

export {};