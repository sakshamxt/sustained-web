// src/components/community/NewsCard.jsx
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns'; // For formatting dates

const NewsCard = ({ newsItem }) => {
  if (!newsItem) return null;

  const formattedDate = newsItem.createdAt ? format(new Date(newsItem.createdAt), 'MMMM d, yyyy') : 'N/A';

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 ease-in-out shadow-md hover:shadow-lg">
      {newsItem.imageUrl && (
        <CardHeader className="p-0">
          <img
            src={newsItem.imageUrl}
            alt={newsItem.title || 'News Image'}
            className="object-cover w-full h-52" // Fixed height for consistency
          />
        </CardHeader>
      )}
      <CardContent className="flex-grow p-6">
        <CardTitle className="mb-2 text-xl font-semibold text-primary">
          {newsItem.title || 'Untitled News'}
        </CardTitle>
        <CardDescription className="mb-3 text-sm text-muted-foreground line-clamp-4">
          {newsItem.text || 'No content available.'}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col items-start justify-between p-6 pt-2 text-xs border-t sm:flex-row sm:items-center text-muted-foreground">
        <div className="mb-2 sm:mb-0">
          Posted by: <Badge variant="secondary">{newsItem.postedByAdmin?.username || 'Admin'}</Badge>
        </div>
        <div>
          {formattedDate}
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;