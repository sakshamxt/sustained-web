// src/components/layout/Navbar.jsx - UPDATED

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logoutUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const baseNavLinks = [
    { to: '/', label: 'Home' },
    { to: '/sdgs', label: 'SDGs' },
    { to: '/news', label: 'News' },
    { to: '/insights/heatmap', label: 'Community' },
    { to: '/redeem', label: 'Redeem Store' }, 
  ];

  const navLinks = isAuthenticated 
    ? [...baseNavLinks.slice(0, 1), { to: '/my-courses', label: 'My Courses' }, ...baseNavLinks.slice(1)]
    : baseNavLinks;

  const activeLinkStyle = "bg-primary/10 text-primary";
  const inactiveLinkStyle = "text-muted-foreground hover:bg-primary/10 hover:text-primary";

  return (
    // UPDATED: Added bg-background/90 and backdrop-blur-sm for a modern, transparent effect
    <nav className="sticky top-0 z-50 border-b shadow-sm bg-background/90 backdrop-blur-sm">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary" onClick={() => setIsMobileMenuOpen(false)}>
              SustainED
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden space-x-2 md:flex md:items-center">
            {isAuthenticated ? (
              <>
                {user && <span className="hidden text-sm font-medium text-muted-foreground lg:inline">Hi, {user.username}!</span>}
                <Button variant="ghost" asChild><Link to="/profile">Profile</Link></Button>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
                <Button asChild><Link to="/register">Register</Link></Button>
              </>
            )}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md hover:bg-secondary focus:outline-none" aria-controls="mobile-menu" aria-expanded={isMobileMenuOpen}>
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
              ) : (
                <svg className="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (<NavLink key={link.label} to={link.to} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? activeLinkStyle : inactiveLinkStyle}`} onClick={() => setIsMobileMenuOpen(false)}>{link.label}</NavLink>))}
          </div>
          <div className="pt-4 pb-3 border-t">
            <div className="px-2 space-y-2">
              {isAuthenticated ? (
                <>
                  {user && <div className="px-3 py-2 text-base font-medium">Hi, {user.username}!</div>}
                  <Button variant="ghost" asChild className="justify-start w-full"><Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link></Button>
                  <Button variant="outline" onClick={handleLogout} className="w-full">Logout</Button>
                </>
              ) : (
                <div className='grid grid-cols-2 gap-2'>
                  <Button variant="ghost" asChild className="w-full"><Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link></Button>
                  <Button variant="default" asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"><Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link></Button>
                </div>
              )}
            </div>
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;