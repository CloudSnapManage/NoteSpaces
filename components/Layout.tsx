import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Plus, User, Zap, LayoutGrid, Compass, Bookmark, Menu, X, Settings } from 'lucide-react';

const Layout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // --- PUBLIC LAYOUT (Logged Out) ---
  if (!user) {
    return (
      <div className="min-h-screen font-sans bg-[#F5F6FB] text-navy-800">
        <nav className="fixed w-full z-50 top-0 bg-white/80 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-brand-500 p-2 rounded-xl shadow-lg shadow-brand-500/30">
                  <Zap className="h-5 w-5 text-white" fill="currentColor" />
                </div>
                <span className="text-2xl font-heading font-bold text-navy-900 tracking-tight">
                  NoteSpace
                </span>
              </Link>
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-navy-600 hover:text-navy-900 font-medium text-sm">Log In</Link>
                <Link to="/register" className="px-6 py-2.5 rounded-full bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 transition-all shadow-lg">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-20">
          <Outlet />
        </main>
      </div>
    );
  }

  // --- DASHBOARD LAYOUT (Logged In) ---
  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link
      to={to}
      onClick={() => setMobileMenuOpen(false)}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
        isActive(to)
          ? 'bg-white shadow-sm text-brand-600 font-semibold'
          : 'text-navy-500 hover:bg-white/50 hover:text-navy-800'
      }`}
    >
      <Icon className={`h-5 w-5 ${isActive(to) ? 'text-brand-500' : 'text-navy-400 group-hover:text-navy-600'}`} />
      <span className="text-sm">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans flex overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#F5F6FB] border-r border-gray-200/50 h-screen fixed left-0 top-0 z-40">
        <div className="p-8 pb-4">
           <Link to="/" className="flex items-center gap-3">
              <div className="bg-brand-500 p-2 rounded-xl shadow-lg shadow-brand-500/20">
                <Zap className="h-5 w-5 text-white" fill="currentColor" />
              </div>
              <span className="text-2xl font-heading font-bold text-navy-900">NoteSpace</span>
           </Link>
        </div>

        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="px-4 mb-2 text-xs font-bold text-navy-400 uppercase tracking-wider">Menu</div>
          <NavItem to="/" icon={LayoutGrid} label="Dashboard" />
          <NavItem to="/profile" icon={User} label="My Notes" />
          <NavItem to="/create" icon={Plus} label="Create Note" />
          
          <div className="px-4 mt-8 mb-2 text-xs font-bold text-navy-400 uppercase tracking-wider">Discover</div>
          <div className="px-4 py-2 text-sm text-navy-400 italic">Coming soon...</div>
          <button className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-navy-400 hover:text-navy-600 hover:bg-white/50 w-full text-left transition-all cursor-not-allowed opacity-60">
            <Compass className="h-5 w-5" />
            <span className="text-sm">Explore Topics</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-navy-400 hover:text-navy-600 hover:bg-white/50 w-full text-left transition-all cursor-not-allowed opacity-60">
            <Bookmark className="h-5 w-5" />
            <span className="text-sm">Saved Notes</span>
          </button>
        </div>

        <div className="p-4 border-t border-gray-200/50">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-3 mb-3">
               <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                 {user.email?.[0].toUpperCase()}
               </div>
               <div className="overflow-hidden">
                 <p className="text-sm font-bold text-navy-900 truncate">My Account</p>
                 <p className="text-xs text-navy-500 truncate">{user.email}</p>
               </div>
             </div>
             <button 
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 text-xs font-medium text-navy-500 hover:text-red-500 py-2 rounded-lg hover:bg-red-50 transition-colors"
             >
               <LogOut className="h-3 w-3" /> Sign Out
             </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 h-16 flex items-center justify-between">
         <Link to="/" className="flex items-center gap-2">
            <div className="bg-brand-500 p-1.5 rounded-lg">
              <Zap className="h-4 w-4 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-heading font-bold text-navy-900">NoteSpace</span>
         </Link>
         <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-navy-600">
           <Menu className="h-6 w-6" />
         </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-900/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-2xl p-6 flex flex-col animate-fade-in">
             <div className="flex justify-end mb-8">
               <button onClick={() => setMobileMenuOpen(false)}><X className="h-6 w-6 text-navy-400" /></button>
             </div>
             <div className="space-y-2 flex-1">
                <NavItem to="/" icon={LayoutGrid} label="Dashboard" />
                <NavItem to="/profile" icon={User} label="My Profile" />
                <NavItem to="/create" icon={Plus} label="Create Note" />
             </div>
             <button onClick={handleSignOut} className="flex items-center gap-2 text-red-500 font-medium mt-auto pt-6 border-t border-gray-100">
               <LogOut className="h-5 w-5" /> Sign Out
             </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen pt-20 lg:pt-8 px-4 sm:px-8 lg:px-12 pb-12 overflow-x-hidden">
        <Outlet />
      </main>

       {/* Floating Action Button (Mobile Only) */}
       <Link
          to="/create"
          className="fixed bottom-6 right-6 z-40 lg:hidden flex items-center justify-center h-14 w-14 rounded-full bg-accent text-navy-900 shadow-xl shadow-orange-500/20 hover:scale-105 transition-transform active:scale-95 border-2 border-white"
        >
          <Plus className="h-7 w-7" />
        </Link>
    </div>
  );
};

export default Layout;