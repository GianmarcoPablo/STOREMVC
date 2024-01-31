import { Router } from "express";
import { IsAuthMiddleware } from "../../middlewares/isAuth.middleware";
import { PermisionMiddleware } from "../../middlewares/permision.middleware";
import { CategoryController } from "../../controller";

export class CategoryRoutes {
    static get routes(): Router {


        const router = Router();

        router.get("/", [IsAuthMiddleware.verify, PermisionMiddleware.verify], CategoryController.getAll)

        router.get("/:id", [IsAuthMiddleware.verify, PermisionMiddleware.verify], CategoryController.getById)

        router.post("/", [IsAuthMiddleware.verify, PermisionMiddleware.verify], CategoryController.create)

        router.put("/:id", [IsAuthMiddleware.verify, PermisionMiddleware.verify], CategoryController.update)

        router.delete("/:id", [IsAuthMiddleware.verify, PermisionMiddleware.verify], CategoryController.delete)

        return router;
    }
}