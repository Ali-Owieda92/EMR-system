import mongoose from 'mongoose';

const labTestSchema = mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },
        testType: {
            type: String,
            required: true,
        },
        testDate: {
            type: Date,
            required: true,
        },
        testResult: {
            type: String,
            required: true,
        },
        file: {
            type: String,
        },
        remarks: {
            type: String,
        },
        retestRequired: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const LabTest = mongoose.model('LabTest', labTestSchema);

export default LabTest;