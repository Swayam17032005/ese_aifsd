import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="h-16 glass-panel border-b border-white/10 flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
      <div className="flex items-center">
        {/* Mobile menu button could go here */}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-white/5 py-1.5 px-3 rounded-full border border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <UserIcon size={16} className="text-white" />
          </div>
          <span className="text-sm font-medium text-white/90 hidden sm:block">{user?.name}</span>
        </div>
        
        <button 
          onClick={logout}
          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
