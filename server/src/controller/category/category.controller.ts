import { Response, Request } from "express";
import { prisma } from "../../model/connect"
import { PaginationPwrams, CreateCategoryDto, CustomError } from "../../domain";

export class CategoryController {
    static handleError(error: any, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ msg: error.message })
        }
        console.log(error)
        return res.status(500).json({ msg: "Internal server error" })
    }

    static async getAll(req: Request, res: Response) {
        const { vendedor, administrador } = req.body
        const { limit = 6, page = 1 } = req.query as PaginationPwrams
        const limitNumber = Number(limit)
        const offset = (Number(page) - 1) * limitNumber
        try {
            const [categorias, total] = await Promise.all([
                prisma.categoria.findMany({
                    where: { vendedorId: vendedor?.id || null, administradorId: administrador?.id || null },
                    skip: offset,
                    take: limitNumber,
                    include: {
                        administrador: true,
                        vendedor: true,
                    }
                }),
                prisma.categoria.count({
                    where: { vendedorId: vendedor?.id || null, administradorId: administrador?.id || null }
                })
            ])

            // mostrar un error si el usuario ointenta obtener categorias de otro usuario
            categorias.forEach(cat => {
                if (cat.vendedorId !== vendedor?.id && cat.administradorId !== administrador?.id) {
                    throw CustomError.badRequest("No se puede obtener categorias de otro usuario")
                }
            })

            res.status(200).json({
                categorias,
                total,
                nextPage: "http://localhost:3000/api/categorias?page=" + (Number(page) + 1) + "&limit=" + limitNumber,
                prevPage: page > 1 ? "http://localhost:3000/api/categorias?page=" + (Number(page) - 1) + "&limit=" + limitNumber : "No hay pagina anterior"
            })
        } catch (error) {

        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params
            if (!id) throw CustomError.badRequest("No se encontro el id")
            if (!Number(id)) throw CustomError.badRequest("El id debe ser un numero")
            const { vendedor, administrador } = req.body
            const categoria = await prisma.categoria.findUnique({
                where: { id: Number(id) },
                include: {
                    administrador: true,
                    vendedor: true,
                }
            })
            if (!categoria) throw CustomError.badRequest("No se encontro la categoria")
            if (categoria.vendedorId !== vendedor?.id && categoria.administradorId !== administrador?.id) {
                throw CustomError.badRequest("No se puede obtener categorias de otro usuario")
            }
            res.json(categoria)
        } catch (error) {
            return CategoryController.handleError(error, res)
        }
    }

    static async create(req: Request, res: Response) {
        const { vendedor, administrador } = req.body
        try {
            const [error, dto] = CreateCategoryDto.create(req.body)
            if (error) throw CustomError.badRequest(error)
            if (!dto) throw CustomError.badRequest("No se pudo crear la categoria")
            const category = await prisma.categoria.create({
                data: {
                    nombre: dto.nombre,
                    popular: dto.popular,
                    imagen: dto.imagen,
                    descripcion: dto.descripcion,
                    administradorId: administrador?.id || null,
                    vendedorId: vendedor?.id || null
                }
            })

            res.json(category)

        } catch (error) {
            return CategoryController.handleError(error, res)
        }
    }

    static async update(req: Request, res: Response) {
        const { id } = req.params
        if (!id) throw CustomError.badRequest("No se encontro el id")
        if (!Number(id)) throw CustomError.badRequest("El id debe ser un numero")
        const { nombre, popular, imagen, descripcion } = req.body
        const { vendedor, administrador } = req.body
        try {
            const categoria = await prisma.categoria.findUnique({
                where: { id: Number(id) },
                include: {
                    administrador: true,
                    vendedor: true,
                }
            })
            if (!categoria) throw CustomError.badRequest("No se encontro la categoria")
            if (categoria.vendedorId !== vendedor?.id && categoria.administradorId !== administrador?.id) {
                throw CustomError.badRequest("No se puede actualizar categorias de otro usuario")
            }
            const updatedCategory = await prisma.categoria.update({
                where: { id: Number(id) },
                data: {
                    nombre: nombre || categoria.nombre,
                    popular: popular || categoria.popular,
                    imagen: imagen || categoria.imagen,
                    descripcion: descripcion || categoria.descripcion,
                }
            })
            res.json(updatedCategory)
        } catch (error) {
            return CategoryController.handleError(error, res)
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params
            if (!id) throw CustomError.badRequest("No se encontro el id")
            if (!Number(id)) throw CustomError.badRequest("El id debe ser un numero")

            const { vendedor, administrador } = req.body
            const categoria = await prisma.categoria.findUnique({
                where: { id: Number(id) },
                include: {
                    administrador: true,
                    vendedor: true,
                }
            })
            if (!categoria) throw CustomError.badRequest("No se encontro la categoria")
            if (categoria.vendedorId !== vendedor?.id && categoria.administradorId !== administrador?.id) {
                throw CustomError.badRequest("No se puede eliminar categorias de otro usuario")
            }
            await prisma.categoria.delete({
                where: { id: Number(id) }
            })
            res.json({ msg: "Categoria eliminada" })
        } catch (error) {
            return CategoryController.handleError(error, res)
        }
    }
}