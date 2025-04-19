import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import asyncHandler from 'express-async-handler';


export const bookAppointment = asyncHandler(async (req, res) => {
    const { doctor_id, patient_id, datetime, reason } = req.body;

    const existingAppointment = await Appointment.findOne({ doctor_id, datetime });
    if (existingAppointment) {
        res.status(400);
        throw new Error("Doctor already has an appointment at this time");
    }

    const newAppointment = await Appointment.create({
        doctor_id,
        patient_id,
        datetime,
        reason,
    });

    res.status(201).json(newAppointment);
});


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
