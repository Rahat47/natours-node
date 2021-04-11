import { promisify } from 'util'
import jwt from 'jsonwebtoken'
import User from "../models/userModel.js";
import { catchAsync } from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
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

    const token = signToken(newUser._id)


    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser
        }
    })
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
    const token = signToken(user._id)

    res.status(200).json({
        status: "success",
        token
    })
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