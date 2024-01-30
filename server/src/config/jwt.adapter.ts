import jwt from "jsonwebtoken"
export class JwtAdapter {
    constructor(private readonly secret: string) { }

    async generateToken(payload: any, duration: string = "30d"): Promise<string | null> {
        return new Promise((resolve) => {
            jwt.sign(payload, this.secret, { expiresIn: duration }, (err, token) => {
                if (err) return resolve(null)
                resolve(token!)
            })
        })
    }

    async verify(token: string): Promise<any> {
        return new Promise((resolve) => {
            jwt.verify(token, this.secret, (err, decoded) => {
                if (err) return resolve(null)
                resolve(decoded)
            })
        })
    }
}