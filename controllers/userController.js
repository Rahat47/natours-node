import User from "../models/userModel.js"
import { catchAsync } from "../utils/catchAsync.js"
import AppError from '../utils/appError.js'
import { deleteOne, getAll, getOne, updateOne } from "./handlerFactory.js"


const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el]
        }
    })

    return newObj
}


export const getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}

export const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: "success",
        data: null
    })
})


export const updateMe = catchAsync(async (req, res, next) => {
    //Create error if user posts password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError("This is route is not for password updates please use /updatePassword route ", 400))
    }

    //Filter user passed data for unwanted field names
    const filteredBody = filterObj(req.body, 'name', 'email')

    //Update the user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody,
        {
            new: true, runValidators: true
        })

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    })
})



export const getAllUsers = getAll(User)
export const updateUser = updateOne(User)
export const getUser = getOne(User)
export const deleteUser = deleteOne(User)

export const createUser = (req, res) => {
    res.status(500).json({
        status: "failed",
        message: "Route is not Defined! Please use /signup instead."
    })
}