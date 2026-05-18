import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, BarChart3 } from 'lucide-react';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    avgScore: 0,
    topPerformers: 0,
    deptData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/employees');
        const employees = data.data;
        
        if (employees.length === 0) {
          setLoading(false);
          return;
        }

        const avg = employees.reduce((acc, curr) => acc + curr.performanceScore, 0) / employees.length;
        const top = employees.filter(emp => emp.performanceScore >= 85).length;
        
        // Group by department
        const depts = {};
        employees.forEach(emp => {
          depts[emp.department] = (depts[emp.department] || 0) + 1;
        });
        
        const deptArray = Object.keys(depts).map(key => ({
          name: key,
          employees: depts[key]
        }));

        setStats({
          totalEmployees: employees.length,
          avgScore: avg.toFixed(1),
          topPerformers: top,
          deptData: deptArray
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, colorClass, gradientClass }) => (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${gradientClass} opacity-20 blur-xl group-hover:opacity-40 transition-opacity`}></div>
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-slate-400 font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass} bg-white/5 border border-white/10 backdrop-blur-md`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400">Welcome back, here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Employees" 
          value={stats.totalEmployees} 
          icon={Users} 
          colorClass="text-blue-400"
          gradientClass="bg-blue-500"
        />
        <StatCard 
          title="Average Performance" 
          value={`${stats.avgScore}`} 
          icon={TrendingUp} 
          colorClass="text-emerald-400"
          gradientClass="bg-emerald-500"
        />
        <StatCard 
          title="Top Performers" 
          value={stats.topPerformers} 
          icon={Award} 
          colorClass="text-amber-400"
          gradientClass="bg-amber-500"
        />
        <StatCard 
          title="Departments" 
          value={stats.deptData.length} 
          icon={BarChart3} 
          colorClass="text-purple-400"
          gradientClass="bg-purple-500"
        />
      </div>

      <div className="mt-8">
        <div className="glass-panel rounded-2xl p-6 border-white/10 border">
          <h3 className="text-lg font-bold text-white mb-6">Employees by Department</h3>
          {stats.deptData.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff' }} 
                  />
                  <Bar dataKey="employees" radius={[6, 6, 0, 0]}>
                    {stats.deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'][index % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-slate-400 py-12">No employee data available yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
