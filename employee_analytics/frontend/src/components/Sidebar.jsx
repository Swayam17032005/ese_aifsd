import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, BrainCircuit, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Add Employee', path: '/add-employee', icon: UserPlus },
    { name: 'AI Insights', path: '/ai-insights', icon: BrainCircuit },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-white/10 hidden md:flex flex-col z-20 shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <div className="flex items-center space-x-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-bold text-xl">
          <Sparkles className="text-blue-400" size={24} />
          <span>TalentAI</span>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => clsx(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
              )}
            >
              <Icon size={20} className="group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-white/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
            <BrainCircuit className="text-blue-400" size={20} />
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">AI Powered</h4>
          <p className="text-xs text-slate-400">DeepSeek insights enabled</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
