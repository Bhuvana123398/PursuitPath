import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';
const JobSearch = () => {
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const handleSearch = async () => {
    try {
      const apiRes = await axios.get(`http://localhost:5000/api/jobs/search?query=${query}`);
      const manualRes = await axios.get(`http://localhost:5000/api/jobs/manual`); 
      const filteredManual = manualRes.data.filter(j => 
        j.title.toLowerCase().includes(query.toLowerCase()) || 
        j.company.toLowerCase().includes(query.toLowerCase())
      );
      setJobs([...filteredManual, ...apiRes.data]);
    } catch (err) {
      toast.error("Search failed");
    }
  };
  const saveJob = async (job) => {
    const token = localStorage.getItem('token');
    try {
        const jobToSave = {
            jobTitle: job.title.replace(/<\/?[^>]+(>|$)/g, ""), // Clean HTML tags
            company: job.isManual ? job.company : job.company.display_name,
            location: job.isManual ? job.location : job.location.display_name,
            description: job.description 
        };
        await axios.post('http://localhost:5000/api/applications/save', jobToSave, {
            headers: { Authorization: token }
        });
        toast.success("Job Saved!");
    } catch (err) {
        toast.error("Failed to save");
    }
  };
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">Find Your Next Pursuit</h1>
      <p className="text-slate-500 mb-10 text-lg font-medium italic">Showing results from Adzuna API & PursuitPath Premium Partners.</p>
      
      <div className="flex gap-3 mb-12">
        <input 
          className="flex-1 p-5 bg-white border-none rounded-2xl shadow-xl shadow-slate-100 outline-none focus:ring-2 focus:ring-indigo-400" 
          placeholder="e.g. MERN Developer"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold hover:shadow-xl transition-all">Search</button>
      </div>

      <div className="space-y-6">
        {jobs.map((job, index) => (
          <div key={index} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center hover:shadow-lg transition-all">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-xl text-slate-900">{job.title.replace(/<\/?[^>]+(>|$)/g, "")}</h3>
                {job.isManual && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold">PATH PARTNER</span>}
              </div>
              <p className="text-slate-500 font-medium">
                {job.isManual ? job.company : job.company?.display_name} • {job.isManual ? job.location : job.location?.display_name}
              </p>
            </div>
            <button 
              onClick={() => saveJob(job)}
              className="bg-slate-50 text-indigo-600 px-6 py-3 rounded-xl font-bold border-2 border-transparent hover:border-indigo-600 transition-all"
            >
              Save Pursuit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default JobSearch;