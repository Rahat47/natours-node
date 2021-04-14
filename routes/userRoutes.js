import express from 'express'
import { forgotPassword, login, protect, resetPassword, signup, updatePassword } from '../controllers/authController.js'
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from '../controllers/userController.js'

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)

router.post("/forgotPassword", forgotPassword)
router.patch("/resetPassword/:token", resetPassword)

router.patch("/updatePassword", protect, updatePassword)

router.route("/")
    .get(getAllUsers)
    .post(createUser)

router.route("/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

export default router