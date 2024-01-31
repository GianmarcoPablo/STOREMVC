import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../config";
import { envs } from "../config";
import { prisma } from "../model/connect";

export class IsAuthMiddleware {
    static async verify(req: Request, res: Response, next: NextFunction) {
        const autorizacion = req.header("Authorization")
        if (!autorizacion) return res.status(401).json({ msg: "No autorizado" })
        if (!autorizacion.startsWith("Bearer ")) return res.status(401).json({ msg: "No autorizado" })

        const token = autorizacion.split(" ")[1]

        try {
            const decoded = await new JwtAdapter(envs.JWT_SEED).verify(token)
            if (!decoded) return res.status(401).json({ msg: "No autorizado" })
            const { id } = decoded
            if (!id) return res.status(401).json({ msg: "No autorizado" })
            const user = await prisma.usuario.findUnique({ where: { id } })
            if (!user) return res.status(401).json({ msg: "No autorizado" })
            req.body.user = user
            next()
        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: "Error de servidor" })
        }
    }
}   