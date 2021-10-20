import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from '../../models/tourModel.js';
import path from 'path';
import User from '../../models/userModel.js';
import Review from '../../models/reviewModel.js';

const __dirname = path.resolve();
console.log(__dirname);
dotenv.config()

const dburi = `mongodb+srv://natours:eSdmxy1t5VJ1yLYe@azurehk.jxbko.mongodb.net/natours?retryWrites=true&w=majority`


mongoose.connect(dburi, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => console.log('DB connection successful!'))
    .catch(err => console.log(err));

// READ JSON FILE
const tours = JSON.parse(readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// const users = JSON.parse(readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(
//     readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// );

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
        // await User.create(users, { validateBeforeSave: false });
        // await Review.create(reviews);
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        // await User.deleteMany();
        // await Review.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}