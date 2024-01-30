import { Request, Response } from "express"
import { CustomError } from "../../domain"
import { JwtAdapter, BcryptAdapter } from "../../config"
import { prisma } from "../../model/connect"
import { RegisterDto, LoginDto } from "../../domain"
import { envs } from "../../config"

export class AuthController {
    static handleError(error: any, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ msg: error.message })
        }
        console.log(error)
        return res.status(500).json({ msg: "Internal server error" })
    }

    static async login(req: Request, res: Response) {
        try {
            const [error, loginDto] = LoginDto.create(req.body)
            if (error) throw CustomError.badRequest(error)
            const { email, password } = loginDto!
            const usuario = await prisma.usuario.findUnique({ where: { email } })
            if (!usuario) throw CustomError.notFound("Usuario no encontrado")
            const passwordValid = await BcryptAdapter.compare(password, usuario.password)
            if (!passwordValid) throw CustomError.badRequest("Password invalido")
            const token = await new JwtAdapter(envs.JWT_SEED).generateToken({ id: usuario.id })
            res.json({ usuario, token })
        } catch (error) {
            return AuthController.handleError(error, res)
        }
    }

    static async register(req: Request, res: Response) {
        try {
            const [error, registerDto] = RegisterDto.create(req.body)
            if (error) throw CustomError.badRequest(error)
            const { email, password } = registerDto!

            const userExits = await prisma.usuario.findUnique({ where: { email } })
            if (userExits) throw CustomError.conflict("El usuario ya existe")
            const passwordHash = await BcryptAdapter.hash(password)

            const usuario = await prisma.usuario.create({
                data: {
                    ...registerDto!,
                    password: passwordHash
                }
            })

            if (usuario.rol === "CLIENTE") {
                await prisma.cliente.create({
                    data: {
                        usuarioId: usuario.id
                    }
                })
            }

            if (usuario.rol === "VENDEDOR") {
                await prisma.vendedor.create({
                    data: {
                        usuarioId: usuario.id
                    }
                })
            }


            if (usuario.rol === "ADMINISTRADOR") {
                await prisma.administrador.create({
                    data: {
                        usuarioId: usuario.id
                    }
                })
            }

            if (usuario.rol === "MODERADOR") {
                await prisma.moderador.create({
                    data: {
                        usuarioId: usuario.id
                    }
                })
            }

            const token = await new JwtAdapter(envs.JWT_SEED).generateToken({ id: usuario.id })
            res.status(201).json({ usuario, token })
        } catch (error) {
            return AuthController.handleError(error, res)
        }
    }
}