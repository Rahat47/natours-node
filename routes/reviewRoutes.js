import express from 'express'
import { protect, restrictTo } from '../controllers/authController.js'
import { createReview, deleteReview, getAllReviews, getReview, setTourAndUserId, updateReview } from '../controllers/reviewController.js'


const router = express.Router({
    mergeParams: true
})

// Protect all routes after this middleware
router.use(protect)

router.route('/')
    .get(getAllReviews)
    .post(restrictTo("user"), setTourAndUserId, createReview)

router.route('/:id')
    .delete(restrictTo("admin", 'user'), deleteReview)
    .patch(restrictTo("admin", 'user'), updateReview)
    .get(getReview)


export default router