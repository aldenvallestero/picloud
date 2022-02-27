import { Router } from 'express';
const router = Router();

const upload = require('multer')();

// controllers
// import profile from '../controllers/profile';

router

    .post('/picture', upload.single('picture'), async (req, res) => {
        // let { email, password } = req.body;
        // let user = await user.login(email, password);
        //
        // let image_url;

        // await uploadBytes(ref(getStorage(app), `profile_pictures/${user_id}`), req.file.buffer, { contentType: req.file.mimetype })

        console.log('done!');
        return res.json({
            status: 'success',
            data: false
        })
    });

export default router;