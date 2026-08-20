const express = require('express');
const router = express.Router();
const axios = require('axios');
const Job = require('../model/Jobs'); // Make sure this matches your filename exactly
const Application = require('../model/Application');
const auth = require('../middleware/authMiddleware');
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}&results_per_page=10&what=${query}`;
        const response = await axios.get(url);
        res.json(response.data.results || []);
    } catch (err) {
        res.status(500).json({ error: "API Error" });
    }
});
router.get('/manual', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/create', auth, async (req, res) => {
    try {
        if (req.user.role !== 'recruiter') return res.status(403).json({ msg: "Recruiters only" });
        const newJob = new Job({ ...req.body, postedBy: req.user.id });
        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/recruiter-stats', auth, async (req, res) => {
    try {
        if (req.user.role !== 'recruiter') return res.status(403).json({ msg: "Access denied" });
        const myJobs = await Job.find({ postedBy: req.user.id });
        const stats = await Promise.all(myJobs.map(async (job) => {
            const applications = await Application.find({ 
                jobTitle: job.title, 
                company: job.company 
            });
            const totalScore = applications.reduce((acc, app) => acc + (app.matchScore || 0), 0);
            const avgScore = applications.length > 0 ? Math.round(totalScore / applications.length) : 0;
            return { 
                ...job._doc, 
                saveCount: applications.length,
                avgMatch: avgScore
            };
        }));
        const User = require('../model/User');
        const talentPoolCount = await User.countDocuments({ role: 'candidate' });
        res.json({ jobs: stats, talentPool: talentPoolCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/create', auth, async (req, res) => {
    try {
        const { title, company, location, description, tags, deadline } = req.body;
        const newJob = new Job({
            title,
            company,
            location,
            description,
            tags,
            deadline,
            postedBy: req.user.id, 
            isManual: true
        });
        await newJob.save();
        console.log("Job saved for recruiter:", req.user.id);
        res.status(201).json(newJob);
    } catch (err) {
        console.error("Post Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;