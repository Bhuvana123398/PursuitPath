const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authMiddleware'); 
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body; 
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || 'candidate' 
        });
        await user.save();
        res.status(201).json({ msg: "Registered Successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, role: user.role, skills: user.skills,  targetRole: user.targetRole} });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put('/profile/skills', auth, async (req, res) => {
    try {
        const { skills, targetRole } = req.body; 
        const user = await User.findByIdAndUpdate(
            req.user.id, 
            { skills: skills, targetRole: targetRole }, 
            { returnDocument: 'after' }
        );

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
module.exports = router;