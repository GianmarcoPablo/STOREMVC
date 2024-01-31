import { Router } from "express";
import { IsAuthMiddleware } from "../../middlewares/isAuth.middleware";

export class ProductRoutes {
    static get routes(): Router {
        const router = Router()

        router.get("/", IsAuthMiddleware.verify)
        router.get("/:id", IsAuthMiddleware.verify)
        router.post("/", IsAuthMiddleware.verify)
        router.put("/:id", IsAuthMiddleware.verify)

        return router
    }
}