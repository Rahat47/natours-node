import mongoose from 'mongoose'
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name!"],
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, "A tour must have a duration!"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a Group Size!"]
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a Difficulty!"]
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price!"]
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, "A Tour must have a summary"]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have a cover Image"]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
})

const Tour = mongoose.model('Tour', tourSchema)


export default Tour
