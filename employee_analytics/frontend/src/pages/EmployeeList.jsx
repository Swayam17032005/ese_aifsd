import React, { useState, useEffect } from 'react';
import { Search, Filter, Trash2, Mail, Briefcase, Award, GraduationCap } from 'lucide-react';
import api from '../utils/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');

  const fetchEmployees = async (name = '', dept = '') => {
    setLoading(true);
    try {
      let url = '/employees/search?';
      if (name) url += `name=${name}&`;
      if (dept) url += `department=${dept}`;
      
      const res = await api.get(url);
      setEmployees(res.data.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(searchTerm, filterDept);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (error) {
        console.error("Failed to delete:", error);
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (score >= 60) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-red-400 bg-red-400/10 border-red-400/20';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Employee Directory</h1>
          <p className="text-slate-400">Manage and view all registered employees.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full pl-9 h-10 text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select 
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="glass-input pl-9 h-10 text-sm appearance-none bg-[#1e293b] pr-8"
            >
              <option value="">All Depts</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
            </select>
          </div>
          <button type="submit" className="btn-primary h-10 px-5 text-sm">Search</button>
        </form>
      </div>

      <div className="glass-panel rounded-2xl border-white/10 border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-white">No employees found</h3>
            <p className="text-slate-400 mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-slate-300 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Employee</th>
                  <th className="p-4 font-medium hidden md:table-cell">Contact</th>
                  <th className="p-4 font-medium">Department</th>
                  <th className="p-4 font-medium text-center">Score</th>
                  <th className="p-4 font-medium hidden lg:table-cell">Skills</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold uppercase shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{emp.name}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <GraduationCap size={12} /> {emp.experience} yrs exp
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center text-sm text-slate-300 gap-2">
                        <Mail size={14} className="text-slate-400" />
                        {emp.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-sm text-slate-300 whitespace-nowrap">
                        <Briefcase size={14} className="text-slate-400" />
                        {emp.department}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium border ${getScoreColor(emp.performanceScore)}`}>
                        <Award size={14} />
                        {emp.performanceScore}
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {emp.skills.slice(0, 2).map((skill, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">
                            {skill}
                          </span>
                        ))}
                        {emp.skills.length > 2 && (
                          <span className="text-xs px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-400">
                            +{emp.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(emp._id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete Employee"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
