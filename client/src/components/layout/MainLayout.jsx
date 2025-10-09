// src/components/layout/MainLayout.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from "@/components/ui/sonner"

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="container flex-grow px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
      <Toaster position="bottom-center" />
    </div>
  );
};

export default MainLayout;