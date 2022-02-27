import { Router } from 'express';
const router = Router();

const upload = require('multer')();

// controllers
import user from '../controllers/user';
import images from '../controllers/images';

router

    .post('/', async (req, res) => {
        // authenticate user
        let auth_user = await user.login(req.headers.authorization.split(' ')[1]);

        if (!auth_user.exists) {
            return res.json({
                status: 401,
                message: 'Incorrect credentials',
                data: null,
            })
        } else {

            // get user role
            let is_admin = await user.is_admin(auth_user.data);
            let result = await images.create(req.body.url, req.body.owner, is_admin);

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
        }
    })

    // Description: Generate random images
    // Updated: February 27, 2022
    // Status: Stable
    .get('/', async (req, res) => {

        // authenticate user
        let auth_user = await user.login(req.headers.authorization.split(' ')[1]);

        if (!auth_user.exists) {
            return res.json({
                status: 'failed',
                message: 'Incorrect credentials',
                data: null,
            })
        } else {
            // check if number of random images requiment is manually defined and should be less than or equal to 10.
            // else, default to 5.
            let count = req.query.count && parseInt(req.query.count) && parseInt(req.query.count) <= 10 ? parseInt(req.query.count) : 5;

            // generate images from pexels going to cloudinary and save to firestore database
            let image_list = await images.generate(count, auth_user.data);

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
    .get('/:id', (req, res) => {
        // get a single image by id, hits should increase by one each endpoint call
        // download images from pexels

        let id;
        setDoc(doc(getFirestore(app), 'images', `image-${id}`));
        // store images to cloudinary
        // store information to database

        /*
            {
                limit: 5,
                data: [
                    {
                        id: 1,
                        hits: 1,
                        uri: '/cloud.url'
                    },
                    {
                        id: 1,
                        hits: 1,
                        uri: '/cloud.url'
                    },
                ]
            }
        */
    })

    // Description: Update image
    // Updated: February 27, 2022
    // Status: Under Development
    .patch('/:id', (req, res) => {
        
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
    .delete('/:id', async (req, res) => {
        let auth_user = await user.login(req.headers.authorization.split(' ')[1]);

        if (!auth_user.exists) {
            return res.json({
                status: 401,
                message: 'Unauthorized access',
                data: null,
            });
        } else {
            let has_hidden = await images.hide(auth_user.data, req.params.id);

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
        }
    })

export default router;