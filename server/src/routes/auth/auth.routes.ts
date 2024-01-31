import { Router } from "express";
import { AuthController } from "../../controller";
import passport, { use } from "passport";
import { JwtAdapter } from "../../config";
import { envs } from "../../config";
import { User } from "../../domain/types/interfaces/user.interface";


export class AuthRoutes {
    static get routes(): Router {
        const router = Router();

        router.post("/login", AuthController.login);

        router.post("/register", AuthController.register);

        router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));


        router.get("/google/callback", passport.authenticate("google", {
            failureRedirect: "/api/v1/auth/google/failure",
        }), async (req, res) => {
            const user = req.user as User
            console.log(user);
            const token = await new JwtAdapter(envs.JWT_SEED).generateToken({ id: user.id });
            return res.json({ user, token });
        });

        return router;
    }
}


