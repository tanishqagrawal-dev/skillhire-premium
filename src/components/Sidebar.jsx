
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, User, LogOut, Cpu } from 'lucide-react';

const Sidebar = ({ logout }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'AI Analyzer', path: '/analyzer' },
    { icon: Briefcase, label: 'Company Intel', path: '/companies' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-20 md:w-64 glass-panel border-r border-slate-700/50 z-50 flex flex-col justify-between py-8">
      <div>
        <div className="flex items-center justify-center md:justify-start md:px-8 mb-12">
          <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
          <span className="hidden md:block ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            SkillGap
          </span>
        </div>
        
        <nav className="px-3 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-center md:justify-start px-4 py-3.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden md:block ml-3 font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-4">
        <button onClick={logout} className="w-full flex items-center justify-center md:justify-start px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="hidden md:block ml-3 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
