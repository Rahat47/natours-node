import Tour from '../models/tourModel.js'

export const aliasTopTours = async (req, res, next) => {
    req.query.limit = "5"
    req.query.sort = "price,-ratingsAverage"
    req.query.fields = "name,price,ratingsAverage,summary,difficulty"
    next()
}

export const getAllTours = async (req, res) => {
    //TODO BUILD QUERY
    //!1 Filtering
    const queryObject = { ...req.query }
    const exludedFields = ["page", "sort", "limit", "fields"]
    exludedFields.forEach(field => delete queryObject[field])

    //!2 Advanced Filtering
    let queryStr = JSON.stringify(queryObject)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    try {
        let query = Tour.find(JSON.parse(queryStr)).sort(req.query.sort)

        //!3 Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            query = query.sort("-createdAt")
        }

        //!4 Field Limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        } else {
            query = query.select("-__v")
        }

        //!5 Pagination
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 100
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)

        if (req.query.page) {
            const numTours = await Tour.countDocuments()
            if (skip > numTours) throw new Error("This page does not exist")
        }

        const tours = await query

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

