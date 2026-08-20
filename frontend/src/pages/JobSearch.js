import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';
import { Search, Sparkles, Clock, MapPin, Building2, Briefcase } from 'lucide-react';

const JobSearch = () => {
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return toast.error("Please enter a keyword");
    setLoading(true);
    try {
      const apiRes = await axios.get(`${API_URL}/jobs/search?query=${query}`);
      const manualRes = await axios.get(`${API_URL}/jobs/manual`); 
      
      const filteredManual = manualRes.data.filter(j => 
        j.title.toLowerCase().includes(query.toLowerCase()) || 
        j.company.toLowerCase().includes(query.toLowerCase())
      );
      setJobs([...filteredManual, ...apiRes.data]);
      if ([...filteredManual, ...apiRes.data].length === 0) {
        toast("No jobs found for this query", { icon: '🔍' });
      }
    } catch (err) {
      toast.error("Search failed. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const saveJob = async (job) => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error("Please login to save jobs");

    try {
        const jobToSave = {
            jobTitle: job.title.replace(/<\/?[^>]+(>|$)/g, ""), // Remove Adzuna HTML tags
            company: job.isManual ? job.company : job.company.display_name,
            location: job.isManual ? job.location : job.location.display_name,
            description: job.description 
        };

        await axios.post(`${API_URL}/applications/save`, jobToSave, {
            headers: { Authorization: token }
        });
        toast.success("Added to your Board!");
    } catch (err) {
        toast.error("Failed to save job.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 md:py-12 px-4 mb-20">
      {/* Header Section */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-3 tracking-tight">
          Find Your Next <span className="text-indigo-600">Pursuit</span>
        </h1>
        <p className="text-slate-500 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">
          Discover live roles from global partners and premium local listings.
        </p>
      </div>
      
      {/* Responsive Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-12">
        <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              className="w-full p-4 pl-12 bg-white border-none rounded-2xl shadow-xl shadow-slate-100 outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700" 
              placeholder="e.g. Frontend Developer, Pune..."
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
        </div>
        <button 
            onClick={handleSearch} 
            disabled={loading}
            className="bg-indigo-600 text-white px-10 py-4 md:py-0 rounded-2xl font-bold hover:bg-indigo-700 hover:shadow-xl transition-all disabled:bg-slate-300"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4 md:space-y-6">
        {jobs.map((job, index) => (
          <div key={index} className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-lg transition-all gap-6 group">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="font-bold text-xl md:text-2xl text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {job.title.replace(/<\/?[^>]+(>|$)/g, "")}
                </h3>
                {job.isManual && (
                    <span className="bg-green-100 text-green-700 text-[10px] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                        <Sparkles size={10} /> PATH PARTNER
                    </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-slate-500 font-medium text-sm md:text-base mb-3">
                <span className="flex items-center gap-1"><Building2 size={16} className="text-slate-300" /> {job.isManual ? job.company : job.company?.display_name}</span>
                <span className="flex items-center gap-1"><MapPin size={16} className="text-slate-300" /> {job.isManual ? job.location : job.location?.display_name}</span>
              </div>

              {/* Deadline Display for Manual Jobs */}
              {job.deadline && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl w-fit">
                    <Clock size={14} /> Closes: {new Date(job.deadline).toLocaleDateString()}
                </div>
              )}
            </div>

            <button 
              onClick={() => saveJob(job)}
              className="w-full md:w-auto bg-slate-50 text-indigo-600 px-8 py-3 rounded-2xl font-bold border-2 border-transparent hover:border-indigo-600 hover:bg-white transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Briefcase size={18} /> Save Pursuit
            </button>
          </div>
        ))}

        {jobs.length === 0 && !loading && (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Search for a role to see listings...</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;