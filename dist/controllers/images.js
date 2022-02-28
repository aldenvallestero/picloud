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
const cloudinary_1 = __importDefault(require("cloudinary"));
const pexels_1 = require("pexels");
const firebase_1 = __importDefault(require("../firebase"));
const firestore_1 = require("firebase/firestore");
class Images {
    create(image_url, user_id, is_admin) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = true;
            if (is_admin) {
                // STEP 1: Upload random image
                yield cloudinary_1.default.v2.uploader.upload(image_url)
                    .then((cloud_image) => __awaiter(this, void 0, void 0, function* () {
                    // STEP 2: Record random image to images collection (database)
                    yield (0, firestore_1.addDoc)((0, firestore_1.collection)((0, firestore_1.getFirestore)(firebase_1.default), 'images'), { hits: 1, url: cloud_image.url, user: user_id }).then((result) => __awaiter(this, void 0, void 0, function* () { yield (0, firestore_1.updateDoc)((0, firestore_1.doc)((0, firestore_1.getFirestore)(firebase_1.default), 'images', result.id), { id: result.id }); }));
                    result = true;
                })).catch(() => { result = false; });
            }
            else {
                // STEP 1: Upload random image
                yield cloudinary_1.default.v2.uploader.upload(image_url)
                    .then((cloud_image) => __awaiter(this, void 0, void 0, function* () {
                    // STEP 2: Record random image to images collection (database)
                    yield (0, firestore_1.addDoc)((0, firestore_1.collection)((0, firestore_1.getFirestore)(firebase_1.default), 'images'), { hits: 1, url: cloud_image.url, user: user_id }).then((result) => __awaiter(this, void 0, void 0, function* () { yield (0, firestore_1.updateDoc)((0, firestore_1.doc)((0, firestore_1.getFirestore)(firebase_1.default), 'images', result.id), { id: result.id }); }));
                    result = true;
                })).catch(() => { result = false; });
            }
            return result;
        });
    }
    // Description: Generate from 1 to 5 random images from pexels and store to cloudinary & firestore database
    // Update: February 27, 2022
    // Status: Stable
    generate(count, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let i = 0;
            let images = [];
            let client = (0, pexels_1.createClient)(process.env.PEXELS_API_KEY);
            while (i != count) {
                // STEP 1: Generate ramdom image
                yield client.photos.show({ id: Math.floor(Math.random() * 2000000) })
                    .then((random_image) => __awaiter(this, void 0, void 0, function* () {
                    // STEP 2: Upload random image
                    yield cloudinary_1.default.v2.uploader.upload(random_image.src.original)
                        .then((cloud_image) => __awaiter(this, void 0, void 0, function* () {
                        // STEP 3: Record random image to images collection (database)
                        yield (0, firestore_1.addDoc)((0, firestore_1.collection)((0, firestore_1.getFirestore)(firebase_1.default), 'images'), { hits: 1, url: cloud_image.url, user: user_id })
                            .then((result) => __awaiter(this, void 0, void 0, function* () {
                            yield (0, firestore_1.updateDoc)((0, firestore_1.doc)((0, firestore_1.getFirestore)(firebase_1.default), 'images', result.id), { id: result.id });
                            images.push({ id: result.id, hits: 1, url: cloud_image.url });
                            i++; // continue to next legal iteration
                        }));
                    })).catch(() => { });
                })).catch(() => { });
            }
            return images; // list of random & uploaded images
        });
    }
    // Description: Hide images to a specific user
    // Update: February 27, 2022
    // Status: Stable
    hide(user_id, image_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            // get image
            let image = yield (0, firestore_1.getDoc)((0, firestore_1.doc)((0, firestore_1.getFirestore)(firebase_1.default), 'images', image_id));
            // get user
            let user = yield (0, firestore_1.getDoc)((0, firestore_1.doc)((0, firestore_1.getFirestore)(firebase_1.default), 'users', user_id));
            // check if admin
            if (user.data().admin) {
                yield (0, firestore_1.updateDoc)((0, firestore_1.doc)((0, firestore_1.getFirestore)(firebase_1.default), 'images', image_id), { hidden: true });
                result = true;
            }
            // if user
            else {
                // check if they own the image
                if (image.data().user == user_id) {
                    yield (0, firestore_1.updateDoc)((0, firestore_1.doc)((0, firestore_1.getFirestore)(firebase_1.default), 'images', image_id), { hidden: true });
                    result = true;
                }
                else {
                    result = false;
                }
            }
            return result;
        });
    }
}
exports.default = new Images();
