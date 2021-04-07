import app from "./app.js";
import mongoose from 'mongoose'
import chalk from 'chalk'
import { port, dbUser, dbPass, dbName } from "./variables.js";

const dburi = `mongodb+srv://${dbUser}:${dbPass}@azurehk.jxbko.mongodb.net/${dbName}?retryWrites=true&w=majority`


mongoose.connect(dburi, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log(chalk.bold.yellowBright("database connected and running"));
    //!LISTEN TO THE APP ONLY AFTED DB IS CONNECTED...
    app.listen(port, () => {
        console.log(chalk.bold.blueBright(`App running on port ${port}`));
    })
}).catch(err => {
    console.log(err);
})