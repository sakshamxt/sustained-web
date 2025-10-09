// src/components/community/NewsCard.jsx - CARD-BASED VERSION

import React from 'react';
import { Card } from "@/components/ui/card"; // Import the main Card component
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const NewsCard = ({ newsItem }) => {
  if (!newsItem) return null;

  const formattedDate = newsItem.createdAt && !isNaN(new Date(newsItem.createdAt)) 
    ? format(new Date(newsItem.createdAt), 'MMMM d, yyyy') 
    : 'Unknown date';
    
  // A placeholder link, update if you have specific news detail pages
  const newsLink = `/news/${newsItem._id}`; 

  return (
    // The entire component is now wrapped in a Card for clear separation
    <Card className="group transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 overflow-hidden">
        <Link to={newsLink} className="block">
            <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Image Section */}
                {newsItem.imageUrl && (
                    <div className="md:col-span-1 overflow-hidden h-full">
                        <img
                            src={newsItem.imageUrl}
                            alt={newsItem.title || 'News Image'}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                )}
                
                {/* Content Section */}
                <div className={newsItem.imageUrl ? "md:col-span-2 p-6" : "col-span-3 p-6"}>
                    <div className="mb-2 text-sm text-slate-500">
                        <span>{formattedDate}</span> • by <Badge variant="secondary">{newsItem.postedByAdmin?.username || 'Admin'}</Badge>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-primary">
                        {newsItem.title || 'Untitled News'}
                    </h2>
                    <p className="mt-2 text-base text-slate-600 line-clamp-2">
                        {newsItem.text || 'No content available.'}
                    </p>
                </div>
            </div>
        </Link>
    </Card>
  );
};

export default NewsCard;