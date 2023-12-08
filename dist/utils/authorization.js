"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorization = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const value = token === null || token === void 0 ? void 0 : token.split(" ")[1];
        if (value) {
            jsonwebtoken_1.default.verify(value, "justasecret", (err, data) => {
                if (err) {
                    return res.status(401).json({
                        message: "an error occurred while verifying",
                    });
                }
                else {
                    req.data = data;
                    next();
                }
            });
        }
        else {
            return res.status(404).json({
                message: "token invalid",
            });
        }
    }
    else {
        return res.status(404).json({
            message: "You are not allowed to access this",
        });
    }
};
exports.authorization = authorization;
