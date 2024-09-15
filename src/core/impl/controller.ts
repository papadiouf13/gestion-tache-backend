import { Request, Response } from "express";
import IController from "../controller.interface";

export default abstract class Controller implements IController{
    show(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }
    edit(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }
    store(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }
    update(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }
    remove(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }

}