
export class LoginDto {
    constructor(
        public readonly email: string,
        public readonly password: string,
    ) { }

    static create(props: { [key: string]: any }): [string?, LoginDto?] {
        const { email, password } = props

        if (!email) return ["Email es requerido"]
        if (!password) return ["Password es requerido"]


        return [undefined, new LoginDto(email, password)]
    }
}