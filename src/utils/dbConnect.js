import mongoose from "mongoose";

const dbConnect = async () => {

    await mongoose.connect(process.env.DATABASE_URL).then(() => {
        console.log("Database is connected!")
    }).catch((err) => {
        console.log(err)
    })
}

export default dbConnect