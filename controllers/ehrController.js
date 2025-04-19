import Ehr from "../models/Ehr.js";
import Patient from "../models/Patient.js";
import asyncHandler from 'express-async-handler';


export const addEhr = async (req, res) => {
  try {
    const { patient, name, age, photo, chronicDiseases, medications, familyHistory } = req.body;

    const ehr = new Ehr({
      patient,
      name,
      age,
      photo,
      chronicDiseases,
      medications,
      familyHistory
    });

    await ehr.save();
    res.status(201).json(ehr);
  } catch (error) {
    res.status(500).json({ message: "خطأ في إضافة السجل الطبي", error });
  }
};

export const getEhrByPatient = async (req, res) => {
    try {
        const ehr = await Ehr.findOne({ patient: req.params.patientId }).populate("patient", "name phone");
        if (!ehr) return res.status(404).json({ message: "No EHR found for this patient" });
        res.json(ehr);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateEhr = async (req, res) => {
    try {
        const updatedEhr = await Ehr.findOneAndUpdate(
            { patient: req.params.patientId },
            { $set: req.body },
            { new: true }
        );
        if (!updatedEhr) return res.status(404).json({ message: "EHR not found" });
        res.json(updatedEhr);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const addEhrData = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { doctorId, dataType, data } = req.body;

  const patient = await Patient.findById(patientId);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  const newEhr = await EHR.create({
    patient_id: patientId,
    doctor_id: doctorId,
    data_type: dataType,
    data,
  });

  res.status(201).json(newEhr);
});