import mongoose from 'mongoose';

const labTestSchema = mongoose.Schema(
    {
        patientId: {
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
            required: false,
        },
        remarks: {
            type: String,
            required: false,
        },
        retestRequired: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    { timestamps: true }
);

const LabTest = mongoose.model('LabTest', labTestSchema);

export default LabTest;