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

    // render template using tour data from db

    res.status(200)
        .set({
            'Content-Security-Policy': "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
        })
        .render('tour', {
            title: tour.name,
            year: new Date().getFullYear(),
            tour
        })
})