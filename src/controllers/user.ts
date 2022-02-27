import firebase from '../firebase';

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from 'firebase/auth';

import {
    getFirestore,
    doc,
    setDoc,
} from 'firebase/firestore';

class User {

    async password_reset(email) {
        await sendPasswordResetEmail(getAuth(firebase), email)
            .then(() => { return true; } )
            .catch(e => { return false; });
    }
    
    // check if the password contains all required characters
    password_validate(password) {
        let length              = password.length < 8;
        let upper_case          = !/[A-Z]/.test(password);
        let lower_case          = !/[a-z]/.test(password);
        let number              = !/\d/.test(password);
        let special_character   = !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

        if (length)                 return 'Password length must be alteast 8 characters.';
        else if (upper_case)        return 'Please include at least 1 uppercase letter to your password.';
        else if (lower_case)        return 'Please include at least 1 lowercase letter to your password.';
        else if (number)            return 'Please include at least 1 number to your password.';
        else if (special_character) return 'Please include at least 1 special character to your password.';
        else return true;
    }

    async login(base64credentials) {
        let credentials = Buffer.from(base64credentials, 'base64').toString('ascii');
        let [email, password] = credentials.split(':');

        let result;

        await signInWithEmailAndPassword(getAuth(firebase), email, password)
            .then(user => {
                result = {
                    exists: true,
                    data: user.user.uid
                };
            }).catch(e => {
                if (e.code === 'auth/email-already-exists' || e.code === 'auth/user-not-found') {
                    result = {
                        exists: false,
                        data: 'Email account is being used by other user!'
                    };
                }
            });

        return result;
    }

    async register(email, password) {
        let result;

        await createUserWithEmailAndPassword(getAuth(firebase), email, password)
            .then(user => {
                setDoc(doc(getFirestore(firebase), 'users', user.user.uid), {
                    email,
                    admin: false,
                    date: new Date(),
                });

                result = true;
            }).catch(() => {
                result = false;
            });

        return result;
    }
    
}

export default new User();