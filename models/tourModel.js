import mongoose from 'mongoose'
import slugify from 'slugify'
// import User from './userModel.js';
// import validator from 'validator'
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name!"],
        unique: true,
        trim: true,
        maxlength: [40, "A tour name must contained within 40 characters"],
        minlength: [10, "A tour name must have more than 10 characters"],
        // validate: [validator.isAlpha, "A tour name must only contain Characters"]
    },
    slug: String,
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
        required: [true, "A tour must have a Difficulty!"],
        enum: {
            values: ["easy", "medium", "difficult"],
            message: "Difficulty can only be Easy Or Medium Or Difficult"
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be avobe 1.0"],
        max: [5, "Rating cannot exceed 5.0"]
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price!"]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                //?NOT GONNA WORK WITH UPDATE FUNCTION
                return val < this.price;
            },
            message: "Discount Price ({VALUE}) cannot be greater than the actual price"
        }
    },
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
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        // geoJSON
        type: {
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String

    },
    locations: [
        {
            type: {
                type: String,
                default: "Point",
                enum: ["Point"]
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ]

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7
})

// Virtual Populate
tourSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "tour",
    localField: "_id"
})

//DOCUMENT MIDDLEWARE, runs before save and create command
tourSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

// tourSchema.pre("save", async function (next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id))

//     this.guides = await Promise.all(guidesPromises)

//     next()
// })
//QUERY MIDDLEWARE, 

// tourSchema.pre("find", function (next) {
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })
    this.start = Date.now()
    next()
})

// create a tourSchema pre middleware with regex /^find/ and in the callback function body call next with a populate query
tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: "guides",
        select: "-__v -passwordChangedAt"
    })
    next()
})

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query finished in ${Date.now() - this.start} ms!`);
    next()
})

//AGGREGATION MIDDLEWARE,
tourSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    next()
})


const Tour = mongoose.model('Tour', tourSchema)


export default Tour
