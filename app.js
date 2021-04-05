import fs from 'fs'
import path from 'path'
import express from 'express'
import cors from 'cors'
const app = express()

//?Dirname problem solved
const __dirname = path.resolve();


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours
        }
    })
})

app.get('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id
    const tour = tours.find(el => el.id === Number(id))

    // if (id > tours.length) {
    if (!tour) {
        return res.status(404).json({
            status: "failed",
            message: "Invalid Id"
        })
    }
    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    })
})



app.post('/api/v1/tours', (req, res) => {
    // console.log(req.body);

    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({ id: newId }, req.body)
    tours.push(newTour)

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        })
    })

})

const port = 5000
app.listen(port, () => {
    console.log(`App running on port ${port}`);
})