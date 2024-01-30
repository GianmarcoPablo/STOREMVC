import bcryp from "bcrypt"

export class BcryptAdapter {
    static async hash(password: string): Promise<string> {
        const salt = await bcryp.genSalt(10);
        return await bcryp.hash(password, salt);
    }

    static async compare(password: string, hash: string): Promise<boolean> {
        return await bcryp.compare(password, hash);
    }
}