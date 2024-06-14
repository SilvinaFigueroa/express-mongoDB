import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import grades from './routes/grades.mjs'

const PORT = process.env.PORT || 5000
const app = express()

// Body-parser middleware
app.use(express.json())

// Set route 
app.use('/grades', grades)

app.get('/', (req,res)=>{
    res.send("<h1 style='color: skyblue'>Welcome to the API</h1>")
})


// Global error handling middlware
app.use((err,req,res,next)=>{
    res.status(500).send("Seems like this is not working")
})


app.listen(PORT, ()=>{
    console.log(`The server is running in port ${PORT}`)
})

// running a side-effect
import './db/conn.mjs'