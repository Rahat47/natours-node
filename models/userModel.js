import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name!"],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Please enter an Email address"],
        validate: [validator.isEmail, "Please Provide a valid Email address."],
        unique: [true, "Email address must be unique"],
        lowercase: true
    },
    photo: String,
    password: {
        type: String,
        required: [true, "A password is required to continue"],
        minlength: [8, "Password must be at least 8 characters long"],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password."],
        validate: {
            //?This only works on Save & Create !!!
            validator: function (el) {
                return el === this.password
            },
            message: "Password and Confirm Password Does Not Match!!!"
        }
    },
    passwordChangedAt: Date
})


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()

})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}


userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        const state = JWTTimestamp < changedTimestamp
        return state
    }

    return false
}


const User = mongoose.model("User", userSchema)

export default User