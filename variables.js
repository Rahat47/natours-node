import dotenv from 'dotenv'
dotenv.config({ path: './config.env' })

export const port = process.env.PORT
export const nodeEnv = process.env.NODE_ENV