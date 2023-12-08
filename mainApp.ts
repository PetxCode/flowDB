import { Application, NextFunction, Request, Response } from "express";
import { mainError } from "./error/mainError";
import { handleError } from "./error/handleError";
import { HTTP } from "./utils/enums";
import auth from "./router/userRouter";

export const mainApp = (app: Application) => {
  app.use("/api/user", auth);
  try {
    app.get("/", (req: Request, res: Response): Response => {
      try {
        return res.status(200).json({
          message: "Awesome API",
        });
      } catch (error) {
        return res.status(404).json({
          message: "Error",
        });
      }
    });

    app.all("*", (req: Request, res: Response, next: NextFunction) => {
      next(
        new mainError({
          name: "Route Error",
          message: `This endpoint you entered ${req.originalUrl} doesn't exist`,
          status: HTTP.BAD,
          success: false,
        })
      );
    });

    app.use(handleError);
  } catch (error) {
    return error;
  }
};
