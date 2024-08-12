dotenv.config({});

import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"

import connectDB from "./utils/dbConnection.js"


const app = express();
const PORT = process.env.PORT || 3000;

// middlewares 
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended: true}))
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
}
app.use(cors(corsOptions))


app.get('/', (req, res) => {
    return res.status(200).json({
        message: "I am coming from backend!",
        success: true
    })
})

app.listen(PORT, () => {
    connectDB();
    console.log(`server is running at PORT : ${PORT}`)
})