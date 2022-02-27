import cloudinary from 'cloudinary';
import { createClient } from 'pexels';
import randomInteger from 'random-int';

import firebase from '../firebase';

import {
    getFirestore,
    doc,
    collection,
    getDoc,
    addDoc,
    updateDoc,
} from 'firebase/firestore';

class Images {

    async generate(count, user_id) {

        let i = 0;

        let images = [];

        let client = createClient(process.env.PEXELS_API_KEY);

        while (i != count) {
            
            // STEP 1: Generate ramdom image
            await client.photos.show({ id: Math.floor(Math.random() * 2000000) })
                .then(async random_image => {

                    // STEP 2: Upload random image
                    await cloudinary.v2.uploader.upload(random_image.src.original)
                        .then(async cloud_image => {

                            // STEP 3: Record random image to images collection (database)
                            await addDoc(collection(getFirestore(firebase), 'images'), { hits: 1, url: cloud_image.url, user: user_id })
                                .then(async result => {
                                    await updateDoc(doc(getFirestore(firebase), 'images', result.id), { id: result.id });
                                    images.push({ id: result.id, hits: 1, url: cloud_image.url });
                                    i++; // continue to next legal iteration
                                });
                        }).catch(() => {});
                }).catch(() => {});
        
        }

        return images; // list of random & uploaded images

        /*
            image[0].id
            image[0].src.original
        */
    }

    async hide(user_id, image_id) {

        let result;

        // get image
        let image = await getDoc(doc(getFirestore(firebase), 'images', image_id));
        
        // get user
        let user = await getDoc(doc(getFirestore(firebase), 'users', user_id));

        // check if admin
        if (user.data().admin) {
            await updateDoc(doc(getFirestore(firebase), 'images', image_id), { hidden: true });
            result = true;
        }
        
        // if user
        else {

            // check if they own the image
            if (image.data().user == user_id) {
                await updateDoc(doc(getFirestore(firebase), 'images', image_id), { hidden: true });
                result = true;
            } else { result = false; }

        }

        return result;
    }
}

export default new Images();