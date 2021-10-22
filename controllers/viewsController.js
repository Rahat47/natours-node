import Tour from "../models/tourModel.js"
import { catchAsync } from "../utils/catchAsync.js"

export const getOverview = catchAsync(async (req, res, next) => {

    // get all the tour data from collection
    const tours = await Tour.find()
    // build template

    // render template using tour data from db


    res.status(200).render('overview', {
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

    // build template

    // render template using tour data from db

    res.status(200).render('tour', {
        title: tour.name,
        year: new Date().getFullYear(),
        tour
    })
})