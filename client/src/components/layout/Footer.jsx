// src/components/layout/Footer.jsx - UPDATED

import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react'; // Social icons

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // UPDATED: Replaced bg-secondary/50 with bg-secondary for a solid, theme-aware background
    <footer className="mt-32 border-t bg-secondary">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-8 md:space-y-0">
          
          {/* Left Side: Logo and Mission */}
          <div>
            <h3 className="text-2xl font-bold text-primary">SustainED</h3>
            <p className="mt-2 text-muted-foreground">Education for a Sustainable Future.</p>
          </div>

          {/* Center: Quick Links */}
          <div className="flex space-x-6 font-medium">
            <Link to="/" className="text-muted-foreground transition-colors hover:text-primary">Home</Link>
            <Link to="/sdgs" className="text-muted-foreground transition-colors hover:text-primary">SDGs</Link>
            <Link to="/news" className="text-muted-foreground transition-colors hover:text-primary">News</Link>
          </div>

          {/* Right Side: Social Icons */}
          <div className="flex space-x-4">
            <a href="https://github.com/sakshamxt" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
              <Github className="w-6 h-6" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://x.com/tyagiisaksham" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
              <Twitter className="w-6 h-6" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="https://www.linkedin.com/in/tyagiisaksham/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
              <Linkedin className="w-6 h-6" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Developer Credit */}
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground text-sm">
          <p>&copy; {currentYear} SustainED. All Rights Reserved.</p>
          <p className="mt-1">
            Developed by <a href="https://github.com/sakshamxt" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">Saksham Tyagi</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;