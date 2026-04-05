const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require("passport");
const User = require('../models/User');
const Cycle = require('../models/Cycle');
const DailyLog = require('../models/DailyLog');
const Medication = require('../models/Medication');
const DoctorVisit = require('../models/DoctorVisit');
const { sendWelcomeEmail, sendPeriodReminder } = require('../utils/emailService');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 🔐 Helper: Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '24h'
    });
};

// 🌐 [GET] GOOGLE LOGIN 
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

// 🌐 [GET] GOOGLE CALLBACK 
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "https://thecyclecare.vercel.app/login" }),
    (req, res) => {
        try {
            if (!req.user) {
                return res.redirect("https://thecyclecare.vercel.app/login?error=auth_failed");
            }
            const token = generateToken(req.user._id);
            const frontendUrl = "https://thecyclecare.vercel.app";
            res.redirect(`${frontendUrl}/login-success?token=${token}`);
        } catch (error) {
            console.error("Google Auth Error:", error);
            res.redirect("https://thecyclecare.vercel.app/login?error=server_error");
        }
    }
);

// 📝 [POST] REGISTER – NO EMAIL VERIFICATION, returns token
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        // Create user with isVerified = true (no verification needed)
        const user = await User.create({
            name,
            email,
            password,
            isVerified: true,
        });

        // Generate JWT token for immediate login
        const token = generateToken(user._id);

        // Send welcome email (optional – if email fails, user still can log in)
        sendWelcomeEmail(email, name).catch(err => console.error("Welcome email error:", err));

        res.status(201).json({
            success: true,
            message: 'Registration successful! You are now logged in.',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// 🔑 [POST] LOGIN – removed verification check
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // No verification check – all users are verified
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        res.json({
            success: true,
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// ✅ [GET] VERIFY EMAIL – removed (optional, keep if you want to handle old links)
router.get('/verify-email', async (req, res) => {
    // This endpoint is no longer used but kept for backward compatibility.
    // Redirect to login with a message.
    res.redirect("https://thecyclecare.vercel.app/login?message=Email+verification+no+longer+required");
});

// 🔐 [GET] GET CURRENT USER 
router.get('/me', protect, async (req, res) => {
    try {
        res.json({ success: true, user: req.user });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// 🗑️ [DELETE] DELETE ACCOUNT 
router.delete('/delete-account', protect, async (req, res) => {
    try {
        const userId = req.user._id;

        await Promise.all([
            Cycle.deleteMany({ user: userId }),
            DailyLog.deleteMany({ user: userId }),
            Medication.deleteMany({ user: userId }),
            DoctorVisit.deleteMany({ user: userId }),
            User.findByIdAndDelete(userId)
        ]);

        res.json({ success: true, message: 'Account and all data permanently deleted' });
    } catch (err) {
        console.error('Delete account error:', err);
        res.status(500).json({ success: false, error: 'Could not delete account. Please try again.' });
    }
});

module.exports = router;