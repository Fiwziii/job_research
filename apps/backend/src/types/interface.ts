export interface ServiceReponse {
    status: number;
    message: {
        result: boolean;
        status: string;
        msg: string;
        data?: any;
    };
}