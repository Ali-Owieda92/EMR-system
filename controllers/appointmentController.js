import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

export const bookAppointment = async (req, res) => {
    const { patient_id, doctor_id, date, time, reason } = req.body;
    const datetime = new Date(`${date}T${time}:00`);

    try {
        const patient = await User.findById(patient_id);
        const doctor = await User.findById(doctor_id);

        if (!patient || patient.role !== "patient") return res.status(404).json({ message: "Patient not found" });
        if (!doctor || doctor.role !== "doctor") return res.status(404).json({ message: "Doctor not found" });

        const existingAppointment = await Appointment.findOne({ doctor_id, date, time });
        if (existingAppointment) return res.status(400).json({ message: "Doctor is not available at this time" });

        const newAppointment = new Appointment({ patient_id, doctor_id, datetime, reason });
        await newAppointment.save();

        res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate("patient_id", "name email")
            .populate("doctor_id", "name specialization email");
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient_id: req.params.patientId })
            .populate("doctor_id", "name specialization email");
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor_id: req.params.doctorId })
            .populate("patient_id", "name email");
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        appointment.status = req.body.status;
        await appointment.save();

        res.json({ message: "Appointment status updated successfully", appointment });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        await appointment.deleteOne();
        res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
