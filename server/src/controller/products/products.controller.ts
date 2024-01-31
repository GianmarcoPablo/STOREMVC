import { Request, Response } from "express";
import { CustomError } from "../../domain";

export class ProductController {
    static handleError(error: any, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ msg: error.message })
        }
        console.log(error)
        return res.status(500).json({ msg: "Internal server error" })
    }

    static async getAll(req: Request, res: Response) { }

    static async getById(req: Request, res: Response) { }

    static async create(req: Request, res: Response) { }

    static async update(req: Request, res: Response) { }

    static async delete(req: Request, res: Response) { }
}