import Ehr from "../models/Ehr.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import QRCode from "qrcode";

// ✅ Get EHR by Patient ID
export const getEhrByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const ehr = await Ehr.findOne({ patient: patientId }).populate("patient", "user_id").populate("doctor", "user_id");

    if (!ehr) {
      return res.status(404).json({ message: "EHR not found" });
    }

    res.status(200).json(ehr);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add EHR Data (doctor only)
export const addEhrData = async (req, res) => {
  try {
    const { patient, vitals, diagnosis, medications, labResults } = req.body;

    // Only doctors can create
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const existingEhr = await Ehr.findOne({ patient });
    if (existingEhr) {
      return res.status(400).json({ message: "EHR already exists for this patient" });
    }

    const newEhr = new Ehr({
      patient,
      doctor: req.user._id,
      vitals,
      diagnosis,
      medications,
      labResults,
    });

    await newEhr.save();
    res.status(201).json({ message: "EHR created successfully", ehr: newEhr });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update EHR
export const updateEhr = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { vitals, diagnosis, medications, labResults } = req.body;

    const ehr = await Ehr.findOne({ patient: patientId });

    if (!ehr) return res.status(404).json({ message: "EHR not found" });

    // Check permissions
    if (req.user.role !== "doctor" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    ehr.vitals = vitals || ehr.vitals;
    ehr.diagnosis = diagnosis || ehr.diagnosis;
    ehr.medications = medications || ehr.medications;
    ehr.labResults = labResults || ehr.labResults;

    await ehr.save();
    res.status(200).json({ message: "EHR updated successfully", ehr });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Download EHR as PDF
export const downloadEhrPdf = async (req, res) => {
  try {
    const { patientId } = req.params;
    const ehr = await Ehr.findOne({ patient: patientId }).populate("patient", "user_id").populate("doctor", "user_id");

    if (!ehr) return res.status(404).json({ message: "No EHR found for this patient" });

    const doc = new PDFDocument();
    const filename = `ehr_${patientId}_${Date.now()}.pdf`;
    const filePath = `./uploads/${filename}`;
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text('Electronic Health Record', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Diagnosis: ${ehr.diagnosis || 'N/A'}`);
    doc.moveDown();

    if (ehr.vitals) {
      doc.text('Vitals:', { underline: true });
      for (const [key, value] of Object.entries(ehr.vitals)) {
        doc.text(`- ${key}: ${value}`);
      }
      doc.moveDown();
    }

    if (ehr.medications?.length) {
      doc.text('Medications:', { underline: true });
      ehr.medications.forEach(med => {
        doc.text(`- ${med.name} | ${med.dosage} | ${med.duration}`);
      });
      doc.moveDown();
    }

    if (ehr.labResults?.length) {
      doc.text('Lab Results:', { underline: true });
      ehr.labResults.forEach(test => {
        doc.text(`- ${test.testName}: ${test.result}`);
      });
      doc.moveDown();
    }

    doc.end();

    stream.on('finish', () => {
      res.download(filePath, filename, (err) => {
        if (err) {
          res.status(500).json({ message: "Error downloading file", error: err });
        }
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting file:", unlinkErr);
        });
      });
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Generate QR Code
export const getEhrQrCode = async (req, res) => {
  try {
    const { patientId } = req.params;
    const qrData = `${process.env.CLIENT_URL}/ehr/view/${patientId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);
    res.status(200).json({ qrCode: qrCodeDataUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};