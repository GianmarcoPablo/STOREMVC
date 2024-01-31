import { Router } from "express";
import { AuthRoutes, CategoryRoutes, ProductRoutes } from "../routes";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        router.use("/api/v1/auth", AuthRoutes.routes);
        router.use("/api/v1/category", CategoryRoutes.routes);
        router.use("/api/v1/products", ProductRoutes.routes);

        return router;
    }
}
