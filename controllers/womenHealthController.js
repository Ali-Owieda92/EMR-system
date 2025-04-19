// Updated controllers/womenHealthController.js
import MenstrualCycle from "../models/MenstrualCycle.js";
import PregnancyTracking from "../models/PregnancyTracking.js";
import User from "../models/User.js";
import sendEmail from "../utils/emailService.js";

// Track menstrual cycle
export const addMenstrualCycle = async (req, res) => {
  try {
    const { startDate, duration } = req.body;

    const cycle = new MenstrualCycle({
      userId: req.user._id,
      startDate,
      duration,
    });

    const createdCycle = await cycle.save();
    res.status(201).json(createdCycle);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get menstrual cycle data and prediction
export const getMenstrualCycle = async (req, res) => {
  try {
    const cycles = await MenstrualCycle.find({ userId: req.params.userId }).sort({ startDate: -1 });

    if (cycles.length === 0) {
      return res.status(404).json({ message: "No menstrual cycle data found" });
    }

    const latestCycle = cycles[0];
    
    // Calculate average cycle length if there's more than one record
    let cycleLength = 28; // Default
    if (cycles.length > 1) {
      let totalDays = 0;
      let count = 0;
      
      for (let i = 0; i < cycles.length - 1; i++) {
        const curr = new Date(cycles[i].startDate);
        const next = new Date(cycles[i+1].startDate);
        const diffTime = Math.abs(curr - next);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        totalDays += diffDays;
        count++;
      }
      
      cycleLength = Math.round(totalDays / count);
    }
    
    // Predict next cycle
    const nextStart = new Date(latestCycle.startDate);
    nextStart.setDate(nextStart.getDate() + cycleLength);
    
    // Predict ovulation (typically 14 days before next period)
    const ovulationDate = new Date(nextStart);
    ovulationDate.setDate(ovulationDate.getDate() - 14);
    
    // Fertile window (typically 5 days before ovulation to 1 day after)
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);
    
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    const prediction = {
      nextCycleStart: nextStart,
      cycleLength: cycleLength,
      ovulation: ovulationDate,
      fertileWindow: {
        start: fertileStart,
        end: fertileEnd
      },
      estimatedPeriodEnd: new Date(nextStart.getTime() + latestCycle.duration * 24 * 60 * 60 * 1000),
    };

    res.json({ cycles, prediction });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Track pregnancy
export const addPregnancyTracking = async (req, res) => {
  try {
    const { conceptionDate } = req.body;

    // Check if already tracking pregnancy
    const existingTracking = await PregnancyTracking.findOne({ userId: req.user._id });
    if (existingTracking) {
      return res.status(400).json({ message: "Pregnancy is already being tracked" });
    }

    const pregnancy = new PregnancyTracking({
      userId: req.user._id,
      conceptionDate,
    });

    const saved = await pregnancy.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get pregnancy tracking info
export const getPregnancyTracking = async (req, res) => {
  try {
    const tracking = await PregnancyTracking.findOne({ userId: req.params.userId });

    if (!tracking) {
      return res.status(404).json({ message: "No pregnancy tracking found" });
    }

    const today = new Date();
    const conceptionDate = new Date(tracking.conceptionDate);
    
    // Calculate weeks and days
    const diffTime = today - conceptionDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    
    // Calculate due date (typically 40 weeks from conception)
    const dueDate = new Date(conceptionDate);
    dueDate.setDate(dueDate.getDate() + 280); // 40 weeks
    
    // Calculate trimester
    let trimester = 1;
    if (weeks >= 13 && weeks < 27) {
      trimester = 2;
    } else if (weeks >= 27) {
      trimester = 3;
    }

    res.json({
      ...tracking._doc,
      currentState: {
        weeks,
        days,
        trimester
      },
      dueDate
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Set up reminders for women's health
export const createReminder = async (req, res) => {
  try {
    const { type, date, message } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Send email reminder
    await sendEmail({
      to: user.email,
      subject: `Reminder: ${type}`,
      html: `<p>Hello ${user.name},</p>
              <p>This is a reminder about your ${type} on ${new Date(date).toLocaleDateString()}.</p>
              <p>${message || ''}</p>
              <p>Best regards,<br>EMR System</p>`
    });
    
    res.status(200).json({ message: "Reminder set successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};