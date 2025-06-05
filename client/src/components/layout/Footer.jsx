// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted text-muted-foreground py-8 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm">
          &copy; {currentYear} SustainED. All rights reserved.
        </p>
        {/* Add any other footer links or information here */}
        {/* <p className="text-xs mt-2">
          <a href="#privacy" className="hover:text-primary">Privacy Policy</a> | <a href="#terms" className="hover:text-primary">Terms of Service</a>
        </p> */}
      </div>
    </footer>
  );
};

export default Footer;