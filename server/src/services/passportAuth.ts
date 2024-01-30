import passport, { use } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { envs } from '../config';
import { prisma } from "../model/connect"
import { v4 as uuidv4 } from 'uuid';


export const googleAuthEstragegy = new GoogleStrategy(
    {
        clientID: envs.CLIENT_ID,
        clientSecret: envs.CLIENT_SECRET,
        callbackURL: "http://localhost:4000/api/v1/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Encontrar usuario o crear uno nuevo con los datos de perfil
            const user = await findOrCreateUser(profile);

            // Retornar usuario
            done(null, user);

        } catch (error: any) {
            console.log(error);
            done(error);
        }
    }
)

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
    try {
        const user = await prisma.usuario.findUnique({
            where: {
                id: id,
            },
        });

        done(null, user);
    } catch (error) {
        console.log(error);
        done(error);
    }
});


export const findOrCreateUser = async (profile: any) => {
    try {
        let user = await prisma.usuario.findFirst({
            where: {
                googleId: profile.id,
            },
        });

        // Si no existe el usuario, lo creamos
        if (!user) {
            user = await prisma.usuario.create({
                data: {
                    email: profile.emails[0].value,
                    nombre: profile.name.givenName,
                    apellido: profile.name.familyName || "",
                    googleId: profile.id,
                    rol: "CLIENTE",
                    password: generatePasswordWithGoogle()
                }
            })
        }


        // Si el usuario no tiene un cliente, lo creamos
        if (!user.tieneCliente) {
            await prisma.cliente.create({
                data: {
                    usuarioId: user.id
                }
            })

            await prisma.usuario.update({
                where: {
                    id: user.id
                },
                data: {
                    tieneCliente: true
                }
            })
        }

        return user;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

function generatePasswordWithGoogle() {
    return uuidv4();
}


