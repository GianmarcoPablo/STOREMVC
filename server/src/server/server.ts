import express, { Router } from 'express';
import path from 'path';
import cors from 'cors';
import passport from "passport"
import { googleAuthEstragegy } from '../services/passportAuth';
import session from 'express-session';

interface Options {
    port: number;
    routes: Router;
    public_path?: string;
}


export class Server {

    public readonly app = express();
    private serverListener?: any;
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor(options: Options) {
        const { port, routes, public_path = 'public' } = options;
        this.port = port;
        this.publicPath = public_path;
        this.routes = routes;
    }



    async start() {


        //* Middlewares
        this.app.use(cors({
            origin: true,
            credentials: true,
            
        }))
        this.app.use(express.json()); // raw
        this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

        this.app.use(session({
            secret: "secret",
            resave: false,
            saveUninitialized: false,
        }));

        this.app.use(passport.initialize());
        this.app.use(passport.session());
        passport.use(googleAuthEstragegy);
        //* Public Folder
        this.app.use(express.static(this.publicPath));

        //* Routes
        this.app.use(this.routes);

        //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api
        this.app.get(/^\/(?!api).*/, (req, res) => {
            const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
            res.sendFile(indexPath);
        });


        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server listening on port http://localhost:${this.port}`)
        });

    }

    public close() {
        this.serverListener?.close();
    }

}