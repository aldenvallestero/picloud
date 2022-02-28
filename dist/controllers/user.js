"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("../firebase"));
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
class User {
    password_reset(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, auth_1.sendPasswordResetEmail)((0, auth_1.getAuth)(firebase_1.default), email)
                .then(() => { return true; })
                .catch(e => { return false; });
        });
    }
    // check if the password contains all required characters
    password_validate(password) {
        let length = password.length < 8;
        let upper_case = !/[A-Z]/.test(password);
        let lower_case = !/[a-z]/.test(password);
        let number = !/\d/.test(password);
        let special_character = !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
        if (length)
            return 'Password length must be alteast 8 characters.';
        else if (upper_case)
            return 'Please include at least 1 uppercase letter to your password.';
        else if (lower_case)
            return 'Please include at least 1 lowercase letter to your password.';
        else if (number)
            return 'Please include at least 1 number to your password.';
        else if (special_character)
            return 'Please include at least 1 special character to your password.';
        else
            return true;
    }
    login(base64credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            let credentials = Buffer.from(base64credentials, 'base64').toString('ascii');
            let [email, password] = credentials.split(':');
            let result;
            yield (0, auth_1.signInWithEmailAndPassword)((0, auth_1.getAuth)(firebase_1.default), email, password)
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
        });
    }
    register(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = true;
            yield (0, auth_1.createUserWithEmailAndPassword)((0, auth_1.getAuth)(firebase_1.default), email, password)
                .then(user => {
                (0, firestore_1.setDoc)((0, firestore_1.doc)((0, firestore_1.getFirestore)(firebase_1.default), 'users', user.user.uid), {
                    email,
                    admin: false,
                    date: new Date(),
                });
                result = true;
            }).catch(() => {
                result = false;
            });
            return result;
        });
    }
    is_admin(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let is_admin;
            yield (0, firestore_1.getDoc)((0, firestore_1.doc)((0, firestore_1.getFirestore)(firebase_1.default), 'users', user_id))
                .then(result => {
                var _a;
                is_admin = (_a = result.data()) === null || _a === void 0 ? void 0 : _a.admin;
            });
            return is_admin;
        });
    }
}
exports.default = new User();
