import { Rol } from "../../"

export class RegisterDto {
    constructor(
        public readonly nombre: string,
        public readonly apellido: string,
        public readonly email: string,
        public readonly password: string,
        public readonly rol: Rol,
    ) { }

    static create(props: { [key: string]: any }): [string?, RegisterDto?] {
        const { nombre, apellido, email, password, rol } = props

        if (!nombre) return ["Nombre es requerido"]
        if (!apellido) return ["Apellido es requerido"]
        if (!email) return ["Email es requerido"]
        if (!password) return ["Password es requerido"]
        if (!rol) return ["Rol es requerido"]
        const rolesValidos = [Rol.ADMINISTRADOR, Rol.CLIENTE, Rol.MODERADOR]
        if (!rolesValidos.includes(rol)) return [`El rol ${rol} no es valido los roles validos son ${rolesValidos.join(", ")}`]

        return [undefined, new RegisterDto(nombre, apellido, email, password, rol)]
    }
}