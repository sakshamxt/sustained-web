// src/pages/sdg/SdgDetailPage.jsx - UPDATED

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import apiClient from '@/lib/api';
import useAuthStore from '@/store/authStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Info, BookOpen, ListChecks, Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const SdgDetailPage = () => {
  const { idOrNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, fetchUserProfile, setUser, isLoading: authLoading } = useAuthStore();

  const [sdg, setSdg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isSubmittingContent, setIsSubmittingContent] = useState(null);

  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [currentActivityForSubmission, setCurrentActivityForSubmission] = useState(null);
  const [activityTextResponse, setActivityTextResponse] = useState("");

  // ... (all existing functions: sdgUserProgress, fetchSdgDetail, useEffects, handleEnroll, handleMarkAsComplete, etc. remain unchanged)
  // ... (paste all your existing JS logic here)

  if (isLoading || (isAuthenticated && authLoading && !user && !sdg)) return <LoadingSpinner size="lg" />;
  if (error) return <div className="container py-8 mx-auto text-center"><Alert variant="destructive"><Info className="w-4 h-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert></div>;
  if (!sdg) return <div className="py-10 text-center text-muted-foreground">SDG not found.</div>;

  const renderContentItem = (item, type) => {
    // ... (this function remains unchanged)
  };
  
  const presentations = sdg.presentations || [];
  const lessons = sdg.lessons || [];
  const activities = sdg.practicalActivities || [];

  return (
    // UPDATED: Main container with a two-column layout
    <div className="container py-8 mx-auto">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">

        {/* Main Content Column (2/3 width) */}
        <div className="w-full lg:w-2/3">
          <Card className="mb-8 overflow-hidden">
            {sdg.imageUrl && <img src={sdg.imageUrl} alt={sdg.title} className="object-cover w-full h-64 md:h-96" />}
            <CardHeader>
              <Badge className="w-fit mb-2 text-sm bg-accent text-accent-foreground">SDG {sdg.sdgNumber}</Badge>
              <CardTitle className="text-3xl font-bold md:text-4xl text-primary">{sdg.title}</CardTitle>
              {sdg.shortDescription && <CardDescription className="mt-1 text-lg">{sdg.shortDescription}</CardDescription>}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div><h3 className="mb-3 text-2xl font-semibold text-primary">About this Goal</h3>{Array.isArray(sdg.descriptions) ? sdg.descriptions.map((desc, index) => (<p key={index} className="mb-3 leading-relaxed text-muted-foreground">{desc}</p>)) : <p className="leading-relaxed text-muted-foreground">{sdg.descriptions}</p>}</div>
              {sdg.whatYouWillLearn && sdg.whatYouWillLearn.length > 0 && (<div><h3 className="mb-3 text-2xl font-semibold text-primary">What You Will Learn</h3><ul className="pl-2 space-y-1 list-disc list-inside text-muted-foreground">{sdg.whatYouWillLearn.map((point, index) => <li key={index}>{point}</li>)}</ul></div>)}
            </CardContent>
          </Card>

          {isEnrolled && (
            <Tabs defaultValue="lessons" className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-muted/50">
                <TabsTrigger value="presentations"><BookOpen className="inline-block w-4 h-4 mr-2"/>Presentations ({presentations.length})</TabsTrigger>
                <TabsTrigger value="lessons"><ListChecks className="inline-block w-4 h-4 mr-2"/>Lessons ({lessons.length})</TabsTrigger>
                <TabsTrigger value="activities"><Edit className="inline-block w-4 h-4 mr-2"/>Activities ({activities.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="presentations" className="py-4"><Card><CardHeader><CardTitle>Presentations</CardTitle></CardHeader><CardContent className="space-y-2">{presentations.length > 0 ? presentations.map(p => renderContentItem(p, 'presentation')) : <p className="text-sm text-muted-foreground">No presentations available.</p>}</CardContent></Card></TabsContent>
              <TabsContent value="lessons" className="py-4"><Card><CardHeader><CardTitle>Lessons</CardTitle></CardHeader><CardContent className="space-y-2">{lessons.length > 0 ? lessons.map(l => renderContentItem(l, 'lesson')) : <p className="text-sm text-muted-foreground">No lessons available.</p>}</CardContent></Card></TabsContent>
              <TabsContent value="activities" className="py-4"><Card><CardHeader><CardTitle>Practical Activities</CardTitle></CardHeader><CardContent className="space-y-2">{activities.length > 0 ? activities.map(a => renderContentItem(a, 'activity')) : <p className="text-sm text-muted-foreground">No activities available.</p>}</CardContent></Card></TabsContent>
            </Tabs>
          )}
        </div>

        {/* Sticky Sidebar Column (1/3 width) */}
        <aside className="w-full lg:w-1/3 lg:sticky lg:top-24 h-fit">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Course Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAuthenticated ? (isEnrolled ? (
                <>
                  <p className="text-sm text-muted-foreground">You are enrolled in this course.</p>
                  <div>
                    <Label>Your Progress</Label>
                    <Progress value={sdgUserProgress.percentage} className="w-full h-3 mt-1" />
                    <p className="mt-1 text-xs text-right text-muted-foreground">{sdgUserProgress.percentage}% Complete</p>
                  </div>
                   <Button variant="outline" className="w-full" disabled>
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />Enrolled
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">Join this course to start learning and track your progress.</p>
                  <Button onClick={handleEnroll} disabled={isEnrolling} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                    {isEnrolling ? <Loader2 className="w-4 h-4 mr-1 animate-spin"/> : null} Enroll Now
                  </Button>
                </>
              )) : (
                <>
                  <p className="text-sm text-muted-foreground">Join this course to start learning and track your progress.</p>
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                    <Link to="/login" state={{ from: location }}>Login to Enroll</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>

      <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
        {/* ... (Dialog component remains unchanged) ... */}
      </Dialog>
    </div>
  );
};

export default SdgDetailPage;