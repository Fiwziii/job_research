import { ServiceReponse } from "$/types/interface";
import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default{
    login: async (req: Request, res: Response): Promise<ServiceReponse> => {
        return {
            status: 200,
            message: {
                result: true,
                status: 'success',
                msg: 'OK'
            }
        }
    },
    register: async (req: Request): Promise<ServiceReponse> => {
        return {
            status: 200,
            message: {
                result: true,
                status: 'success',
                msg: 'OK'
            }
        }
    },
    me: async (req: Request, res: Response): Promise<ServiceReponse> => {
        return {
            status: 200,
            message: {
                result: true,
                status: 'success',
                msg: 'OK'
            }
        }
    }
}