const express = require('express');
const router = express.Router();
const Application = require('../model/Application');
const User = require('../model/User'); 
const auth = require('../middleware/authMiddleware');
const calculateMatch = (userSkills, jobTitle, jobDescription) => {
    if (!userSkills || userSkills.length === 0) return 0;
    const textToSearch = (jobTitle + " " + (jobDescription || "")).toLowerCase();
    let matches = 0;
    userSkills.forEach(skill => {
        const cleanSkill = skill.toLowerCase().trim();
        if (textToSearch.includes(cleanSkill)) {
            matches++;
        }
    });
    return Math.round((matches / userSkills.length) * 100);
};
router.post('/save', auth, async (req, res) => {
    try {
        const { jobTitle, company, location, description } = req.body;
        const user = await User.findById(req.user.id);
        console.log(`--- Match Test for: ${jobTitle} ---`);
        console.log(`User Skills found in DB:`, user.skills);
        const score = calculateMatch(user.skills || [], jobTitle, description);
        console.log(`Resulting Score: ${score}%`);
        console.log(`---------------------------------`);
        const newApp = new Application({
            userId: req.user.id,
            jobTitle,
            company,
            location,
            description,
            status: 'Wishlist',
            matchScore: score 
        });
        await newApp.save();
        res.json({ msg: "Saved!", matchScore: score });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/my-jobs', auth, async (req, res) => {
    try {
        const apps = await Application.find({ userId: req.user.id });
        res.json(apps);
    } catch (err) {
        console.error("Fetch Error:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});
router.put('/update/:id', auth, async (req, res) => { 
    try {
        const { status } = req.body; 
        const updatedApplication = await Application.findByIdAndUpdate(
            req.params.id, 
            { status: status }, 
            { returnDocument: 'after' } 
        );
        if (!updatedApplication) {
            return res.status(404).json({ msg: "Job not found" });
        }
        res.json(updatedApplication);
    } catch (err) {
        console.error("Update Error:", err.message);
        res.status(500).send("Server Error");
    }
});
router.put('/notes/:id', auth, async (req, res) => {
    try {
        const { notes } = req.body;
        const updatedApplication = await Application.findByIdAndUpdate(
            req.params.id, 
            { notes: notes }, 
            { returnDocument: 'after' }
        );

        if (!updatedApplication) {
            return res.status(404).json({ msg: "Job not found" });
        }

        res.json(updatedApplication);
    } catch (err) {
        console.error("Notes Update Error:", err.message);
        res.status(500).send("Server Error");
    }
});
router.delete('/:id', auth, async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.json({ msg: "Job removed" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;