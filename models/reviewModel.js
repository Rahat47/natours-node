import mongoose from 'mongoose'

export const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review is required'],
        trim: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5,
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

const Review = mongoose.model('Review', reviewSchema)

export default Review