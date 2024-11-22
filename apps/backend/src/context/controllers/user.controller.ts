import 'module-alias/register';
import express, { Request, Response } from 'express';
import isLogin from '$/middleware/isLogin';
import userService from '../service/user.service';

const router = express.Router();

router.post('/login', async(req: Request, res: Response) => {
    const { status, message } = await userService.login(req, res);
    res.status(status).json(message);
})

router.post('/register', async(req: Request, res: Response) => {
    const { status, message } = await userService.register(req);
    res.status(status).json(message);
})

router.get('/@me', isLogin, async(req: Request, res: Response) => {
    const { status, message } = await userService.me(req, res);
    res.status(status).json(message);  
})

export default router;
