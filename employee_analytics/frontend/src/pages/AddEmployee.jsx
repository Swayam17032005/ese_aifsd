import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { UserPlus, Briefcase, Award, GraduationCap, X } from 'lucide-react';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    performanceScore: '',
    experience: ''
  });
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (skills.length === 0) {
      setError('Please add at least one skill');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience),
        skills
      };
      
      await api.post('/employees', payload);
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Add New Employee</h1>
        <p className="text-slate-400">Enter details to register a new employee to the system.</p>
      </div>

      <div className="glass-panel rounded-2xl p-8 border-white/10 border shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="glass-input w-full"
                placeholder="e.g. Aman Verma"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="glass-input w-full"
                placeholder="aman@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Department</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="glass-input w-full pl-10 appearance-none bg-[#1e293b]" // Solid fallback bg for select dropdown options
                >
                  <option value="" disabled>Select Department</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Performance Score (0-100)</label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="number"
                  name="performanceScore"
                  required
                  min="0"
                  max="100"
                  value={formData.performanceScore}
                  onChange={handleChange}
                  className="glass-input w-full pl-10"
                  placeholder="85"
                />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Years of Experience</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="number"
                  name="experience"
                  required
                  min="0"
                  step="0.5"
                  value={formData.experience}
                  onChange={handleChange}
                  className="glass-input w-full pl-10"
                  placeholder="3"
                />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Skills</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                  className="glass-input flex-1"
                  placeholder="e.g. React, Node.js (Press Enter to add)"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="btn-secondary px-6"
                >
                  Add
                </button>
              </div>
              
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-xl border border-white/10 min-h-[50px]">
                  {skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm border border-blue-500/30"
                    >
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => removeSkill(skill)}
                        className="hover:text-white transition-colors hover:bg-blue-500/30 rounded-full p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="px-6 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary min-w-[150px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Save Employee
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
