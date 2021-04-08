import { nodeEnv } from "../variables.js"
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    })
}

const sendErrorProd = (err, res) => {
    // Operational , Trusted eror that we want to send to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })

    } else {
        //Programming or other errors that we do not want to send to client
        console.error("Error: ", err)

        res.status(500).json({
            status: "error",
            message: "Something went wrong."
        })
    }

}

export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

    if (nodeEnv === 'development') {
        sendErrorDev(err, res)
    } else if (nodeEnv === 'production') {
        sendErrorProd(err, res)
    }
}