// src/components/sdg/SdgCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from 'lucide-react';

const SdgCard = ({ sdg }) => {
  if (!sdg) return null;

  // Use sdg.sdgNumber or sdg._id for the link, depending on your API for detail page
  // Assuming sdgNumber is good for a user-friendly URL and unique.
  // The API spec mentioned /sdgs/:idOrNumber
  const detailLink = `/sdgs/${sdg.sdgNumber}`;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 ease-in-out shadow-lg hover:shadow-xl group">
      <CardHeader className="relative p-0">
        {sdg.imageUrl ? (
          <img
            src={sdg.imageUrl}
            alt={sdg.title || 'SDG Image'}
            className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-48 bg-muted text-muted-foreground">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="default" className="p-2 text-lg font-bold rounded-full shadow-md bg-brand-accent text-accent-foreground">
            {sdg.sdgNumber || 'N/A'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="mb-2 text-xl font-semibold transition-colors text-primary group-hover:text-brand-accent">
          {sdg.title || 'Untitled SDG'}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">
          {/* Assuming 'shortDescription' or taking a snippet of 'description' */}
          {sdg.shortDescription || (Array.isArray(sdg.descriptions) && sdg.descriptions.length > 0 ? sdg.descriptions[0].substring(0,100)+'...' : 'No description available.')}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0 mt-auto border-t">
        <Button asChild variant="outline" className="w-full transition-colors group-hover:bg-brand-accent group-hover:text-accent-foreground group-hover:border-brand-accent">
          <Link to={detailLink}>
            Learn More <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SdgCard;