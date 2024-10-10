import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log('connecting.... mongoDb')
        await mongoose.connect(process.env.MONGO_URI)
        console.log('mongoDB connected successfully!')
    } catch (err) {
        console.log(err)
    }
}

export default connectDB;