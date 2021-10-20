import mongoose from 'mongoose'

export const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review is required'],
        trim: true,
        minlength: [10, 'Review must be at least 10 characters long'],
        maxlength: [500, 'Review must be less than 500 characters long']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be less than 5'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a User'],
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a Tour'],
    },

},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)


reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next()
})

const Review = mongoose.model('Review', reviewSchema)

export default Review