import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';
const Profile = () => {
    const [skillInput, setSkillInput] = useState("");
    const [skills, setSkills] = useState([]);
    const [targetRole, setTargetRole] = useState("");
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`${API_URL}/auth/me`, {
                    headers: { Authorization: token }
                });
                setSkills(res.data.skills || []);
                setTargetRole(res.data.targetRole || "");
                localStorage.setItem('user', JSON.stringify(res.data));
            } catch (err) {
                console.error("Failed to fetch user data");
            }
        };
        fetchUserData();
    }, []);
    const addSkill = () => {
        const cleanSkill = skillInput.trim();
        if (cleanSkill && !skills.includes(cleanSkill)) {
            setSkills([...skills, cleanSkill]);
            setSkillInput(""); 
        }
    };
    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put('http://localhost:5000/api/auth/profile/skills', 
                { skills, targetRole }, 
                { headers: { Authorization: token } }
            );
            localStorage.setItem('user', JSON.stringify(res.data));
            
            toast.success("Profile Synced with Database!");
        } catch (err) {
            toast.error("Failed to update profile");
        }
    };
    return (
        <div className="max-w-2xl mx-auto mt-12 p-10 bg-white rounded-[2rem] shadow-sm border border-slate-100">
            <h2 className="text-3xl font-bold mb-2 text-slate-800">Your Pursuit Profile</h2>
            <p className="text-slate-500 mb-8">Define your role and skills to improve your Match Score.</p>
            <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Target Job Title</label>
                <input 
                    className="w-full p-4 mt-1 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition font-bold text-slate-700"
                    placeholder="e.g. Fullstack Developer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                />
            </div>
            <div className="mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Skills</label>
                <div className="flex gap-3 mt-1">
                    <input 
                        className="flex-1 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Add a skill (e.g. React)"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <button 
                        type="button"
                        onClick={addSkill} 
                        className="bg-slate-900 text-white px-8 rounded-2xl font-bold hover:bg-slate-800 transition"
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-12 min-h-[100px] p-4 bg-slate-50 rounded-2xl mt-4 border-2 border-dashed border-slate-100">
                {skills.length === 0 && <p className="text-slate-400 text-sm italic">No skills added yet...</p>}
                {skills.map(s => (
                    <span key={s} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium flex items-center gap-3 shadow-sm">
                        {s}
                        <button onClick={() => setSkills(skills.filter(sk => sk !== s))} className="text-slate-300 hover:text-red-500 font-bold">×</button>
                    </span>
                ))}
            </div>

            <button 
                onClick={handleSave} 
                className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-bold text-lg hover:shadow-xl transition-all active:scale-95"
            >
                Save & Update Dashboard
            </button>
        </div>
    );
};

export default Profile;