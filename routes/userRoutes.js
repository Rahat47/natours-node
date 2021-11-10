import express from 'express'
import { forgotPassword, login, logout, protect, resetPassword, restrictTo, signup, updatePassword } from '../controllers/authController.js'
import { createUser, deleteMe, deleteUser, getAllUsers, getMe, getUser, updateMe, updateUser } from '../controllers/userController.js'

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/logout", logout)
router.post("/forgotPassword", forgotPassword)
router.patch("/resetPassword/:token", resetPassword)

// Protect all routes after this middleware
router.use(protect)

router.get("/me", getMe, getUser)
router.patch("/updateMe", updateMe)
router.delete("/deleteMe", deleteMe)

router.patch("/updatePassword", updatePassword)


// Restrict all routes after this middleware
router.use(restrictTo('admin'))
router.route("/")
    .get(getAllUsers)
    .post(createUser)

router.route("/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

export default router