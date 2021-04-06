import Tour from '../models/tourModel.js'

export const getAllTours = async (req, res) => {

    try {
        const tours = await Tour.find()
        res.status(200).json({
            status: "success",
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (error) {
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

