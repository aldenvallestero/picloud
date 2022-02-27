import express from 'express';              // framework
import * as dotenv from "dotenv";           // environment variables storage as EVS
dotenv.config({ path: __dirname+'/.env' }); // EVS path
import multer from 'multer';                // file upload handler
import cloudinary from 'cloudinary';

// config
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_PUBLIC_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    secure:     true
});

// routes
import user     from './routes/user';
import profile  from './routes/profile';
import images   from './routes/images';
import admin    from './routes/admin';

app.use('/user',    user);
app.use('/profile', profile);
app.use('/images',  images);
app.use('/admin',   admin);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log('Server starter running on port', PORT));