export interface User {
    id?: number;
    email: string;
    nombre: string;
    apellido: string;
    password: string;
    rol: string;
    tieneCliente: boolean;
    googleId?: string;
}

