import { ServiceReponse } from "$/types/interface";
import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { LoginRequestDTO, RegisterRequestDTO } from "../entity/user.entity";
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

export default {
    loginService: async (req: LoginRequestDTO, res: Response): Promise<ServiceReponse> => {
        const result = validationResult(req).formatWith(({ msg }) => { return msg; });
        if (!result.isEmpty()) {
            return {
                status: 400,
                message: {
                    result: false,
                    status: 'error',
                    msg: result.array()[0]
                }
            }
        }
        const { email, password } = req.body;
        const account = await prisma.account.findUnique({
            where: {
                email
            }
        })
        if (!account) {
            return {
                status: 400,
                message: {
                    result: false,
                    status: 'error',
                    msg: 'รหัสผ่านหรืออีเมลไม่ถูกต้อง'
                }
            }
        }
        const verify = await argon2.verify(account.password, password);
        if (!verify) {
            return {
                status: 400,
                message: {
                    result: false,
                    status: 'error',
                    msg: 'รหัสผ่านหรืออีเมลไม่ถูกต้อง'
                }
            }
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return {
                status: 500,
                message: {
                    result: false,
                    status: 'error',
                    msg: 'Server error'
                }
            }
        }
        const token = jwt.sign({
            id: account.id,
            email: account.email,
            name: account.name,
            surname: account.surname
        }, jwtSecret, {
            expiresIn: '7d'
        });

        return {
            status: 200,
            message: {
                result: true,
                status: 'success',
                msg: 'เข้าสู่ระบบสำเร็จ',
                data: {
                    token
                }
            }
        }
    },
    registerService: async (req: RegisterRequestDTO): Promise<ServiceReponse> => {
        const result = validationResult(req).formatWith(({ msg }) => { return msg; });
        if (!result.isEmpty()) {
            return {
                status: 400,
                message: {
                    result: false,
                    status: 'error',
                    msg: result.array()[0]
                }
            }
        }
        const { name, surname, password, email } = req.body;
        const checkEmail = await prisma.account.count({
            where: {
                email
            }
        })
        if (checkEmail > 0) {
            return {
                status: 400,
                message: {
                    result: false,
                    status: 'error',
                    msg: 'อีเมลนี้ถูกใช้งานแล้ว'
                }
            }
        }
        const hashPassword = await argon2.hash(password);
        const account = await prisma.account.create({
            data: {
                name,
                surname,
                email,
                password: hashPassword
            }
        })

        return {
            status: 200,
            message: {
                result: true,
                status: 'success',
                msg: 'โปรดรอการอนุมัติบัญชี',
            }
        }
    },
    meService: async (req: Request): Promise<ServiceReponse> => {
        return {
            status: 200,
            message: {
                result: true,
                status: 'success',
                msg: 'OK',
                data: {
                    users: req.users
                }
            }
        }
    },
    logoutService: async (req: Request): Promise<ServiceReponse> => {
        await prisma.blackListToken.create({
            data: {
                token: req.jwtToken
            }
        })
        return {
            status: 200,
            message: {
                result: true,
                status: 'success',
                msg: 'ออกจากระบบสำเร็จ'
            }
        }
    },
    disableAccountService: async (req: Request): Promise<ServiceReponse> => {
        
        const isAdmin = await prisma.account.findUnique({
            where: {
                id: req.users.id
            },
            select: {
                isAdmin: true
            }
        })
        if(!isAdmin?.isAdmin) {
            return {
                status: 403,
                message: {
                    result: false,
                    status: 'error',
                    msg: 'ไม่สามารถปิดบัญชีได้'
                }
            }
        }
        await prisma.account.update({
            where: {
                id: req.users.id
            },
            data: {
                disabled: true
            }
        })
        return {
            status: 200,
            message: {
                result: true,
                status: 'success',
                msg: 'ปิดบัญชีสำเร็จ'
            }
        }
    },
    enableAccountService: async (req: Request): Promise<ServiceReponse> => {
        const isAdmin = await prisma.account.findUnique({
            where: {
                id: req.users.id
            },
            select: {
                isAdmin: true
            }
        })
        if(!isAdmin?.isAdmin) {
            return {
                status: 403,
                message: {
                    result: false,
                    status: 'error',
                    msg: 'ไม่สามารถเปิดบัญชีได้'
                }
            }
        }
        await prisma.account.update({
            where: {
                id: req.users.id
            },
            data: {
                disabled: false
            }
        })
        return {
            status: 200,
            message: {
                result: true,
                status: 'success',
                msg: 'เปิดบัญชีสำเร็จ'
            }
        }
    },
    approveAccountService: async (req: Request): Promise<ServiceReponse> => {
        const isAdmin = await prisma.account.findUnique({
            where: {
                id: req.users.id
            },
            select: {
                isAdmin: true
            }
        })
        if(!isAdmin?.isAdmin) {
            return {
                status: 403,
                message: {
                    result: false,
                    status: 'error',
                    msg: 'ไม่สามารถอนุมัติบัญชีได้'
                }
            }
        }
        await prisma.account.update({
            where: {
                id: req.body.id
            },
            data: {
                approved: true
            }
        })
        return {
            status: 200,
            message: {
                result: true,
                status: 'success',
                msg: 'อนุมัติบัญชีสำเร็จ'
            }
        }
    }
}