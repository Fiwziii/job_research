import 'module-alias/register';
import express, { Request, Response } from 'express';
import isLogin from '$/middleware/isLogin';
import fileService from '../service/file.service';
// import fileDto from '../dto/file.dto';

const router = express.Router();

router.get("/",async(req: Request, res: Response) => {
    const { status, message } = await fileService.test(req);
    res.status(status).json(message);
});

export default router;