import { Request } from "express";

interface registerRequest {
    name: string;
    surname: string;
    password: string;
    confirm_password: string;
    email: string;
}

interface loginRequest {
    email: string;
    password: string;
}

export type RegisterRequestDTO = Request<never, never, registerRequest>;
export type LoginRequestDTO = Request<never, never, loginRequest>;