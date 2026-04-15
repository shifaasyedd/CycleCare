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

const FRONTEND_URL = process.env.FRONTEND_URL || "https://thecyclecare.vercel.app";

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
    passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL || "https://thecyclecare.vercel.app"}/login` }),
    (req, res) => {
        try {
            if (!req.user) {
                return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
            }
            const token = generateToken(req.user._id);
            res.redirect(`${FRONTEND_URL}/login-success?token=${token}`);
        } catch (error) {
            console.error("Google Auth Error:", error);
            res.redirect(`${FRONTEND_URL}/login?error=server_error`);
        }
    }
);

// 📝 [POST] REGISTER – NO EMAIL VERIFICATION, returns token
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('Register attempt - Email:', email, 'Name:', name);

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('User already exists:', email);
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        // Create user with isVerified = true (no verification needed)
        const user = await User.create({
            name,
            email,
            password,
            isVerified: true,
        });

        console.log('User created successfully:', user.email, 'Role:', user.role);

        // Generate JWT token for immediate login
        const token = generateToken(user._id);

        // Send welcome email (optional – if email fails, user still can log in)
        sendWelcomeEmail(email, name).catch(err => console.error("Welcome email error:", err));

        res.status(201).json({
            success: true,
            message: 'Registration successful! You are now logged in.',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// 🔑 [POST] LOGIN – removed verification check
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt - Email:', email);

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        console.log('User found:', user.email, 'Has password:', !!user.password);

        // No verification check – all users are verified
        const isMatch = await user.matchPassword(password);
        console.log('Password match:', isMatch);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        res.json({
            success: true,
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// ✅ [GET] VERIFY EMAIL – removed (optional, keep if you want to handle old links)
router.get('/verify-email', async (req, res) => {
    // This endpoint is no longer used but kept for backward compatibility.
    // Redirect to login with a message.
    res.redirect(`${FRONTEND_URL}/login?message=Email+verification+no+longer+required`);
});

// 🔄 [PUT] UPDATE USER ROLE
router.put('/role', protect, async (req, res) => {
    try {
        const { role } = req.body;
        console.log('PUT /role - user:', req.user.email, 'new role:', role);
        if (!['men', 'girls', 'women'].includes(role)) {
            return res.status(400).json({ success: false, error: 'Invalid role' });
        }
        const user = await User.findByIdAndUpdate(req.user._id, { role }, { new: true });
        console.log('Role saved, user role is now:', user.role);
        res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
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