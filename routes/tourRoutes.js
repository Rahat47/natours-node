import express from 'express'
import { protect } from '../controllers/authController.js'
import { aliasTopTours, createTour, deleteTour, getAllTours, getMonthlyPlan, getTour, getTourStats, updateTour } from '../controllers/tourController.js'

const router = express.Router()

router.route('/top-five-cheap')
    .get(aliasTopTours, getAllTours)

router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)

router.route('/')
    .get(protect, getAllTours)
    .post(createTour)

router.route("/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(protect, deleteTour)

export default router
