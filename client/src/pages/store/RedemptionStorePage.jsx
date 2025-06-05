// src/pages/store/RedemptionStorePage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import useAuthStore from '@/store/authStore';
import RedemptionItemCard from '@/components/store/RedemptionItemCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, ShoppingBasket } from "lucide-react";
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom';


const RedemptionStorePage = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, fetchUserProfile } = useAuthStore(); // fetchUserProfile to update points
  const [redeemingItemId, setRedeemingItemId] = useState(null);


  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/redemption/options');
        setItems(response.data.items || response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch redemption items.');
        console.error("Fetch Redemption Items error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleRedeemItem = async (itemId) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to redeem items.");
      navigate('/login', { state: { from: location } });
      return;
    }

    const itemToRedeem = items.find(it => it._id === itemId);
    if (!itemToRedeem) return;

    if (user.points < itemToRedeem.pointsRequired) {
      toast.error(`You need at least ${itemToRedeem.pointsRequired} points to redeem this item.`);
      return;
    }
    if (itemToRedeem.stock <= 0) {
      toast.error("This item is currently out of stock.");
      return;
    }

    setRedeemingItemId(itemId);
    try {
      // API endpoint: POST /redemption/redeem/${itemId}
      const response = await apiClient.post(`/redemption/redeem/${itemId}`);
      toast.success(`Successfully redeemed ${itemToRedeem.name}!`);
      // Refresh user profile to get updated points and potentially item stock
      await fetchUserProfile(); 
      // Refetch items to update stock display (or backend could return updated item)
      // For simplicity, we'll just update the one item locally if possible, or refetch all
      setItems(prevItems => prevItems.map(it => 
        it._id === itemId ? { ...it, stock: it.stock - 1 } : it
      ));

    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to redeem item.');
      console.error("Redemption error:", err);
    } finally {
      setRedeemingItemId(null);
    }
  };


  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div className="container py-8 mx-auto text-center">
         <Alert variant="destructive" className="max-w-lg mx-auto">
          <Info className="w-4 h-4" />
          <AlertTitle>Error Fetching Store Items</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      <header className="mb-10 text-center">
        <h1 className="flex items-center justify-center text-3xl font-bold tracking-tight text-primary">
          <ShoppingBasket className="w-8 h-8 mr-3 text-brand-accent" />
          Redemption Store
        </h1>
        <p className="mt-2 text-muted-foreground">
          Use your hard-earned points to redeem amazing rewards!
        </p>
        {isAuthenticated && user && (
            <p className="mt-3 text-lg font-semibold">Your Points: <span className="text-brand-accent">{user.points ?? 0}</span></p>
        )}
      </header>

      {items.length == 0 ? (
        <div className="py-10 text-center text-muted-foreground">No items available for redemption at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
          {items.map(item => (
            <RedemptionItemCard 
                key={item._id} 
                item={item} 
                onRedeem={handleRedeemItem}
                isRedeeming={redeemingItemId === item._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RedemptionStorePage;