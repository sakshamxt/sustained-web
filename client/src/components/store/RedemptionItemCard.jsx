// src/components/store/RedemptionItemCard.jsx
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, PackageX, ShoppingCart, Info } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { Link } from 'react-router-dom';

const RedemptionItemCard = ({ item, onRedeem, isRedeeming }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!item) return null;

  const canAfford = user ? user.points >= item.pointsRequired : false;
  const inStock = item.stock > 0;
  const canRedeem = isAuthenticated && canAfford && inStock;

  let redeemButtonText = "Redeem";
  if (!isAuthenticated) redeemButtonText = "Login to Redeem";
  else if (!inStock) redeemButtonText = "Out of Stock";
  else if (!canAfford) redeemButtonText = "Not Enough Points";
  
  if (isRedeeming) redeemButtonText = "Processing...";

  const handleRedeemClick = () => {
      if (!isAuthenticated) {
          // The onRedeem function will handle navigation, but we could also navigate here.
          onRedeem(item._id);
          return;
      }
      onRedeem(item._id);
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 ease-in-out shadow-lg hover:shadow-xl group">
      <CardHeader className="relative p-0">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title || 'Item Image'}
            className="object-cover w-full transition-transform duration-300 h-52 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-52 bg-muted text-muted-foreground">
            <PackageX className="w-16 h-16" />
          </div>
        )}
        {item.stock <= 0 && (
            <Badge variant="destructive" className="absolute text-xs top-2 left-2">Out of Stock</Badge>
        )}
        {item.stock > 0 && item.stock <= 10 && (
            <Badge variant="outline" className="absolute text-xs top-2 left-2 border-amber-500 text-amber-600 bg-amber-50">Low Stock ({item.stock} left)</Badge>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-6">
        {/* FIX: Use item.title instead of item.name */}
        <CardTitle className="mb-2 text-xl font-semibold transition-colors text-primary group-hover:text-brand-accent">
          {item.title || 'Untitled Item'}
        </CardTitle>
        <CardDescription className="mb-3 text-sm text-muted-foreground line-clamp-3">
          {item.description || 'No description available.'}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-6 pt-2 mt-auto space-y-3 border-t">
        <div className="flex items-center text-lg font-semibold text-brand-accent">
          <Star className="w-5 h-5 mr-2 text-amber-500 fill-amber-500" />
          {item.pointsRequired} Points
        </div>
        <Button
          onClick={handleRedeemClick}
          disabled={!canRedeem || isRedeeming}
          className="w-full"
          variant={canRedeem ? "default" : "outline"}
        >
          {isRedeeming && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {!isRedeeming && !canRedeem && !isAuthenticated && <Info className="w-4 h-4 mr-2" />}
          {!isRedeeming && !canRedeem && isAuthenticated && !inStock && <PackageX className="w-4 h-4 mr-2" />}
          {!isRedeeming && !canRedeem && isAuthenticated && inStock && !canAfford && <Star className="w-4 h-4 mr-2" />}
          {!isRedeeming && canRedeem && <ShoppingCart className="w-4 h-4 mr-2" />}
          {redeemButtonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RedemptionItemCard;