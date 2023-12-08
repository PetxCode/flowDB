"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = void 0;
const mainError_1 = require("./error/mainError");
const handleError_1 = require("./error/handleError");
const enums_1 = require("./utils/enums");
const userRouter_1 = __importDefault(require("./router/userRouter"));
const mainApp = (app) => {
    app.use("/api/user", userRouter_1.default);
    try {
        app.get("/", (req, res) => {
            try {
                return res.status(200).json({
                    message: "Awesome API",
                });
            }
            catch (error) {
                return res.status(404).json({
                    message: "Error",
                });
            }
        });
        app.all("*", (req, res, next) => {
            next(new mainError_1.mainError({
                name: "Route Error",
                message: `This endpoint you entered ${req.originalUrl} doesn't exist`,
                status: enums_1.HTTP.BAD,
                success: false,
            }));
        });
        app.use(handleError_1.handleError);
    }
    catch (error) {
        return error;
    }
};
exports.mainApp = mainApp;
