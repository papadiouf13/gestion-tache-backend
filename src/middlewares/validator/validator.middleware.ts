import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { z, ZodError } from "zod";
import RestResponse from "../../core/response";
import { ReponseValidator } from "./reponse.validator";
import { tachePostSchema } from "./schemas/tache.poste.schema";
import { userPostSchema } from "./schemas/user.poste.schema";

export const supportedMethods = ["post", "put", "delete","patch","get"];

const schemas= {
    "post/api/v1/taches": tachePostSchema,
    "post/api/v1/auth": userPostSchema,

} as { [key: string]: z.ZodObject<any,any> }

export const validatorSchema = (): RequestHandler => {
    return async (req, res, next) => {
        const method = req.method.toLowerCase();
        if (!supportedMethods.includes(method)) {
            return next();
        }

        const schemaKey = `${method}${req.originalUrl}`;

        if (!schemas[schemaKey]) {
            return next();
        }

        try {
            await schemas[schemaKey].parseAsync(req.body);
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                const reponseValidator: ReponseValidator = {
                    data: error.errors.map((issue: any) => ({
                        message: `${issue.path.join(".")} is ${issue.message}`
                    })),
                    status: false,
                };
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(RestResponse.response(reponseValidator, StatusCodes.UNPROCESSABLE_ENTITY, "erreur de validation"));
            }
        }
    };
}
export default validatorSchema;
