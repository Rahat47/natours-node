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

//! JWT ERROR HANDLERS
const handleInvalidJWT = (err) => {
    const message = "You have provided an Invalid Token. Please Log In again"
    return new AppError(message, 401)
}

const handleExpiredJWT = (err) => {
    const message = `Your Current Logged In session expired at ${new Date(err.expiredAt).toDateString()}. Please Log in Again.`
    return new AppError(message, 401)
}

//!^^^^^^^^^^^^ JWT Error Handlers End ^^^^^^^^^^^^^//
const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        })
    } else {
        console.log("Error: ", err)
        // Render Error template
        res.status(err.statusCode).render("error", {
            title: "Something went wrong",
            msg: err.message,
        })
    }
}

const sendErrorProd = (err, req, res) => {
    // Operational , Trusted eror that we want to send to client
    if (req.originalUrl.startsWith("/api")) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            })

        }
        //Programming or other errors that we do not want to send to client
        console.error("Error: ", err)

        return res.status(500).json({
            status: "error",
            message: "Something went wrong."
        })

    }

    // ?Render Error template
    if (err.isOperational) {
        return res.status(err.statusCode).render("error", {
            title: "Something went wrong",
            msg: err.message,
        })

    }
    //Programming or other errors that we do not want to send to client
    console.error("Error: ", err)

    return res.status(500).render("error", {
        title: "Something went wrong",
        msg: "Please try again later.",
    })
}

export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res)

    } else if (process.env.NODE_ENV === 'production') {
        let error = Object.create(err);

        if (error.name === "CastError" || error.kind === "ObjectId") {
            error = handleCastErrorDB(error)
        }
        if (error.code === 11000) {
            error = handleDuplicateValueDB(error)
        }
        if (error.name === "ValidationError" || error._message === "Validation failed") {
            error = handleValidationErrorDB(error)
        }

        if (error.name === "JsonWebTokenError") {
            error = handleInvalidJWT(error)
        }
        if (error.name === "TokenExpiredError") {
            error = handleExpiredJWT(error)
        }

        sendErrorProd(error, req, res)
    }
}