// src/components/layout/AdminLayout.jsx
import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, BarChart3, Newspaper, Settings, Home, BookOpen, Gift, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';

const AdminLayout = () => {
  const { logoutUser } = useAuthStore();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    logoutUser();
    navigate('/login'); // Redirect to main site login
  };

  const adminNavItems = [
    { to: "/admin", label: "Dashboard", icon: <BarChart3 /> },
    { to: "/admin/users", label: "Users", icon: <Users /> },
    { to: "/admin/sdgs", label: "SDGs", icon: <BookOpen /> },
    { to: "/admin/news", label: "News", icon: <Newspaper /> },
    { to: "/admin/store", label: "Store Items", icon: <Gift /> },
    { to: "/admin/analytics", label: "Analytics", icon: <BarChart3 /> }, 
    { to: "/admin/streaks", label: "Notable Streaks", icon: <Zap /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
      <aside className="flex flex-col p-4 border-r shadow-sm w-60 bg-background text-foreground dark:border-slate-700">
        <div className="mb-6 text-center">
          <Link to="/admin" className="inline-flex items-center text-xl font-semibold transition-colors text-primary hover:text-brand-accent">
            <ShieldCheck className="mr-2 h-7 w-7 text-brand-accent" />
            Admin Panel
          </Link>
        </div>
        <nav className="flex-grow space-y-1.5">
          {adminNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end // Important for parent route like /admin to not stay active for /admin/users
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                ${isActive
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "hover:bg-muted hover:text-foreground"
                }`
              }
            >
              {React.cloneElement(item.icon, { className: "h-5 w-5 mr-3 flex-shrink-0" })}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="pt-4 mt-auto space-y-2 border-t dark:border-slate-700">
            <Button variant="outline" asChild className="justify-start w-full text-sm">
                <Link to="/"><Home className="w-4 h-4 mr-2"/>Go to Main Site</Link>
            </Button>
            <Button variant="ghost" onClick={handleAdminLogout} className="justify-start w-full text-sm text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Settings className="w-4 h-4 mr-2"/> Logout
            </Button>
        </div>
      </aside>

      <main className="flex-grow p-6 overflow-auto lg:p-8">
        <Outlet /> {/* Child admin routes will render here */}
      </main>
    </div>
  );
};

export default AdminLayout;