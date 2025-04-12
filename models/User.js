import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name:
        { 
            type: String,
            required: true
        },
    email:
        { 
            type: String,
            required: true,
            unique: true 
        },
    phone:
        {
            type: String,
            required: true,
            unique: true
        },
    gender: 
        { 
            type: String, 
            required: true,
            enum: ["male", "female"] 
        },
    date_of_birth: 
        { 
            type: Date
        },
    city: {
        type: String,
        required: true,
        default: "Giza"
    },
    password: 
        { 
            type: String, 
            required: true 
        },
    role: 
        { 
            type: String, 
            enum: ["doctor", "patient", "admin"], 
            required: true 
        },
    specialization:
        { 
            type: String 
        },
        profile_image:
            { 
                type: String, 
                default: "" 
            },
},
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;