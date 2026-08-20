import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Calendar, Code, AlignLeft, Building2 } from 'lucide-react';
const PostJob = () => {
    const [formData, setFormData] = useState({ 
        title: '', 
        company: '', 
        location: '', 
        description: '', 
        tags: '', 
        deadline: '' 
    });
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const jobData = { 
                ...formData, 
                tags: formData.tags.split(',').map(s => s.trim()).filter(s => s !== "") 
            };
            await axios.post('http://localhost:5000/api/jobs/create', jobData, {
                headers: { Authorization: token }
            });
            toast.success("Job Broadcasted Successfully!");
            navigate('/'); // Redirect to Search Page to see the new listing
        } catch (err) {
            console.error(err);
            toast.error("Failed to post job. Ensure you are authorized.");
        }
    };
    return (
        <div className="max-w-3xl mx-auto mt-12 mb-20 px-4">
            <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {/* Header Section */}
                <div className="bg-indigo-600 p-10 text-white">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Briefcase size={32} />
                        Post a New Opening
                    </h2>
                    <p className="mt-2 text-indigo-100 font-medium">
                        Fill in the details below to list your vacancy on the PursuitPath network.
                    </p>
                </div>
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="p-10 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Job Title */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                <Code size={14} /> Job Title
                            </label>
                            <input 
                                placeholder="e.g. Senior MERN Developer" 
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-400 focus:bg-white transition-all" 
                                onChange={e => setFormData({...formData, title: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                <Building2 size={14} /> Company Name
                            </label>
                            <input 
                                placeholder="e.g. Bhuvana Tech" 
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-400 focus:bg-white transition-all" 
                                onChange={e => setFormData({...formData, company: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                <MapPin size={14} /> Location
                            </label>
                            <input 
                                placeholder="e.g. Bengaluru, India or Remote" 
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-400 focus:bg-white transition-all" 
                                onChange={e => setFormData({...formData, location: e.target.value})} 
                                required 
                            />
                        </div>

                        {/* Deadline */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-orange-500">
                                <Calendar size={14} /> Application Deadline
                            </label>
                            <input 
                                type="date"
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-400 focus:bg-white transition-all" 
                                onChange={e => setFormData({...formData, deadline: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    {/* Skills/Tags */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                            Required Skills (Comma Separated)
                        </label>
                        <input 
                            placeholder="e.g. React, Node.js, MongoDB, AWS" 
                            className="w-full p-4 bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-2xl outline-none focus:border-indigo-400 focus:bg-white transition-all text-indigo-700 font-medium" 
                            onChange={e => setFormData({...formData, tags: e.target.value})} 
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                            <AlignLeft size={14} /> Job Description
                        </label>
                        <textarea 
                            placeholder="Describe the role, responsibilities, and benefits..." 
                            className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl h-40 outline-none focus:border-indigo-400 focus:bg-white transition-all resize-none" 
                            onChange={e => setFormData({...formData, description: e.target.value})} 
                            required 
                        />
                    </div>

                    {/* Submit Button */}
                    <button className="w-full bg-indigo-600 text-white p-5 rounded-[1.5rem] font-bold text-lg hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 transition-all active:scale-[0.98] mt-4">
                        Broadcast Vacancy to Candidates
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;