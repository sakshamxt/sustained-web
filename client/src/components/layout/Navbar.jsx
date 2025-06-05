// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
// Optional: For a dropdown later
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { LogOut, UserCircle } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logoutUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    setIsMobileMenuOpen(false); // Close mobile menu if open
    navigate('/login'); // Redirect to login page after logout
  };

  const baseNavLinks = [
    { to: '/', label: 'Home' },
    { to: '/sdgs', label: 'SDGs' },
    { to: '/news', label: 'News' },
    { to: '/insights/heatmap', label: 'Heatmap' },
    { to: '/redeem', label: 'Redeem Store' }, 
  ];

  // Add links that require authentication if needed, or filter based on auth
  const authNavLinks = isAuthenticated ? [
    // Example: { to: '/dashboard', label: 'Dashboard' },
  ] : [];

  const navLinks = [...baseNavLinks, ...authNavLinks];

  const activeLinkStyle = "bg-primary-foreground text-primary";
  const inactiveLinkStyle = "hover:bg-primary-foreground hover:text-primary";

  return (
    <nav className="sticky top-0 z-50 shadow-md bg-primary text-primary-foreground">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold transition-opacity hover:opacity-90" onClick={() => setIsMobileMenuOpen(false)}>
              SustainED
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? activeLinkStyle : inactiveLinkStyle}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Auth Section - Desktop */}
          <div className="hidden space-x-2 md:flex md:items-center">
            {isAuthenticated ? (
              <>
                {user && <span className="hidden text-sm lg:inline">Hi, {user.username}!</span>}
                <Button variant="ghost" asChild className="hover:bg-primary-foreground hover:text-primary">
                  <Link to="/profile">Profile</Link>
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="border-primary-foreground/50 text-primary-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive">
                  Logout
                </Button>
                {/* Enhancement: Replace with User DropdownMenu here using Avatar */}
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="hover:bg-primary-foreground hover:text-primary">
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="default" asChild className="bg-brand-accent text-accent-foreground hover:bg-brand-accent-hover">
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-foreground hover:bg-primary-foreground hover:text-primary focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              ) : (
                <svg className="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? activeLinkStyle : inactiveLinkStyle}`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-primary-foreground/20">
            <div className="px-2 space-y-2">
              {isAuthenticated ? (
                <>
                  {user && <div className="px-3 py-2 text-base font-medium">Hi, {user.username}!</div>}
                  <Button variant="ghost" asChild className="justify-start w-full hover:bg-primary-foreground hover:text-primary">
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                  </Button>
                  <Button
                  variant="ghost" // Changed from "outline"
                  onClick={handleLogout}
                  className="border border-primary-foreground/30 text-primary-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                >
                  Logout
                </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="justify-start w-full hover:bg-primary-foreground hover:text-primary">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button variant="default" asChild className="justify-start w-full bg-brand-accent text-accent-foreground hover:bg-brand-accent-hover">
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;