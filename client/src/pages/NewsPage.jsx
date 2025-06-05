// src/pages/NewsPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import NewsCard from '@/components/community/NewsCard'; // Create this component
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Assuming the API returns an object with a 'news' array: { news: [...] }
        // Or directly an array: [...]
        const response = await apiClient.get('/community/news');
        setNewsItems(response.data.news || response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch news.');
        console.error("Fetch News error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div className="container py-8 mx-auto text-center">
         <Alert variant="destructive" className="max-w-lg mx-auto">
          <Info className="w-4 h-4" />
          <AlertTitle>Error Fetching News</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (newsItems.length === 0) {
    return <div className="py-10 text-center text-muted-foreground">No news available at the moment.</div>;
  }

  return (
    <div className="container py-8 mx-auto">
      <h1 className="mb-10 text-3xl font-bold tracking-tight text-center text-primary">
        Latest News & Announcements
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {newsItems.map(item => (
          // Ensure news items have a unique key, like _id
          <NewsCard key={item._id || item.title} newsItem={item} />
        ))}
      </div>
    </div>
  );
};

export default NewsPage;