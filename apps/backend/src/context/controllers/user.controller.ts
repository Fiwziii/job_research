import 'module-alias/register';
import express, { Request, Response } from 'express';
import isLogin from '$/middleware/isLogin';
import userService from '../service/user.service';
import userDto from '../dto/user.dto';
import { LoginRequestDTO, RegisterRequestDTO } from '../entity/user.entity';

const router = express.Router();

router.post('/login',userDto.loginDTO, async(req: LoginRequestDTO, res: Response) => {
    const { status, message } = await userService.loginService(req, res);
    res.status(status).json(message);
})

router.post('/register',userDto.registerDTO
    , async(req: RegisterRequestDTO, res: Response) => {
    const { status, message } = await userService.registerService(req);
    res.status(status).json(message);
})

router.get('/@me', isLogin, async(req: Request, res: Response) => {
    const { status, message } = await userService.meService(req);
    res.status(status).json(message);  
})

router.delete('/logout', isLogin, async(req: Request, res: Response) => {
    const { status, message } = await userService.logoutService(req);
    res.status(status).json(message);
})

router.put('/disable', isLogin, async(req: Request, res: Response) => {
    const { status, message } = await userService.disableAccountService(req);
    res.status(status).json(message);
})

router.put('/enable', isLogin, async(req: Request, res: Response) => {
    const { status, message } = await userService.enableAccountService(req);
    res.status(status).json(message);
})

router.put('/approve', isLogin, async(req: Request, res: Response) => {
    const { status, message } = await userService.approveAccountService(req);
    res.status(status).json(message);
})

export default router;
