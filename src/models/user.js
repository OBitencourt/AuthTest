import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "O campo 'nome' é obrigatório!"]
    },
    email: {
        type: String,
        required: [true, "O campo 'email' é obrigatório!"]
    },
    password: {
        type: String,
        required: [true, "O campo 'senha' é obrigatório!"]
    },
})

const UserModel = mongoose.model("User", userSchema)

export default UserModel