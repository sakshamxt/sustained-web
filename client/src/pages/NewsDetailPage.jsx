// src/pages/NewsDetailPage.jsx - NEW FILE

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
        // Fetch both the specific article and the list for "more news"
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
            // Filter out the current article and take the next few
            setMoreNews(listData.filter(item => item._id !== newsId).slice(0, 4));
        }

      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch news details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsData();
  }, [newsId]); // Re-fetch if the newsId changes

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return ( <div className="container py-8 mx-auto text-center"><Alert variant="destructive" className="max-w-lg mx-auto"><Info className="w-4 h-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert></div> );
  if (!newsItem) return <div className="py-20 text-center text-slate-500">News article not found.</div>;

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
        {/* Main Article Content */}
        <main className="lg:col-span-2">
          <article className="space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              {newsItem.title}
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2"><User className="w-4 h-4"/><span>by <Badge variant="secondary">{newsItem.postedByAdmin?.username || 'Admin'}</Badge></span></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/><span>{formattedDate}</span></div>
            </div>

            {newsItem.imageUrl && (
              <div className="overflow-hidden rounded-lg aspect-video">
                <img src={newsItem.imageUrl} alt={newsItem.title} className="object-cover w-full h-full" />
              </div>
            )}
            
            {/* Article Body */}
            <div className="prose prose-lg max-w-none text-slate-600">
                {/* Splitting text by newline to create paragraphs */}
                {newsItem.text.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
          </article>
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-8 lg:sticky top-24 h-fit mt-12 lg:mt-0">
          <div className="p-6 rounded-lg bg-slate-50 border">
            <h3 className="text-lg font-bold text-slate-900 mb-4">More News</h3>
            <div className="space-y-4">
              {moreNews.map(item => (
                <Link key={item._id} to={`/news/${item._id}`} className="block group border-b pb-4 last:border-b-0">
                   <p className="font-bold text-slate-800 transition-colors group-hover:text-primary">{item.title}</p>
                   <p className="text-sm text-slate-500">{format(new Date(item.createdAt), 'MMMM d, yyyy')}</p>
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