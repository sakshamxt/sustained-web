// src/pages/NewsPage.jsx - UPDATED

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
  
  const filteredNews = newsItems.filter(item => 
    (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.text && item.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  // Filter news based on search term in title or text
  const featuredNews = filteredNews.length > 0 ? filteredNews[0] : null;
  const otherNews = filteredNews.length > 1 ? filteredNews.slice(1) : [];

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return ( <div className="container py-8 mx-auto text-center"><Alert variant="destructive" className="max-w-lg mx-auto"><Info className="w-4 h-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert></div> );

  return (
    <div className="container py-8 mx-auto">
      <header className="py-12 mb-12 text-center border-b">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
          News & Insights
        </h1>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">
          The latest stories, announcements, and progress from the SustainED community.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        <main className="lg:col-span-2">
          {newsItems.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground"><h3 className="text-2xl font-semibold">No News Yet</h3><p className="mt-2">Check back soon for the latest updates.</p></div>
          ) : filteredNews.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground"><h3 className="text-2xl font-semibold">No Results Found</h3><p className="mt-2">Try a different search term.</p></div>
          ) : (
            <div className="space-y-12">
              {featuredNews && (
                <section className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
                  <Card className="grid grid-cols-1 md:grid-cols-2 overflow-hidden group">
                    {featuredNews.imageUrl && (
                      <CardHeader className="p-0">
                        <img src={featuredNews.imageUrl} alt={featuredNews.title} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                      </CardHeader>
                    )}
                    <CardContent className="flex flex-col p-8 lg:p-10">
                      <div className="mb-3 text-sm text-muted-foreground">
                        <span>{featuredNews.createdAt && !isNaN(new Date(featuredNews.createdAt)) ? format(new Date(featuredNews.createdAt), 'MMMM d, yyyy') : 'Unknown date'}</span> • by <Badge variant="secondary">{featuredNews.postedByAdmin?.username || 'Admin'}</Badge>
                      </div>
                      <CardTitle className="text-3xl font-bold text-foreground transition-colors group-hover:text-primary">{featuredNews.title}</CardTitle>
                      <CardDescription className="mt-4 text-base leading-relaxed text-muted-foreground line-clamp-6 flex-grow">{featuredNews.text}</CardDescription>
                    </CardContent>
                  </Card>
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
          {/* UPDATED: Replaced bg-slate-50 with bg-secondary and text-slate-xxx with theme-aware colors */}
          <div className="p-6 rounded-lg bg-secondary border">
            <h3 className="text-lg font-bold text-foreground mb-4">Search News</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Find an article..." 
                className="w-full pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="p-6 rounded-lg bg-secondary border">
            <h3 className="text-lg font-bold text-foreground mb-4">Categories</h3>
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