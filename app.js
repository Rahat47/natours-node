import express from 'express'
import cors from 'cors'
import morgan from "morgan";

import tourRouter from './routes/tourRoutes.js'
import userRouter from './routes/userRoutes.js'

//!DEEFINE THE APP
const app = express()

//!MIDDLEWARES
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})
//! Routes
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)



const port = 5000
app.listen(port, () => {
    console.log(`App running on port ${port}`);
})