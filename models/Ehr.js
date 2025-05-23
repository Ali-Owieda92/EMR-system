import mongoose from 'mongoose';

const ehrSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  vitals: {
    heartRate: Number,
    bloodPressure: String,
    temperature: Number,
    weight: Number,
    height: Number,
  },
  diagnosis: String,
  medications: [
    { name: String, dosage: String, duration: String }
  ],
  labResults: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LabTest',
    }
  ]
}, {
  timestamps: true,
});

const EHR = mongoose.model('EHR', ehrSchema);
export default EHR;
