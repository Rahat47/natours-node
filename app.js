import path from 'path'
import express from 'express'
import cors from 'cors'
import morgan from "morgan";
import tourRouter from './routes/tourRoutes.js'
import userRouter from './routes/userRoutes.js'
import reviewRouter from './routes/reviewRoutes.js'
import viewRouter from './routes/viewRoutes.js'
import AppError from './utils/appError.js'
import { globalErrorHandler } from './controllers/errorController.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean'
import hpp from 'hpp'
import cookieParser from 'cookie-parser'

const __dirname = path.resolve()
//!DEEFINE THE APP
const app = express()

//? Global MIDDLEWARES
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

//? Serving Static files
app.use(express.static(path.join(__dirname, 'public')))

//?HELMET PACKAGE TO ADD SECURITY HTTP HEADERS
app.use(helmet())

//? Using morgan as dev environment
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

//? Rate LIMITER
//? Limits request from a same IP to 300 per hours
const limiter = rateLimit({
    max: 300,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from the same IP, Please try again in an Hour! "
})
app.use('/api', limiter)

//?ENABLES CROSS ORIGIN RESOURCE SHARING
app.use(cors())

//? Express Middlewares, Body Parser
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(cookieParser())

//? Data Sanitization against noSQL query injection
app.use(mongoSanitize());

//? Data Sanitization against XSS Attacks
app.use(xss());

//? parameter pollution prevent
app.use(hpp({
    whitelist: [
        "duration",
        "ratingsAverage",
        "ratingsQuantity",
        "maxGroupSize",
        "difficulty",
        "price"
    ]
}))



//?Simple Middleware..
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})
//? Routes

app.use('/', viewRouter)
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/reviews", reviewRouter)

app.get('/', (req, res) => {
    res.send('Welcome to natours API')
})


app.all("*", (req, res, next) => {
    const err = new AppError(`Sorry, we can't find ${req.originalUrl} in the server!`, 404)
    next(err)
})


app.use(globalErrorHandler)

export default app