import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    specialty: String,
    experience: Number,
    hospital: String,
    profilePic: String, 
}, {
    timestamps: true,
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
