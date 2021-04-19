import app from "./app.js";
import mongoose from 'mongoose'
import chalk from 'chalk'

const dburi = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@azurehk.jxbko.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

//?LAST STAND FOR ERRORS
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXEPTION 💥💥 app is shutting down....");
    console.log(err.name, err.message);
    process.exit(1)
})


mongoose.connect(dburi, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    console.log(chalk.bold.yellowBright("database connected and running"));
}).catch(err => {
    console.log(err);
})
const port = process.env.PORT

const server = app.listen(port, () => {
    console.log(chalk.bold.blueBright(`App running on port ${port}`));
})

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION 💥💥 app is shutting down....");
    server.close(() => {
        process.exit(1)
    })
})
