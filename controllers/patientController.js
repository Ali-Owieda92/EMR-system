import Patient from "../models/Patient.js";
import User from "../models/User.js";

<<<<<<< Updated upstream
// Create a new patient
export const createPatient = async (req, res) => {
    const user_id = req.user._id;
    const {chronic_diseases, blood_type, contact_info } = req.body;
=======
// Create a new patient 
export const createPatient = async (req, res) => {
    const { name, email, phone, chronic_diseases, blood_type, contact_info } = req.body;
>>>>>>> Stashed changes

    try {
        // السماح فقط للأطباء أو المسؤولين بإضافة المرضى
        if (req.user.role !== "doctor" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Only doctors and admins can add patients." });
        }

        let user = await User.findOne({ email });

        // إذا لم يكن لدى المريض حساب، يتم إنشاؤه تلقائيًا
        if (!user) {
            user = new User({
                name,
                email,
                password: "12345678", // كلمة مرور افتراضية
                role: "patient",
            });
            await user.save();
        }

        // التحقق مما إذا كان لديه سجل مريض مسبقًا
        let patientExists = await Patient.findOne({ user_id: user._id });
        if (patientExists) {
            return res.status(400).json({ message: "Patient already exists" });
        }

        const newPatient = new Patient({
            user_id: user._id,
            chronic_diseases,
            blood_type,
            contact_info: { phone, address: contact_info?.address },
        });
        await newPatient.save();

        res.status(201).json({ message: "Patient record created successfully", patient: newPatient });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
// Get all patients (For doctors/admins)
export const getAllPatients = async (req, res) => {
    try {
        let patients;
        
        if (req.user.role === "admin") {
            // المسؤول يمكنه رؤية جميع المرضى
            patients = await Patient.find().populate("user_id", "name email gender date_of_birth");
        } else if (req.user.role === "doctor") {
            // الطبيب يرى فقط المرضى الذين عالجهم من قبل
            patients = await Patient.find({ "medical_history.doctor_id": req.user._id })
                .populate("user_id", "name email gender date_of_birth");
        } else {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
// Get a single patient by ID
export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).populate("user_id", "name email gender date_of_birth");
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        // التحقق من الصلاحيات
        if (req.user.role !== "admin" && req.user.role !== "doctor" && req.user._id.toString() !== patient.user_id._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
// Update patient details
export const updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        // المريض يمكنه تعديل بياناته الشخصية فقط
        if (req.user.role === "patient" && req.user._id.toString() === patient.user_id.toString()) {
            const { contact_info } = req.body;
            if (contact_info) patient.contact_info = contact_info;
        }
        // الطبيب يمكنه تعديل التاريخ الطبي فقط إذا كان قد عالج هذا المريض
        else if (req.user.role === "doctor") {
            if (!patient.medical_history.some(record => record.doctor_id.toString() === req.user._id.toString())) {
                return res.status(403).json({ message: "Access denied" });
            }
            const { chronic_diseases, medical_history } = req.body;
            if (chronic_diseases) patient.chronic_diseases = chronic_diseases;
            if (medical_history) patient.medical_history.push(medical_history);
        }
        // المسؤول يمكنه تعديل كل شيء
        else if (req.user.role === "admin") {
            Object.assign(patient, req.body);
        } else {
            return res.status(403).json({ message: "Access denied" });
        }

        await patient.save();
        res.json({ message: "Patient updated successfully", patient });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
<<<<<<< Updated upstream
};

// Delete a patient record
export const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        await patient.deleteOne();
        res.json({ message: "Patient record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
=======
>>>>>>> Stashed changes
};