import dotenv from 'dotenv'
dotenv.config()

export const port = process.env.PORT
export const nodeEnv = process.env.NODE_ENV
export const dbName = process.env.DB_NAME
export const dbUser = process.env.DB_USER
export const dbPass = process.env.DB_PASSWORD