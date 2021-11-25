import Tour from "../models/tourModel.js"
import User from "../models/userModel.js"
import AppError from "../utils/appError.js"
import { catchAsync } from "../utils/catchAsync.js"

export const getOverview = catchAsync(async (req, res, next) => {

    // get all the tour data from collection
    const tours = await Tour.find()
    // build template

    res.status(200)
        .set({
            'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"
        })
        .render('overview', {
            title: 'All Tours',
            year: new Date().getFullYear(),
            tours
        })
})

export const getTour = catchAsync(async (req, res, next) => {
    // get the data for the requested tour
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    })

    if (!tour) {
        return next(new AppError('No tour found with that name', 404))
    }

    // render template using tour data from db

    res.status(200)
        .set({
            'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * data: blob: 'unsafe-inline' 'unsafe-eval'; connect-src * data: blob: 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src * data: blob: ; style-src * data: blob: 'unsafe-inline'; font-src * data: blob: 'unsafe-inline'; worker-src * data: blob: 'unsafe-inline';"
        })
        .render('tour', {
            title: tour.name,
            year: new Date().getFullYear(),
            tour
        })
})


export const getLoginForm = (req, res) => {
    res.status(200)
        .set({
            'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"
        })
        .render('login', {
            title: 'Log into your account',
            year: new Date().getFullYear()
        })
}

export const getAccount = (req, res) => {
    res.status(200)
        .set({
            'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"
        })
        .render('account', {
            title: 'Your account',
            year: new Date().getFullYear()
        })
}


export const updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    })

    res.status(200)
        .set({
            'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"
        })
        .render('account', {
            title: 'Your account',
            year: new Date().getFullYear(),
            user: updatedUser
        })
})
