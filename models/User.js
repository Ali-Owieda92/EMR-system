import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {type: String ,required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true, unique: true},
    gender: {type: String, required: true, enum: ["male", "female"]},
    age: {type: Number},
    city: {type: String, default: "Giza"},
    role: {type: String, required: true, enum: ["doctor", "admin", "patient"]},
    password: {type: String}
});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;