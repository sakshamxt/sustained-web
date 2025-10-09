// src/pages/sdg/SdgListPage.jsx - UPDATED with larger cards

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import SdgCard from '@/components/sdg/SdgCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Terminal, ListFilter, Search } from "lucide-react";

const SdgListPage = () => {
  const [sdgs, setSdgs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSdgs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/sdgs');
        let sdgData = [];
        if (response.data && Array.isArray(response.data.sdgs)) {
            sdgData = response.data.sdgs;
        } else if (response.data && Array.isArray(response.data)) {
            sdgData = response.data;
        }
        setSdgs(sdgData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch SDGs.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSdgs();
  }, []);

  const filteredSdgs = sdgs.filter(sdg =>
    (sdg.title && sdg.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return ( <div className="container py-8 mx-auto text-center"><Alert variant="destructive" className="max-w-lg mx-auto"><Terminal className="w-4 h-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert></div> );

  return (
    <div className="container py-8 mx-auto">
      <section className="p-6 mb-12 rounded-lg bg-slate-50 border">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              The 17 Goals
            </h1>
            <p className="mt-2 text-slate-600 max-w-prose">
              Explore the Sustainable Development Goals — a universal call to action to end poverty, protect the planet, and ensure that by 2030 all people enjoy peace and prosperity.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input type="search" placeholder="Search goals..." className="w-full pl-10 text-base outline:none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Button variant="outline">
              <ListFilter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </section>

      {filteredSdgs.length === 0 && !isLoading ? (
        <div className="py-20 text-center text-slate-500">
          <h3 className="text-2xl font-semibold">No Results Found</h3>
          <p className="mt-2">Try adjusting your search term.</p>
        </div>
      ) : (
        // --- UPDATED GRID ---
        // Changed lg:grid-cols-6 to lg:grid-cols-5 and increased gap for larger cards
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredSdgs.map((sdg, index) => (
            <div
              key={sdg._id || sdg.sdgNumber}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
            >
              <SdgCard sdg={sdg} />
            </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default SdgListPage;