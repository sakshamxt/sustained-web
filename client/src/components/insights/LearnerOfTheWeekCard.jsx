// src/components/insights/LearnerOfTheWeekCard.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Zap, Award } from 'lucide-react'; // Icons for points, streak, title
import { Badge } from "@/components/ui/badge";

const LearnerOfTheWeekCard = () => {
  const [learner, setLearner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLearnerOfTheWeek = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/insights/learner-of-the-week');
        setLearner(response.data.learner || response.data); // Adjust based on API response structure
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch Learner of the Week.');
        console.error("Fetch Learner of the Week error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearnerOfTheWeek();
  }, []);

  const getInitials = (name) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="items-center pb-2 text-center">
          <Skeleton className="w-3/4 h-8 mb-1" />
          <Skeleton className="w-1/2 h-4" />
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-4 space-y-3">
          <Skeleton className="w-24 h-24 rounded-full" />
          <Skeleton className="w-1/2 h-6" />
          <div className="flex justify-around w-full pt-2">
            <div className="space-y-1 text-center"><Skeleton className="w-12 h-4" /><Skeleton className="w-16 h-4" /></div>
            <div className="space-y-1 text-center"><Skeleton className="w-12 h-4" /><Skeleton className="w-16 h-4" /></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !learner) {
    return (
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-lg text-center">
            <Award className="w-5 h-5 mr-2 text-muted-foreground" />
            Learner of the Week
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            {error || "Could not load Learner of the Week data at this time."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm transition-shadow duration-300 shadow-lg hover:shadow-xl">
      <CardHeader className="items-center p-6 text-center rounded-t-lg bg-gradient-to-br from-primary to-brand-primary-hover">
        <Award className="w-10 h-10 mb-2 text-amber-400" />
        <CardTitle className="text-2xl font-bold text-primary-foreground">
          Learner of the Week
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-6 space-y-4 text-center">
        <Avatar className="-mt-16 border-4 shadow-md h-28 w-28 border-primary-foreground ring-2 ring-primary">
          <AvatarImage src={learner.profilePictureUrl || undefined} alt={learner.username} />
          <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
            {getInitials(learner.username)}
          </AvatarFallback>
        </Avatar>
        <h3 className="pt-2 text-2xl font-semibold text-primary">{learner.username}</h3>
        <div className="flex justify-around w-full pt-3 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center text-muted-foreground">
              <Star className="w-4 h-4 mr-1 text-amber-500" />
              <span className="text-xs">Points</span>
            </div>
            <p className="text-xl font-bold text-brand-accent">{learner.points ?? 0}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-muted-foreground">
              <Zap className="w-4 h-4 mr-1 text-red-500" />
              <span className="text-xs">Streak</span>
            </div>
            <p className="text-xl font-bold text-brand-accent">{learner.streak ?? 0} days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearnerOfTheWeekCard;