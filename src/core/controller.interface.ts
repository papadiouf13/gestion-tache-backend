import { Request, Response } from 'express';
 
export default interface IController{
    show(req: Request, res: Response): void
    edit(req: Request, res: Response): void
    store(req: Request, res: Response): void
    update(req: Request, res: Response): void
    remove(req: Request, res: Response): void
}