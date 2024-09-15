import { StatusCodes } from "http-status-codes"

interface RestResponseInterface <T>{
    status: StatusCodes,
    data: T
    message: string, 
}


export default class RestResponse { 
    static response<T>(data: T, HttpCode: StatusCodes, message: string = "effectué avec succès"): RestResponseInterface<T> {
        return {
            status: HttpCode,
            data,
            message,
        } as RestResponseInterface<T>;
    }
}
