import AppError from '../utils/appError.js'

//!MongoDB ERROR HANDLERS
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateValueDB = (err) => {
    const message = `There is another document with the Name "${err.keyValue.name}". The Name must be unique,`
    return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(er => er.message)

    const message = `Invalid Input Data. ${errors.join(". ")}`
    return new AppError(message, 400)
}
//!^^^^^^^^^^^^ MongoDB Error Handlers End ^^^^^^^^^^^^^//

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

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)

    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }
        console.log(error);
        if (error.name === "CastError" || error.kind === "ObjectId") {
            error = handleCastErrorDB(error)
        }
        if (error.code === 11000) {
            error = handleDuplicateValueDB(error)
        }
        if (error.name === "ValidationError" || error._message === "Validation failed") {
            error = handleValidationErrorDB(error)
        }

        sendErrorProd(error, res)
    }
}