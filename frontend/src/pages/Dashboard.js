import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { Users, Calendar, Briefcase, Trash2, Layout, BarChart3, Clock, CheckCircle } from 'lucide-react';
import { API_URL } from '../config';

const Dashboard = () => {
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [recruiterJobs, setRecruiterJobs] = useState([]);
    const [talentPool, setTalentPool] = useState(0);
    const [selectedJob, setSelectedJob] = useState(null);
    const [tempNotes, setTempNotes] = useState("");
    const [columns, setColumns] = useState({
        Wishlist: { name: "Wishlist", items: [] },
        Applied: { name: "Applied", items: [] },
        Interviewing: { name: "Interviewing", items: [] }, 
        Offer: { name: "Offers", items: [] },
        Rejected: { name: "Rejected", items: [] },
    });
    useEffect(() => {
        if (user.role === 'recruiter') {
            fetchRecruiterData();
        } else {
            fetchCandidateData();
        }
    }, []);
    const fetchRecruiterData = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${API_URL}/jobs/recruiter-stats`, {
                headers: { Authorization: token }
            });
            if (res.data.jobs) {
                setRecruiterJobs(res.data.jobs);
                setTalentPool(res.data.talentPool);
            } else {
                setRecruiterJobs(res.data);
            }
        } catch (err) {
            console.error("Recruiter fetch error", err);
        }
    };
    const fetchCandidateData = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${API_URL}/applications/my-jobs`, {
                headers: { Authorization: token }
            });
            const newCols = {
                Wishlist: { name: "Wishlist", items: [] },
                Applied: { name: "Applied", items: [] },
                Interviewing: { name: "Interviewing", items: [] }, 
                Offer: { name: "Offers", items: [] },
                Rejected: { name: "Rejected", items: [] },
            };
            res.data.forEach(job => {
                if (newCols[job.status]) newCols[job.status].items.push(job);
            });
            setColumns(newCols);
        } catch (err) {
            toast.error("Failed to load your pursuit board");
        }
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceCol = columns[source.droppableId];
            const destCol = columns[destination.droppableId];
            const sourceItems = [...sourceCol.items];
            const destItems = [...destCol.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: { ...sourceCol, items: sourceItems },
                [destination.droppableId]: { ...destCol, items: destItems },
            });

            const token = localStorage.getItem('token');
            try {
                await axios.put(`${API_URL}/applications/update/${draggableId}`, 
                    { status: destination.droppableId },
                    { headers: { Authorization: token } }
                );
            } catch (err) {
                toast.error("Status update failed");
            }
        }
    };

    const saveNotes = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${API_URL}/applications/notes/${selectedJob._id}`, 
                { notes: tempNotes },
                { headers: { Authorization: token } }
            );
            toast.success("Notes updated");
            setSelectedJob(null);
            fetchCandidateData();
        } catch (err) {
            toast.error("Failed to save notes");
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Remove this permanently?")) return;
        const token = localStorage.getItem('token');
        try {
            const url = user.role === 'recruiter' 
                ? `${API_URL}/jobs/${id}` 
                : `${API_URL}/applications/${id}`;
            await axios.delete(url, { headers: { Authorization: token } });
            toast.success("Deleted successfully");
            user.role === 'recruiter' ? fetchRecruiterData() : fetchCandidateData();
        } catch (err) {
            toast.error("Error deleting item");
        }
    };
    if (user.role === 'recruiter') {
        return (
            <div className="py-6 md:py-10 px-4 max-w-6xl mx-auto w-full">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-3">
                        <BarChart3 className="text-indigo-600" /> Recruitment Overview
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm md:text-base">Manage your active job postings and track candidate interest.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <Briefcase className="text-indigo-600 mb-4" size={32} />
                        <h3 className="text-3xl font-bold text-slate-800">{recruiterJobs?.length || 0}</h3>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Active Listings</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <Users className="text-indigo-600 mb-4" size={32} />
                        <h3 className="text-3xl font-bold text-slate-800">
                            {recruiterJobs?.reduce((acc, j) => acc + (j.saveCount || 0), 0) || 0}
                        </h3>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Candidate Saves</p>
                    </div>
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <CheckCircle className="text-green-500 mb-4" size={32} />
                        <h3 className="text-3xl font-bold text-slate-800">{talentPool || 0}</h3>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Available Talent</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-6 px-1">Your Posted Openings</h2>
                <div className="space-y-4">
                    {recruiterJobs?.length === 0 && <p className="text-slate-400 italic px-1">You haven't posted any jobs yet.</p>}
                    {recruiterJobs?.map(job => (
                        <div key={job._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center group hover:border-indigo-300 transition-all shadow-sm gap-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                                <div className="flex flex-wrap gap-3 md:gap-6 mt-2">
                                    <span className="flex items-center gap-1.5 text-xs md:text-sm text-slate-500 font-medium">
                                        <Clock size={14} className="text-orange-500" /> Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-sm text-white-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                        <Users size={14} /> {job.saveCount || 0} Candidates
                                    </span>
                                    {job.avgMatch > 0 && (
                                        <span className="flex items-center gap-1.5 text-xs md:text-sm text-green-700 font-bold bg-green-50 px-3 py-1 rounded-full">
                                            <CheckCircle size={14} /> {job.avgMatch}% Avg. Match
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button onClick={(e) => handleDelete(e, job._id)} className="text-slate-300 hover:text-red-500 transition-colors p-3 bg-slate-50 rounded-2xl group-hover:bg-red-50 self-end sm:self-auto">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div className="py-6 md:py-10 w-full px-2 md:px-8">
        <div className="mb-10 text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">Application Pipeline</h1>
            <p className="text-slate-500 mt-2 text-sm md:text-base">Track your active job pursuits.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm w-full">
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Total Pursuits</p>
                <h3 className="text-2xl font-bold text-slate-800">
                    {Object.values(columns).reduce((acc, col) => acc + (col.items?.length || 0), 0)}
                </h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-indigo-500 text-[10px] uppercase font-bold tracking-widest">Interviews</p>
                    <h3 className="text-2xl font-bold text-slate-800">{columns.Interviewing?.items?.length || 0}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-green-500 text-[10px] uppercase font-bold tracking-widest">Offers</p>
                    <h3 className="text-2xl font-bold text-slate-800">{columns.Offer?.items?.length || 0}</h3>
                </div>
                <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
                    <p className="text-indigo-200 text-[10px] uppercase font-bold tracking-widest">Focusing On</p>
                    <h3 className="text-xl font-bold truncate">{user?.targetRole || "Software Engineer"}</h3>
                </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-10 px-2 snap-x scrollbar-hide">
                <DragDropContext onDragEnd={onDragEnd}>
                    {Object.entries(columns).map(([columnId, column]) => (
                        <div key={columnId} className="w-[280px] md:w-80 flex-shrink-0 snap-center">
                            <h2 className="font-bold text-slate-400 mb-4 px-3 uppercase text-[10px] tracking-widest flex justify-between">
                                {column.name} <span className="bg-slate-100 text-slate-500 px-2 rounded-full">{column.items?.length || 0}</span>
                            </h2>
                            <Droppable droppableId={columnId}>
                                {(provided, snapshot) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} 
                                        className={`p-3 md:p-4 rounded-[2rem] md:rounded-[2.5rem] min-h-[450px] transition-all duration-300 ${snapshot.isDraggingOver ? 'bg-indigo-50/50 ring-2 ring-indigo-200 ring-inset' : 'bg-slate-100/40'}`}>
                                        {column.items?.map((item, index) => (
                                            <Draggable key={item._id} draggableId={item._id} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                        onClick={() => { setSelectedJob(item); setTempNotes(item.notes || ""); }}
                                                        className="bg-white p-5 md:p-6 mb-4 rounded-3xl shadow-sm border border-slate-200 cursor-pointer hover:border-indigo-400 transition-all group">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-bold text-slate-800 text-base md:text-lg leading-tight flex-1">{item.jobTitle}</h4>
                                                            <button onClick={(e) => handleDelete(e, item._id)} className="text-slate-200 hover:text-red-500 transition-colors ml-2"><Trash2 size={16}/></button>
                                                        </div>
                                                        <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">{item.company}</p>
                                                        <div className="mt-5">
                                                            {item.matchScore > 0 ? (
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex-1 bg-slate-100 h-1 rounded-full mr-3 overflow-hidden">
                                                                        <div className={`h-full bg-indigo-500`} style={{ width: `${item.matchScore}%` }}></div>
                                                                    </div>
                                                                    <span className="text-[10px] font-bold text-indigo-600">{item.matchScore}%</span>
                                                                </div>
                                                            ) : <span className="text-[10px] text-slate-300 font-mono italic font-medium">Logged Item</span>}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </DragDropContext>
            </div>
            {selectedJob && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] w-full max-w-2xl p-6 md:p-10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">{selectedJob.jobTitle}</h2>
                            <button onClick={() => setSelectedJob(null)} className="text-slate-300 hover:text-slate-600 text-3xl transition-colors">×</button>
                        </div>
                        <div className="mb-6 p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-3xl max-h-32 md:max-h-40 overflow-y-auto text-xs md:text-sm text-slate-600 leading-relaxed">
                            {selectedJob.description}
                        </div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pursuit Notes</label>
                        <textarea className="w-full p-4 md:p-6 bg-slate-50 border-none rounded-2xl md:rounded-3xl h-32 md:h-40 mb-6 mt-1 focus:ring-2 focus:ring-indigo-400 text-sm" 
                            placeholder="Interview dates, salary discussion, preparation notes..." value={tempNotes} onChange={(e) => setTempNotes(e.target.value)} />
                        <button onClick={saveNotes} className="w-full bg-indigo-600 text-white p-4 md:p-5 rounded-2xl font-bold text-base md:text-lg shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                            Save Notes & Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Dashboard;