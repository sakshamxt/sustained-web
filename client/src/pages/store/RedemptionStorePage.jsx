// src/pages/store/RedemptionStorePage.jsx - MODERNIZED

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import useAuthStore from '@/store/authStore';
import RedemptionItemCard from '@/components/store/RedemptionItemCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Star, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';

const RedemptionStorePage = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, fetchUserProfile } = useAuthStore();
  const [redeemingItemId, setRedeemingItemId] = useState(null);

  useEffect(() => {
    // ... (Your existing fetchItems logic remains the same)
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        let responseData = await apiClient.get('/redemption/options');
        let itemsData = responseData.data || [];
        if (!Array.isArray(itemsData)) itemsData = [];
        setItems(itemsData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch items.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleRedeemItem = async (itemId) => {
    // ... (Your existing handleRedeemItem logic remains the same)
    if (!isAuthenticated) { /* ... */ return; }
    const itemToRedeem = items.find(it => it._id === itemId);
    if (!itemToRedeem) return;
    if (user.points < itemToRedeem.pointsRequired) { /* ... */ return; }
    if (itemToRedeem.stock <= 0) { /* ... */ return; }
    setRedeemingItemId(itemId);
    try {
      await apiClient.post(`/redemption/redeem/${itemId}`);
      toast.success(`Successfully redeemed ${itemToRedeem.title}!`);
      await fetchUserProfile(true); 
      setItems(prevItems => prevItems.map(it => it._id === itemId ? { ...it, stock: it.stock - 1 } : it));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to redeem item.');
    } finally {
      setRedeemingItemId(null);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return ( <div className="container py-8 mx-auto text-center"><Alert variant="destructive" className="max-w-lg mx-auto"><Info className="w-4 h-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert></div> );

  return (
    <div className="container py-8 mx-auto">
      <header className="py-12 mb-12 text-center border-b">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          Redemption Store
        </h1>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-slate-600">
          Use your hard-earned points from learning to redeem amazing, sustainable rewards.
        </p>
      </header>
      
      {/* NEW: Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
        {/* Main Content (Grid of items) */}
        <main className="lg:col-span-3">
          {items.length === 0 ? (
            <div className="py-20 text-center text-slate-500 rounded-lg bg-slate-50 border">
              <h3 className="text-2xl font-semibold">Store is Currently Empty</h3>
              <p className="mt-2">Check back soon for new rewards!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item, index) => (
                <div 
                  key={item._id}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'forwards' }}
                >
                  <RedemptionItemCard item={item} onRedeem={handleRedeemItem} isRedeeming={redeemingItemId === item._id} />
                </div>
              ))}
            </div>
          )}
        </main>

        {/* NEW: Sidebar */}
        <aside className="lg:col-span-1 space-y-8 lg:sticky top-24 h-fit">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" /> Your Points Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAuthenticated && user ? (
                <p className="text-4xl font-bold text-white">{user.points?.toLocaleString() ?? 0}</p>
              ) : (
                <p className="text-sm">Log in to see your points.</p>
              )}
            </CardContent>
          </Card>
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2 text-base">
                 <Gift className="w-5 h-5 text-primary" /> How It Works
               </CardTitle>
             </CardHeader>
             <CardContent className="text-sm text-slate-600 space-y-2">
                <p>1. Complete lessons to earn points.</p>
                <p>2. Browse the rewards in the store.</p>
                <p>3. Click "Redeem Now" if you have enough points!</p>
             </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default RedemptionStorePage;