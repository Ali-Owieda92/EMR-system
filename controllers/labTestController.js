import LabTest from "../models/LabTest.js";
import Patient from "../models/Patient.js";

export const uploadLabTest = async (req, res) => {
  const { patientId, testName, description } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const newLabTest = new LabTest({
    patient: patientId,
    testName,
    description,
    file: file.path,
  });

  await newLabTest.save();
  res.status(201).json({ success: true, message: "Lab test uploaded", data: newLabTest });
};

export const addLabTest = async (req, res) => {
  const {
    patientId,
    testType,
    testDate,
    testResult,
    file,
    remarks,
    retestRequired,
  } = req.body;

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const newLabTest = new LabTest({
      patientId,
      testType,
      testDate,
      testResult,
      file,
      remarks,
      retestRequired,
    });

    await newLabTest.save();
    res
      .status(201)
      .json({ message: "Lab test added successfully", newLabTest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLabTestsByPatient = async (req, res) => {
  const { patientId } = req.params;

  try {
    const labTests = await LabTest.find({ patientId });
    res.status(200).json(labTests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLabTestDetails = async (req, res) => {
  const { testId } = req.params;

  try {
    const labTest = await LabTest.findById(testId);
    if (!labTest) {
      return res.status(404).json({ message: "Lab test not found" });
    }
    res.status(200).json(labTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLabTest = async (req, res) => {
  const { testId } = req.params;
  const { testResult, remarks, retestRequired } = req.body;

  try {
    const updatedLabTest = await LabTest.findByIdAndUpdate(
      testId,
      { testResult, remarks, retestRequired },
      { new: true }
    );
    if (!updatedLabTest) {
      return res.status(404).json({ message: "Lab test not found" });
    }
    res
      .status(200)
      .json({ message: "Lab test updated successfully", updatedLabTest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLabTest = async (req, res) => {
  const { testId } = req.params;

  try {
    const labTest = await LabTest.findByIdAndDelete(testId);
    if (!labTest) {
      return res.status(404).json({ message: "Lab test not found" });
    }
    res.status(200).json({ message: "Lab test deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
