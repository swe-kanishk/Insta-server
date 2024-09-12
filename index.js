dotenv.config({});

import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js"
import messageRoutes from "./routes/message.routes.js"

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
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/message", messageRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`server is running at PORT : ${PORT}`)
})