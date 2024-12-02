import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default async function isLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.headers['authorization']
    if (!token) {
        res.status(401).json({
            code: 401,
            result: false,
            status: "warning",
            message: "เกิดข้อผิดพลาด"
        });
        return;
    }
    const authBearar = token.split(' ')
    const authToken = authBearar[1]
    if (authBearar[0] !== 'Bearer' || !authToken) {
        res.status(401).json({
            code: 401,
            result: false,
            status: "warning",
            message: "เกิดข้อผิดพลาด"
        });
        return;
    }
    const checkBlackListToken = await prisma.blackListToken.count({
        where: {
            token: authToken
        }
    })
    if (checkBlackListToken > 0) {
        res.status(401).json({
            code: 401,
            result: false,
            status: "warning",
            message: "กรุณาเข้าสู่ระบบใหม่"
        });
        return;
    }
    jwt.verify(authToken, process.env.JWT_SECRET || '', (err, decoded) => {
        if (err || !decoded) {
            res.status(401).json({
                code: 401,
                result: false,
                status: "warning",
                message: "กรุณาเข้าสู่ระบบใหม่"
            });
            return;
        }
        req.users = decoded as any;
        req.jwtToken = authToken;
        next();
    });
}