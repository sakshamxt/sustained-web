// src/components/store/RedemptionItemCard.jsx - UPDATED

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, PackageX, ShoppingCart, Loader2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';

const RedemptionItemCard = ({ item, onRedeem, isRedeeming }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!item) return null;

  const canAfford = user ? user.points >= item.pointsRequired : false;
  const inStock = item.stock > 0;
  const canRedeem = isAuthenticated && canAfford && inStock;

  const imageUrl = item.imageUrl || `https://picsum.photos/400/225?random=${item._id}`;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 border shadow-sm group hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="relative p-0 border-b">
        <div className="overflow-hidden aspect-video">
          <img
            src={imageUrl}
            alt={item.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {item.stock <= 0 && (
          <Badge variant="destructive" className="absolute text-xs top-2 left-2">Out of Stock</Badge>
        )}
        {item.stock > 0 && item.stock <= 10 && (
          <Badge variant="secondary" className="absolute text-xs top-2 left-2">Low Stock</Badge>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-6">
        {/* UPDATED: Using theme-aware colors */}
        <CardTitle className="mb-2 text-lg font-bold text-foreground">
          {item.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-6 pt-0 mt-auto">
        <div className="flex items-center text-lg font-semibold text-primary mb-4">
          <Star className="w-5 h-5 mr-2 text-amber-500 fill-amber-500" />
          {item.pointsRequired.toLocaleString()} Points
        </div>
        <Button
          onClick={() => onRedeem(item._id)}
          disabled={!canRedeem || isRedeeming}
          className="w-full"
        >
          {isRedeeming ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
          {isRedeeming ? "Processing..." : "Redeem Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RedemptionItemCard;