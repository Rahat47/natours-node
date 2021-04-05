import fs from 'fs'
import path from 'path'

const __dirname = path.resolve();
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))


export const checkTourId = (req, res, next, val) => {
    const tour = tours.find(el => el.id === Number(val))
    // if (id > tours.length) {
    if (!tour) {
        return res.status(404).json({
            status: "failed",
            message: "Invalid Id"
        })
    }
    next()
}

export const getAllTours = (req, res) => {
    if (!tours) {
        return res.status(404).json({
            status: "failed",
            message: "No Tours Found"
        })
    }
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    })
}

export const getTour = (req, res) => {
    const id = req.params.id
    const tour = tours.find(el => el.id === Number(id))

    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    })
}

export const updateTour = (req, res) => {
    const id = req.params.id
    const tour = tours.find(el => el.id === Number(id))

    res.status(200).json({
        status: "success",
        data: {
            tour: "UPDATED TOUR HERE"
        }
    })
}

export const deleteTour = (req, res) => {
    const id = req.params.id
    const tour = tours.find(el => el.id === Number(id))
    res.status(204).json({
        status: "success",
        data: null
    })
}

export const createTour = (req, res) => {
    // console.log(req.body);

    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({ id: newId }, req.body)
    tours.push(newTour)

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        })
    })
}

export const checkTourBody = (req, res, next) => {
    const tour = req.body
    if (!tour.name || !tour.price) {
        return res.status(400).json({
            status: "failed",
            message: "Missing Price or Name for the Tour"
        })
    }
    next()
}
