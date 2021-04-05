import express from 'express'
import { checkTourBody, checkTourId, createTour, deleteTour, getAllTours, getTour, updateTour } from '../controllers/tourController.js'

const router = express.Router()


router.param('id', checkTourId)

router.route('/')
    .get(getAllTours)
    .post(checkTourBody, createTour)

router.route("/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

export default router
