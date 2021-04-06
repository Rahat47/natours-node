import path from 'path'
import express from 'express'
import cors from 'cors'
import morgan from "morgan";
import tourRouter from './routes/tourRoutes.js'
import userRouter from './routes/userRoutes.js'
import { nodeEnv } from './variables.js';

const __dirname = path.resolve()
//!DEEFINE THE APP
const app = express()

//?MIDDLEWARES
if (nodeEnv === "development") {
    app.use(morgan("dev"))
}

app.use(cors())
app.use(express.json())
app.use(express.static(`${__dirname}/public`))

//?Simple Middleware..
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})
//? Routes
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

app.get('/', (req, res) => {
    res.send('GET request to the homepage')
})

export default app