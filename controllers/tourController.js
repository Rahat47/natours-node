import Tour from '../models/tourModel.js'
import APIFeatures from '../utils/apiFeatures.js'

export const aliasTopTours = async (req, res, next) => {
    req.query.limit = "5"
    req.query.sort = "price,-ratingsAverage"
    req.query.fields = "name,price,ratingsAverage,summary,difficulty"
    next()
}

export const getAllTours = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: "failed",
            message: error.message
        })
    }
}

export const getTour = async (req, res) => {
    try {
        const id = req.params.id

        const tour = await Tour.findById(id)
        if (!tour) {
            throw new Error("There is no Tour with this ID, Please Check The ID")
        }
        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        })
    } catch (error) {
        res.status(404).json({
            status: "failed",
            message: error.message
        })
    }
}

export const updateTour = async (req, res) => {
    try {
        const id = req.params.id
        const tour = await Tour.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        })
    } catch (error) {
        res.status(404).json({
            status: "failed",
            message: error.message
        })
    }
}

export const deleteTour = async (req, res) => {
    try {
        const id = req.params.id
        await Tour.findByIdAndDelete(id)

        res.status(204).json({
            status: "success",
            data: null
        })
    } catch (error) {
        res.status(404).json({
            status: "failed",
            message: error.message
        })
    }
}

export const createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}

export const getTourStats = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}