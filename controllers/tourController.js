import Tour from '../models/tourModel.js'
import AppError from '../utils/appError.js'
import { catchAsync } from '../utils/catchAsync.js'
import { createOne, deleteOne, getAll, getOne, updateOne } from './handlerFactory.js'
export const aliasTopTours = async (req, res, next) => {
    req.query.limit = "5"
    req.query.sort = "price,-ratingsAverage"
    req.query.fields = "name,price,ratingsAverage,summary,difficulty"
    next()
}

export const getAllTours = getAll(Tour)
export const getTour = getOne(Tour, { path: 'reviews' })
export const updateTour = updateOne(Tour)
export const deleteTour = deleteOne(Tour)
export const createTour = createOne(Tour)

export const getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: "$difficulty" },
                numOfTours: { $sum: 1 },
                numOfRatings: { $sum: "$ratingsQuantity" },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: { avgPrice: -1 }
        },
    ])

    res.status(200).json({
        status: "success",
        data: {
            stats
        }
    })
})

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1

    const plan = await Tour.aggregate([
        { $unwind: "$startDates" },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: "$startDates" },
                numOfTours: { $sum: 1 },
                tours: { $push: "$name" },
                avgDuration: {
                    $sum: "$duration"
                }
            }
        },
        { $addFields: { month: "$_id" } },
        { $project: { _id: 0 } },
        { $sort: { numOfTours: -1 } },
        { $limit: 12 }
    ])

    res.status(200).json({
        status: "success",
        data: {
            plan
        }
    })
})

export const getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

    const [lat, lng] = latlng.split(',')

    if (!lat || !lng) {
        next(new AppError('Please provide latitute and longitude in the format lat,lng', 400))
    }

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })

    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            data: tours
        },
        message: "Data fetched successfully"
    })

})


export const getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params

    const [lat, lng] = latlng.split(',')

    if (!lat || !lng) {
        next(new AppError('Please provide latitute and longitude in the format lat,lng', 400))
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: "distance",
                distanceMultiplier: unit === 'mi' ? 0.000621371 : 0.001
            }
        },
        {
            $project: {
                distance: 1,
                name: 1,
            }
        }
    ])

    res.status(200).json({
        status: "success",
        data: {
            data: distances
        },
        message: "Data fetched successfully"
    })
})
