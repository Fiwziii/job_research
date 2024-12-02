import { body } from 'express-validator';
export default {
    loginDTO: [
        body('email').isEmail().withMessage('กรุณากรอกอีเมลให้ถูกต้อง').notEmpty().withMessage('กรุณากรอกอีเมล'),
        body('password').isString().withMessage('กรุณากรอกรหัสผ่าน').notEmpty().withMessage('กรุณากรอกรหัสผ่าน')
    ],
    registerDTO: [
        body('email').isEmail().withMessage('กรุณากรอกอีเมลให้ถูกต้อง').notEmpty().withMessage('กรุณากรอกอีเมล'),
        body('name').isString().withMessage('กรุณากรอกชื่อ').notEmpty().withMessage('กรุณากรอกชื่อ'),
        body('surname').isString().withMessage('กรุณากรอกนามสกุล').notEmpty().withMessage('กรุณากรอกนามสกุล'),
        body('password').isString().withMessage('กรุณากรอกรหัสผ่าน').notEmpty().withMessage('กรุณากรอกรหัสผ่าน'),
        body('confirm_password').notEmpty().withMessage("กรุณากรอกยืนยันรหัสผ่าน").isString().withMessage('กรุณากรอกรหัสผ่านอีกครั้ง').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('รหัสผ่านไม่ตรงกัน');
            }
            return true;
        })
    ]
}