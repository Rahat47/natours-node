import Tour from '../models/tourModel.js'
import APIFeatures from '../utils/apiFeatures.js'
import { catchAsync } from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
export const aliasTopTours = async (req, res, next) => {
    req.query.limit = "5"
    req.query.sort = "price,-ratingsAverage"
    req.query.fields = "name,price,ratingsAverage,summary,difficulty"
    next()
}

export const getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()

    const tours = await features.query

    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours
        }
    })
})

export const getTour = catchAsync(async (req, res, next) => {
    const id = req.params.id

    const tour = await Tour.findById(id)
    if (!tour) {
        return next(new AppError("No Tour Found With this ID, Please Check The ID", 404))
    }
    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    })
})

export const updateTour = catchAsync(async (req, res, next) => {
    const id = req.params.id

    const tour = await Tour.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    })
    if (!tour) {
        return next(new AppError("No Tour Found With this ID, Please Check The ID", 404))
    }
    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    })
})

export const deleteTour = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const tour = await Tour.findByIdAndDelete(id)

    if (!tour) {
        return next(new AppError("No Tour Found With this ID, Please Check The ID", 404))
    }
    res.status(204).json({
        status: "success",
        data: null
    })
})


export const createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
        status: "success",
        data: {
            tour: newTour
        }
    })
})

export const getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: "$difficulty" },
                // _id: { $toUpper: "$duration" },
                // _id: { $toUpper: "$createdAt" },
                // _id: "$ratingsAverage",
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
        // {
        //     $match: { _id: { $ne: "EASY" } }
        // }
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