import { Application, NextFunction, Request, Response } from "express";
import { mainError } from "./error/mainError";
import { handleError } from "./error/handleError";
import { HTTP } from "./utils/enums";
import auth from "./router/userRouter";
import passport from "passport";

import Google from "passport-google-oauth20";
import userModel from "./model/userModel";
const GoogleStrategy = Google.Strategy;

export const mainApp = (app: Application) => {
  try {
    app.use("/api/user", auth);

    app.get("/", (req: Request, res: Response): Response => {
      try {
        const user = req.user;
        console.log("finally: ", req.user);
        return res.status(200).json({
          message: "Awesome API",
          data: user,
        });
      } catch (error) {
        return res.status(404).json({
          message: "Error",
        });
      }
    });

    app.get("/home", (req: any, res: Response): Response => {
      try {
        if (req.user) {
          const user = req.user;
          console.log("finally: ", req.user);
          return res.status(200).json({
            message: "Awesome API",
            data: user,
          });
        } else {
          return res.status(404).json({
            message: "something went wrong",
          });
        }
      } catch (error) {
        return res.status(404).json({
          message: "Error",
        });
      }
    });

    passport.use(
      new GoogleStrategy(
        {
          clientID:
            "377807975055-ui03iq65puopj600r2k37m0mp37595u3.apps.googleusercontent.com",
          clientSecret: "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",
          callbackURL: "/auth/google/callback",
        },
        async function (accessToken, refreshToken, profile: any, cb: any) {
          // const user = await userModel.create({
          //   email: profile?.emails[0]?.value,
          //   password: "",
          //   verify: profile?.emails[0]?.verified,
          //   token: "",
          //   status: "admin",
          //   schoolCode: Math.floor(Math.random() * 112233).toString(),
          // });

          const user = {
            email: "peter@test.com",
            name: "Peter",
          };
          console.log(user);
          return cb(null, user);
        }
      )
    );

    app.get(
      "/auth/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    app.get(
      "/auth/google/callback",
      passport.authenticate("google", {
        failureRedirect: "/login",
        successRedirect: "/home",
      }),
      function (req: any, res) {
        // Successful authentication, redirect home.
        // res.redirect("/home");
        const user = req.user;
        return res.status(200).json({
          message: "Weelcome",
          data: user,
        });
      }
    );

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
