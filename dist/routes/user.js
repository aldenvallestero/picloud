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
// controllers
const user_1 = __importDefault(require("../controllers/user"));
router
    // Updated: February 27, 2022
    .post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    let user = yield user.login(email, password);
    if (user.exists) {
        return res.json({
            status: 201,
            data: user.data
        });
    }
    else {
        return res.json({
            status: 'failed',
            data: user.data
        });
    }
}))
    // Updated: February 27, 2022
    .post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    let password_validation_result = yield user_1.default.password_validate(password);
    if (!password_validation_result) {
        return res.json({
            status: 'failed',
            message: password_validation_result,
            data: null
        });
    }
    else {
        let result = yield user_1.default.register(email, password);
        if (result) {
            return res.json({
                status: 201,
                message: 'User account has been successfully created',
                data: null
            });
        }
        else {
            return res.json({
                status: 'failed',
                message: 'User account failed to created',
                data: null
            });
        }
    }
    /*
       User Authorization
       Inherit the anon role authority level
       can create resources
       can retrieve
       can delete
       can update


       Admin Authorization
       inherit User role
       can create for others
       can retrieve for others
       can update
       can delete


    */
}))
    // Updated: February 26, 2022
    .post('/password/reset', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email } = req.body;
    let is_existing = yield user_1.default.password_reset(email);
    if (is_existing) {
        return res.json({
            status: 201,
            message: '',
            data: null
        });
    }
    else {
        return res.json({
            status: 'failed',
            message: '',
            data: null
        });
    }
}));
exports.default = router;
