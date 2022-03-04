import { Router, Request, Response } from 'express';
const router = Router();

// controllers
import user     from '../controllers/user';
import images   from '../controllers/images';

router

    .post('/', async (req: Request, res: Response) => {
        
        let credentials: string = '';

        if (req.headers.authorization) {
            credentials = req.headers.authorization.split(' ')[1];
        } else {
            return res.json({
                status: 401,
                message: 'Unauthorized access',
                data: null,
            });
        }


        // authenticate user
        let auth_user: any = await user.login(credentials);

        // get user role
        let is_admin: any = await user.is_admin(auth_user.data);
        let result: any = await images.create(req.body.url, req.body.owner, is_admin);

        if (result) {
            return res.json({
                status: 201,
                message: '',
                data: null
            });
        } else {
            return res.json({
                status: 401,
                message: 'You are not authorized to create resource for other users',
                data: null
            });
        }
    })

    // Description: Generate random images
    // Updated: February 27, 2022
    // Status: Stable
    .get('/', async (req: Request, res: Response) => {


        let credentials: string = '';

        if (req.headers.authorization) {
            credentials = req.headers.authorization.split(' ')[1];
        } else {
            return res.json({
                status: 401,
                message: 'Unauthorized access',
                data: null,
            });
        }
        
        // authenticate user
        let auth_user: any = await user.login(credentials);

        if (!auth_user.exists) {
            return res.json({
                status: 401,
                message: 'Incorrect credentials',
                data: null,
            })
        } else {
            // check if number of random images requiment is manually defined and should be less than or equal to 10.
            // else, default to 5.
            let count: number = 5;
            // let count: number = parseInt(_count);

            // generate images from pexels going to cloudinary and save to firestore database
            let image_list: any = await images.generate(count, auth_user.data);

            return res.json({
                status: 200,
                message: '',
                data: {
                    limit: count,
                    data: image_list,
                }
            });
        }
    })

    // Description: Generate random images from pexels and store to cloudinary & firestore database
    // Updated: February 27, 2022
    // Status: Under Development
    .get('/:id', (req: Request, res: Response) => { })

    // Description: Update image
    // Updated: February 27, 2022
    // Status: Under Development
    .patch('/:id', (req: Request, res: Response) => {
        
        let image_id = req.params.id;
        
        return res.json({
            status: 'success',
            message: '',
            data: null,
        })
    })

    // Description: Hide image
    // Updated: February 27, 2022
    // Status: Stable
    .delete('/:id', async (req: Request, res: Response) => {

        let credentials: string = '';

        if (req.headers.authorization) {
            credentials = req.headers.authorization.split(' ')[1];
        } else {
            return res.json({
                status: 401,
                message: 'Unauthorized access',
                data: null,
            });
        }

        let auth_user: any = await user.login(credentials);

        let has_hidden: boolean = await images.hide(auth_user.data, req.params.id);

        if (has_hidden) {
                return res.json({
                status: 201,
                message: '',
                data: null,
            });
        } else {
            return res.json({
            status: 401,
            message: 'You do not own the image',
            data: null,
        });
        }
    })

export default router;