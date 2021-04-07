import express from 'express'
import { aliasTopTours, createTour, deleteTour, getAllTours, getTour, getTourStats, updateTour } from '../controllers/tourController.js'

const router = express.Router()

router.route('/top-five-cheap')
    .get(aliasTopTours, getAllTours)

router.route('/tour-stats').get(getTourStats)

router.route('/')
    .get(getAllTours)
    .post(createTour)

router.route("/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

export default router
