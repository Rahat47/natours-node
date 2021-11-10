import express from 'express'
import { isLoggedIn, protect } from '../controllers/authController.js'
import { getLoginForm, getOverview, getTour } from '../controllers/viewsController.js'

const router = express.Router()

router.use(isLoggedIn)

router.get('/', getOverview)

router.get('/tour/:slug', isLoggedIn, getTour)

router.get('/login', getLoginForm)
router.get('/me', protect)
export default router