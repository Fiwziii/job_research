declare global {
    namespace Express {
        interface Request {
            users: any
        }
    }
}

export {};