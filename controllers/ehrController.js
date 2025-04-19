// controllers/ehrController.js
import Ehr from "../models/Ehr.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import QRCode from "qrcode";

// ✅ Get EHR by Patient ID
export const getEhrByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const ehr = await Ehr.findOne({ patient: patientId }).populate("patient", "name phone");

        if (!ehr) {
            return res.status(404).json({ message: "EHR not found" });
        }

        res.status(200).json(ehr);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Add EHR Data
export const addEhrData = async (req, res) => {
    try {
        const { patient, chronicDiseases, medications, familyHistory } = req.body;

        // Check if EHR already exists
        const existingEhr = await Ehr.findOne({ patient });
        if (existingEhr) {
            return res.status(400).json({ message: "EHR already exists for this patient" });
        }

        const newEhr = new Ehr({
            patient,
            chronicDiseases,
            medications,
            familyHistory,
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
        const { chronicDiseases, medications, familyHistory } = req.body;

        const ehr = await Ehr.findOne({ patient: patientId });

        if (!ehr) {
            return res.status(404).json({ message: "EHR not found" });
        }

        if (chronicDiseases) ehr.chronicDiseases = chronicDiseases;
        if (medications) ehr.medications = medications;
        if (familyHistory) ehr.familyHistory = familyHistory;

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

        const ehr = await Ehr.findOne({ patient: patientId }).populate("patient", "name phone");

        if (!ehr) {
            return res.status(404).json({ message: "No EHR found for this patient" });
        }

        const doc = new PDFDocument();
        const filename = `ehr_${patientId}_${Date.now()}.pdf`;
        const filePath = `./uploads/${filename}`;

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        doc.fontSize(25).text('Electronic Health Record', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Patient: ${ehr.patient.name}`, { align: 'left' });
        doc.fontSize(16).text(`Phone: ${ehr.patient.phone}`, { align: 'left' });
        doc.moveDown();

        if (ehr.chronicDiseases?.length) {
            doc.fontSize(14).text('Chronic Diseases:', { underline: true });
            ehr.chronicDiseases.forEach(disease => {
                doc.fontSize(12).text(`- ${disease}`);
            });
            doc.moveDown();
        }

        if (ehr.medications?.length) {
            doc.fontSize(14).text('Medications:', { underline: true });
            ehr.medications.forEach(med => {
                doc.fontSize(12).text(`- ${med}`);
            });
            doc.moveDown();
        }

        if (ehr.familyHistory) {
            doc.fontSize(14).text('Family History:', { underline: true });
            doc.fontSize(12).text(ehr.familyHistory);
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

// ✅ Generate QR Code for EHR link
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
