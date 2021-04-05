import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())



app.get("/", (req, res) => {
    res.send("Hello from natours API")
})


const port = 5000
app.listen(port, () => {
    console.log(`App running on port ${port}`);
})