import Ehr from "../models/Ehr.js";

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
export const addEhrData = async (req, res) => {
  const { patientId, diagnosis, medications, assigned_doctor } = req.body;

  const patient = await patient.findById(patientId);
  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }

  const newRecord = {
    diagnosis,
    medications,
    assigned_doctor,
    date: new Date(),
  };

  patient.medical_history.push(newRecord);
  await patient.save();

  res.status(201).json({ success: true, message: "EHR data added", data: patient.medical_history });
};