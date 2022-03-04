import { Router, Request, Response } from 'express';
const router = Router();

// controllers
import user from '../controllers/user';

router

    // Updated: February 27, 2022
    .post('/register', async (req: Request, res: Response) => {

        let { email, password } = req.body;

        let password_validation_result = await user.password_validate(password);

        if (!password_validation_result) {
            return res.json({
                status: 'failed',
                message: password_validation_result,
                data: null
            });
        } else {
            let result = await user.register(email, password);
            if (result) {
                return res.json({
                    status: 201,
                    message: 'User account has been successfully created',
                    data: null
                })
            } else {
                return res.json({
                    status: 'failed',
                    message: 'User account failed to created',
                    data: null
                });
            }
        }


         /*
            User Authorization
            Inherit the anon role authority level
            can create resources
            can retrieve
            can delete
            can update


            Admin Authorization
            inherit User role
            can create for others
            can retrieve for others
            can update
            can delete


         */
    })

    // Updated: February 26, 2022
    .post('/password/reset', async (req: Request, res) => {

        let { email } = req.body;
        let is_existing: boolean = await user.password_reset(email);

        if (is_existing) {
            return res.json({
                status: 201,
                message: '',
                data: null
            });
        } else {
            return res.json({
                status: 'failed',
                message: '',
                data: null
            });
        }

        
    })

export default router;