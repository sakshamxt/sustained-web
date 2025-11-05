// src/pages/NewsDetailPage.jsx - FIXED

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '@/lib/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, ArrowLeft, Calendar, User } from "lucide-react";
import { format } from 'date-fns';

const NewsDetailPage = () => {
  const { newsId } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [moreNews, setMoreNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [itemResponse, listResponse] = await Promise.all([
          apiClient.get(`/community/news/${newsId}`),
          apiClient.get('/community/news')
        ]);
        
        const itemData = itemResponse.data?.newsItem || itemResponse.data;
        if (itemData) {
            setNewsItem(itemData);
        } else {
            throw new Error("News item not found.");
        }

        let listData = listResponse.data?.news || listResponse.data || [];
        if (Array.isArray(listData)) {
            setMoreNews(listData.filter(item => item._id !== newsId).slice(0, 4));
        }

      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch news details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsData();
  }, [newsId]);

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return ( <div className="container py-8 mx-auto text-center"><Alert variant="destructive" className="max-w-lg mx-auto"><Info className="w-4 h-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert></div> );
  // UPDATED: Using theme-aware text color
  if (!newsItem) return <div className="py-20 text-center text-muted-foreground">News article not found.</div>;

  const formattedDate = newsItem.createdAt && !isNaN(new Date(newsItem.createdAt))
    ? format(new Date(newsItem.createdAt), 'MMMM d, yyyy')
    : 'Unknown date';

  return (
    <div className="container py-8 mx-auto">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link to="/news"><ArrowLeft className="w-4 h-4 mr-2" /> Back to News</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        <main className="lg:col-span-2">
          <article className="space-y-6">
            {/* UPDATED: Using theme-aware text colors */}
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              {newsItem.title}
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><User className="w-4 h-4"/><span>by <Badge variant="secondary">{newsItem.postedByAdmin?.username || 'Admin'}</Badge></span></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/><span>{formattedDate}</span></div>
            </div>

            {newsItem.imageUrl && (
              <div className="overflow-hidden rounded-lg aspect-video">
                <img src={newsItem.imageUrl} alt={newsItem.title} className="object-cover w-full h-full" />
              </div>
            )}
            
            {/* UPDATED: Using theme-aware prose classes */}
            <div className="prose prose-lg max-w-none text-muted-foreground dark:prose-invert">
                {newsItem.text.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
          </article>
        </main>

        <aside className="lg:col-span-1 space-y-8 lg:sticky top-24 h-fit mt-12 lg:mt-0">
          {/* UPDATED: Using theme-aware colors */}
          <div className="p-6 rounded-lg bg-secondary border">
            <h3 className="text-lg font-bold text-foreground mb-4">More News</h3>
            <div className="space-y-4">
              {moreNews.map(item => (
                <Link key={item._id} to={`/news/${item._id}`} className="block group border-b pb-4 last:border-b-0">
                   <p className="font-bold text-foreground transition-colors group-hover:text-primary">{item.title}</p>
                   <p className="text-sm text-muted-foreground">{format(new Date(item.createdAt), 'MMMM d, yyyy')}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NewsDetailPage;