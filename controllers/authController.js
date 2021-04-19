import { promisify } from 'util'
import jwt from 'jsonwebtoken'
import User from "../models/userModel.js";
import { catchAsync } from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import sendEmail from '../utils/email.js';
import crypto from 'crypto'

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000)
        ),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true
    }

    res.cookie('jwt', token, cookieOptions)

    user.password = undefined

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user
        }
    })
}

export const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    })

    createSendToken(newUser, 201, res)
})

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    // 1?IF email password exist
    if (!email || !password) {
        return next(new AppError("Please provide an email and password", 400))
    }
    // 2) Check IF User exists && password is correct
    const user = await User.findOne({ email }).select("+password")

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect Email or Password", 401))
    }
    //3) if everything is ok, send token to client
    createSendToken(user, 200, res)
})


export const protect = catchAsync(async (req, res, next) => {
    let token;
    // Getting the Token and check if it exists
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        return next(new AppError("You are not Logged In. Please Log In to continue", 401))
    }
    //Validate the Token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // Check if user still exists
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        return next(new AppError("The user belonging to this token does no longer exists.", 401))
    }
    // Check if user changed passwords after the token was issued

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError("User recently changed password! Please Log In again.", 401))
    }
    //Grant access to protected route.
    req.user = currentUser
    next()
})

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        //Roles is an array
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to perform this action", 403))
        }
        next()
    }
}


export const forgotPassword = catchAsync(async (req, res, next) => {
    //get user based on posted email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new AppError("There is no user associated with this email", 404))
    }
    //generate the random token
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })
    //send it back as an email
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`

    const message = `Forgot Your Password.??? Submit a PATCH request with your password and passwordConfirm to : ${resetURL}. \n If you didn't forgot your password, then simply ignore this email.`

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password Reset Token (Valid For 10 Min) ",
            message
        })
    } catch (error) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })

        return next(new AppError("There was an error sending the email. Please try again later", 500))
    }



    res.status(200).json({
        status: "success",
        message: "Token send to Email!"
    })
})

export const resetPassword = catchAsync(async (req, res, next) => {
    //Get user based on the token
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    })

    //If token is not expired and there is a user, set new password
    if (!user) {
        return next(new AppError("Token is invalid or expired", 400))
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save()
    //update changedPassword Property for the current user
    //log the user in
    createSendToken(user, 200, res)
})


export const updatePassword = catchAsync(async (req, res, next) => {
    // Get the user from the collection
    const user = await User.findById(req.user.id).select("+password")

    if (!user) {
        return next(new AppError("Token is invalid or expired. Please log in to continue.", 401))
    }
    //check if posted password is correct
    const currentPassword = req.body.currentPassword
    if (!await user.correctPassword(currentPassword, user.password)) {
        return next(new AppError("Invalid password!!!, Please provide the correct current password again.", 401))
    }

    //check if new password is same as current password
    if (await user.correctPassword(req.body.password, user.password)) {
        return next(new AppError("You are already using this password. Please Enter a different password."))
    }
    //if the password is correct & new, then update the password
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()
    //log user in again, send JWT
    createSendToken(user, 200, res)
})