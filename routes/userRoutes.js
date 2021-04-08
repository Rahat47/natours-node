import express from 'express'
import { signup } from '../controllers/authController.js'
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from '../controllers/userController.js'

const router = express.Router()


router.post("/signup", signup)

router.route("/")
    .get(getAllUsers)
    .post(createUser)

router.route("/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

export default router