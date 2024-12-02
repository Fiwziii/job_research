export interface ServiceReponse {
    status: number;
    message: {
        result: boolean;
        status: string;
        msg: string;
        data?: any;
    };
}

export interface JwtUserRequest {
    id: number;
    email: string;
    name: string;
    surname: string;
}