import firebase from '../firebase';

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInUserWithEmailAndPassword,
} from 'firebase/auth';

import {
    getFirestore,
    doc,
    setDoc,
} from 'firebase/firestore';

import { Upload } from 'multer';

class Profile {
    

    // router.put('/profile-picture', upload.single('profile_picture'), async (req, res) => {

        const { user_id } = req.body;

        let _user = await getDoc(doc(getFirestore(app), `users/${user_id}`));
        let image_url;

        // STORAGE, AUTHENTICATION AND FIRESTORE
        await deleteObject(ref(getStorage(app), `profile_pictures/${user_id}`)).catch(() => {});
        await uploadBytes(ref(getStorage(app), `profile_pictures/${user_id}`), req.file.buffer, { contentType: req.file.mimetype })
            .then(async () => {
                image_url = await getDownloadURL(ref(getStorage(app), `profile_pictures/${user_id}`));
                await updateDoc(doc(getFirestore(app), `users/${user_id}`), { profile_picture: image_url });
                await app_admin.auth().updateUser(user_id, { photoURL: image_url });

                await axios({ method: 'PUT', url: `https://app.circle.so/api/v1/community_members/${_user.data().user_circle_community_member_id}?avatar=${image_url}`, headers: { 'Authorization': `Token ${process.env.CIRCLE_TOKEN}` } })
                    .then(result => {
                        console.log(result)
                    })
            });

        // try this one
        return res.json({ status: 200, message: 'Profile picture has been successfully uploaded!', data: { image_url } });
    // });
    
}

export default new Profile();