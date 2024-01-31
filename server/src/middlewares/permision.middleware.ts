import { Request, Response, NextFunction } from "express"
import { prisma } from "../model/connect"
export class PermisionMiddleware {
    static async verify(req: Request, res: Response, next: NextFunction) {
        const { user } = req.body

        const usuarioExiste = await prisma.usuario.findUnique({
            where: { id: user.id }, select: {
                Vendedor: {
                    select: {
                        id: true
                    }
                },
                Administrador: {
                    select: {
                        id: true
                    }
                }
            }
        })

        const { Administrador, Vendedor } = usuarioExiste || {}
        const validRoles = ["ADMINISTRADOR", "VENDEDOR"]
        if (!validRoles.includes(user?.rol)) return res.status(400).json({ msg: "Rol no valido" })
        if (Vendedor?.id) {
            const vendedor = await prisma.vendedor.findUnique({ where: { id: Vendedor.id } })
            if (!vendedor) return res.status(400).json({ msg: "Vendedor no existe" })
            req.body.vendedor = vendedor
        }

        if (Administrador?.id) {
            const administrador = await prisma.administrador.findUnique({ where: { id: Administrador.id } })
            if (!administrador) return res.status(400).json({ msg: "Administrador no existe" })
            req.body.administrador = administrador
        }

        next()
    }
}