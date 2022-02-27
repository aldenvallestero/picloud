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
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase/firestore");
class Profile {
}
// router.put('/profile-picture', upload.single('profile_picture'), async (req, res) => {
const { user_id } = req.body;
let _user = await getDoc((0, firestore_1.doc)((0, firestore_1.getFirestore)(app), `users/${user_id}`));
let image_url;
// STORAGE, AUTHENTICATION AND FIRESTORE
await deleteObject(ref(getStorage(app), `profile_pictures/${user_id}`)).catch(() => { });
await uploadBytes(ref(getStorage(app), `profile_pictures/${user_id}`), req.file.buffer, { contentType: req.file.mimetype })
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    image_url = yield getDownloadURL(ref(getStorage(app), `profile_pictures/${user_id}`));
    yield updateDoc((0, firestore_1.doc)((0, firestore_1.getFirestore)(app), `users/${user_id}`), { profile_picture: image_url });
    yield app_admin.auth().updateUser(user_id, { photoURL: image_url });
    yield axios({ method: 'PUT', url: `https://app.circle.so/api/v1/community_members/${_user.data().user_circle_community_member_id}?avatar=${image_url}`, headers: { 'Authorization': `Token ${process.env.CIRCLE_TOKEN}` } })
        .then(result => {
        console.log(result);
    });
}));
// try this one
return res.json({ status: 200, message: 'Profile picture has been successfully uploaded!', data: { image_url } });
exports.default = new Profile();
