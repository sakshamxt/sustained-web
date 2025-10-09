// src/pages/NewsPage.jsx - WITH FUNCTIONAL SEARCH

import React from 'react';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import NewsCard from '@/components/community/NewsCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- 1. State for the search term ---
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/community/news');
        let newsData = response.data?.news || response.data || [];
        if (!Array.isArray(newsData)) newsData = [];
        setNewsItems(newsData);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch news.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);
  
  // --- 2. Filter the news items based on the search term ---
  const filteredNews = newsItems.filter(item => 
    (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.text && item.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // --- 3. Derive featured and other news from the *filtered* results ---
  const featuredNews = filteredNews.length > 0 ? filteredNews[0] : null;
  const otherNews = filteredNews.length > 1 ? filteredNews.slice(1) : [];

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return ( <div className="container py-8 mx-auto text-center"><Alert variant="destructive" className="max-w-lg mx-auto"><Info className="w-4 h-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert></div> );

  return (
    <div className="container py-8 mx-auto">
      <header className="py-12 mb-12 text-center border-b">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          News & Insights
        </h1>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-slate-600">
          The latest stories, announcements, and progress from the SustainED community.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        {/* Main Content Feed (2/3 width) */}
        <main className="lg:col-span-2">
          {/* Use the original newsItems to check if there is any news at all */}
          {newsItems.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <h3 className="text-2xl font-semibold">No News Yet</h3>
              <p className="mt-2">Check back soon for the latest updates.</p>
            </div>
          // Now, check if the *filtered* results are empty to show a "no results" message
          ) : filteredNews.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <h3 className="text-2xl font-semibold">No Results Found</h3>
              <p className="mt-2">Try a different search term.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {featuredNews && (
                <section className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
                  <Link to={`/news/${featuredNews._id}`} className="block group">
                    <div className="overflow-hidden rounded-lg aspect-video mb-6">
                      <img src={featuredNews.imageUrl} alt={featuredNews.title} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="mb-3 text-sm text-slate-500">
                      <span>{featuredNews.createdAt && !isNaN(new Date(featuredNews.createdAt)) ? format(new Date(featuredNews.createdAt), 'MMMM d, yyyy') : 'Unknown date'}</span> • by <Badge variant="secondary">{featuredNews.postedByAdmin?.username || 'Admin'}</Badge>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 transition-colors group-hover:text-primary">{featuredNews.title}</h2>
                    <p className="mt-4 text-base leading-relaxed text-slate-600 line-clamp-3">{featuredNews.text}</p>
                  </Link>
                </section>
              )}
              {otherNews.length > 0 && (
                <section className="space-y-8 pt-12 border-t">
                  {otherNews.map((item, index) => (
                    <div key={item._id || item.title} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${100 + index * 100}ms`, animationFillMode: 'forwards' }}>
                      <NewsCard newsItem={item} />
                    </div>
                  ))}
                </section>
              )}
            </div>
          )}
        </main>

        {/* Sidebar (1/3 width) */}
        <aside className="lg:col-span-1 space-y-8 lg:sticky top-24 h-fit">
          <div className="p-6 rounded-lg bg-slate-50 border">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Search News</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              {/* --- 4. Connect the Input to the state --- */}
              <Input 
                type="search" 
                placeholder="Find an article..." 
                className="w-full pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
           <div className="p-6 rounded-lg bg-slate-50 border">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Announcements</Badge>
              <Badge variant="outline">Success Stories</Badge>
              <Badge variant="outline">Events</Badge>
              <Badge variant="outline">Updates</Badge>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NewsPage;