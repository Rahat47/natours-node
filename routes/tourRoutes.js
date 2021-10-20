import express from 'express'
import { protect, restrictTo } from '../controllers/authController.js'
import { aliasTopTours, createTour, deleteTour, getAllTours, getMonthlyPlan, getTour, getTourStats, updateTour } from '../controllers/tourController.js'
import reviewRouter from './reviewRoutes.js'

const router = express.Router()

// router.route('/:tourId/reviews')
//     .post(protect, restrictTo("user"), createReview)

router.use('/:tourId/reviews', reviewRouter)

router.route('/top-five-cheap')
    .get(aliasTopTours, getAllTours)

router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan)

router.route('/')
    .get(getAllTours)
    .post(protect, restrictTo('admin', 'lead-guide'), createTour)

router.route("/:id")
    .get(getTour)
    .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
    .delete(protect, restrictTo("admin", "lead-guide"), deleteTour)




export default router
