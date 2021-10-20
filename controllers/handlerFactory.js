import APIFeatures from "../utils/apiFeatures.js"
import AppError from "../utils/appError.js"
import { catchAsync } from "../utils/catchAsync.js"


export const deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) {
        return next(new AppError("No Document Found With this ID, Please Check The ID", 404))
    }

    res.status(204).json({
        status: "success",
        data: null
    })
})

export const updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!doc) {
        return next(new AppError("No Document Found With this ID, Please Check The ID", 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            data: doc
        },
        message: "Document Updated Successfully"
    })
})

export const createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body)

    res.status(201).json({
        status: "success",
        data: {
            data: doc
        },
        message: "Document Created Successfully"
    })
})

export const getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)

    // check if popOptions is passed and not an empty object
    if (popOptions && Object.keys(popOptions).length > 0) {
        query = query.populate(popOptions)
    }

    const doc = await query

    if (!doc) {
        return next(new AppError("No Document Found With this ID, Please Check The ID", 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            data: doc
        },
        message: "Document Fetched Successfully"
    })
})


export const getAll = Model => catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()

    const doc = await features.query.explain()
    // const doc = await features.query

    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        results: doc.length,
        data: {
            data: doc
        },
        message: "Documents Fetched Successfully"
    })
})