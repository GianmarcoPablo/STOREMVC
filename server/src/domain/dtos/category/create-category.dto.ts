
export class CreateCategoryDto {
    constructor(
        public readonly nombre: string,
        public readonly popular?: boolean,
        public readonly imagen?: string,
        public readonly descripcion?: string,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateCategoryDto?] {

        const { nombre, popular, imagen, descripcion } = props

        if (!nombre) return ["El nombre es requerido"]

        return [undefined, new CreateCategoryDto(nombre, popular, imagen, descripcion)]
    }
}