import app from "./app.js";
import chalk from 'chalk'
import { port } from "./variables.js";


app.listen(port, () => {
    console.log(chalk.bold.blueBright(`App running on port ${port}`));
})