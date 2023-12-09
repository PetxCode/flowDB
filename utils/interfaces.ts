import { Document } from "mongoose";
import { HTTP } from "./enums";

export interface iError {
  name: string;
  message: string;
  status: HTTP;
  success: boolean;
}

export interface iUser {
  email: string;
  schoolName: string;
  password: string;
  token: string;
  schoolCode: string;
  status: string;
  verify: boolean;
}

export interface iUserData extends iUser, Document {}
