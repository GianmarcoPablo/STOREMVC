import 'dotenv/config';
import { get } from 'env-var';


export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  JWT_SEED: get('JWT_SEED').required().asString(),
  CLIENT_ID: get('CLIENT_ID').required().asString(),
  CLIENT_SECRET: get('CLIENT_SECRET').required().asString(),
}



