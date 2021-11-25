import express from 'express'
import { isLoggedIn, protect } from '../controllers/authController.js'
import { getAccount, getLoginForm, getOverview, getTour, updateUserData } from '../controllers/viewsController.js'

const router = express.Router()


router.get('/', isLoggedIn, getOverview)
router.get('/tour/:slug', isLoggedIn, getTour)
router.get('/login', isLoggedIn, getLoginForm)

router.get('/me', protect, getAccount)


router.post('/submit-user-data', protect, updateUserData)
export default router