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
exports.getAllUsers = exports.changeUserPassword = exports.resetUserPassword = exports.signinUser = exports.verifyUser = exports.createUser = void 0;
const enums_1 = require("../utils/enums");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const userModel_1 = __importDefault(require("../model/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../utils/email");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const token = crypto_1.default.randomBytes(3).toString("hex");
        const schoolCode = crypto_1.default.randomBytes(4).toString("hex");
        const user = yield userModel_1.default.create({
            email,
            password: hashedPassword,
            schoolCode,
            token,
        });
        (0, email_1.sendEmail)(user);
        return res.status(enums_1.HTTP.CREATED).json({
            message: "user created successfully",
            data: user,
        });
    }
    catch (error) {
        return res.status(enums_1.HTTP.BAD).json({
            message: "Error creating user: ",
        });
    }
});
exports.createUser = createUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        const getUser = yield userModel_1.default.findOne({ token });
        if (getUser) {
            yield userModel_1.default.findByIdAndUpdate(getUser._id, {
                token: "",
                verify: true,
            }, { new: true });
            return res.status(enums_1.HTTP.OK).json({
                message: "user has been verified",
            });
        }
        else {
            return res.status(enums_1.HTTP.BAD).json({
                message: "No user found",
            });
        }
    }
    catch (error) {
        return res.status(enums_1.HTTP.BAD).json({
            message: "Error creating user: ",
        });
    }
});
exports.verifyUser = verifyUser;
const signinUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const getUser = yield userModel_1.default.findOne({ email });
        if (getUser) {
            const passwordCheck = yield bcrypt_1.default.compare(password, getUser.password);
            if (passwordCheck) {
                if (getUser.verify && getUser.token === "") {
                    const token = jsonwebtoken_1.default.sign({
                        id: getUser._id,
                        status: getUser.status,
                    }, "justasecret", { expiresIn: "2d" });
                    return res.status(enums_1.HTTP.OK).json({
                        message: "user has been verified",
                        data: token,
                    });
                }
                else {
                    return res.status(enums_1.HTTP.BAD).json({
                        message: "account hasn't been verified",
                    });
                }
            }
            else {
                return res.status(enums_1.HTTP.BAD).json({
                    message: "password error",
                });
            }
        }
        else {
            return res.status(enums_1.HTTP.BAD).json({
                message: "No user found",
            });
        }
    }
    catch (error) {
        return res.status(enums_1.HTTP.BAD).json({
            message: "Error creating user: ",
        });
    }
});
exports.signinUser = signinUser;
const resetUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const getUser = yield userModel_1.default.findOne({ email });
        if (getUser) {
            const token = crypto_1.default.randomBytes(16).toString("hex");
            const checkUser = yield userModel_1.default.findByIdAndUpdate(getUser._id, {
                token,
            }, { new: true });
            (0, email_1.sendResetPasswordEmail)(checkUser);
            return res.status(enums_1.HTTP.OK).json({
                message: "An email has been sent to confirm your request",
            });
        }
        else {
            return res.status(enums_1.HTTP.BAD).json({
                message: "No user found",
            });
        }
    }
    catch (error) {
        return res.status(enums_1.HTTP.BAD).json({
            message: "Error creating user: ",
        });
    }
});
exports.resetUserPassword = resetUserPassword;
const changeUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const { userID } = req.params;
        const getUser = yield userModel_1.default.findById(userID);
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        if (getUser) {
            if (getUser.token !== "" && getUser.verify) {
                yield userModel_1.default.findByIdAndUpdate(getUser._id, {
                    password: hashedPassword,
                    token: "",
                }, { new: true });
                return res.status(enums_1.HTTP.OK).json({
                    message: "You password has been changed",
                });
            }
            else {
                return res.status(enums_1.HTTP.BAD).json({
                    message: "Please go and verify your account",
                });
            }
        }
        else {
            return res.status(enums_1.HTTP.BAD).json({
                message: "No user found",
            });
        }
    }
    catch (error) {
        return res.status(enums_1.HTTP.BAD).json({
            message: "Error creating user: ",
        });
    }
});
exports.changeUserPassword = changeUserPassword;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUser = yield userModel_1.default.find();
        const data = req.data;
        console.log(data);
        if (data.status === "admin") {
            return res.status(enums_1.HTTP.OK).json({
                message: " user found",
                data: getUser,
            });
        }
        else {
            return res.status(enums_1.HTTP.BAD).json({
                message: "You don't have the pass for this",
            });
        }
    }
    catch (error) {
        return res.status(enums_1.HTTP.BAD).json({
            message: "Error creating user: ",
        });
    }
});
exports.getAllUsers = getAllUsers;
