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
const express_1 = require("express");
const router = (0, express_1.Router)();
const upload = require('multer')();
// controllers
const user_1 = __importDefault(require("../controllers/user"));
const images_1 = __importDefault(require("../controllers/images"));
router
    .post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // authenticate user
    let auth_user = yield user_1.default.login(req.headers.authorization.split(' ')[1]);
    if (!auth_user.exists) {
        return res.json({
            status: 401,
            message: 'Incorrect credentials',
            data: null,
        });
    }
    else {
        // get user role
        let is_admin = yield user_1.default.is_admin(auth_user.data);
        let result = yield images_1.default.create(req.body.url, req.body.owner, is_admin);
        if (result) {
            return res.json({
                status: 201,
                message: '',
                data: null
            });
        }
        else {
            return res.json({
                status: 401,
                message: 'You are not authorized to create resource for other users',
                data: null
            });
        }
    }
}))
    // Description: Generate random images
    // Updated: February 27, 2022
    // Status: Stable
    .get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // authenticate user
    let auth_user = yield user_1.default.login(req.headers.authorization.split(' ')[1]);
    if (!auth_user.exists) {
        return res.json({
            status: 'failed',
            message: 'Incorrect credentials',
            data: null,
        });
    }
    else {
        // check if number of random images requiment is manually defined and should be less than or equal to 10.
        // else, default to 5.
        let count = req.query.count && parseInt(req.query.count) && parseInt(req.query.count) <= 10 ? parseInt(req.query.count) : 5;
        // generate images from pexels going to cloudinary and save to firestore database
        let image_list = yield images_1.default.generate(count, auth_user.data);
        return res.json({
            status: 200,
            message: '',
            data: {
                limit: count,
                data: image_list,
            }
        });
    }
}))
    // Description: Generate random images from pexels and store to cloudinary & firestore database
    // Updated: February 27, 2022
    // Status: Under Development
    .get('/:id', (req, res) => {
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
    });
})
    // Description: Hide image
    // Updated: February 27, 2022
    // Status: Stable
    .delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let credentials = req.headers.authorization.split(' ')[1];
    let auth_user = yield user_1.default.login(credentials);
    if (!auth_user.exists) {
        return res.json({
            status: 401,
            message: 'Unauthorized access',
            data: null,
        });
    }
    else {
        let has_hidden = yield images_1.default.hide(auth_user.data, req.params.id);
        if (has_hidden) {
            return res.json({
                status: 201,
                message: '',
                data: null,
            });
        }
        else {
            return res.json({
                status: 401,
                message: 'You do not own the image',
                data: null,
            });
        }
    }
}));
exports.default = router;
