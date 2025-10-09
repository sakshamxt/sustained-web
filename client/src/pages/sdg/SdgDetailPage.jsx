// src/pages/sdg/SdgDetailPage.jsx - FIXED FOR THEME CONSISTENCY

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import apiClient from '@/lib/api';
import useAuthStore from '@/store/authStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  // --- STATE AND HOOKS ---
  const { idOrNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, fetchUserProfile, setUser } = useAuthStore();

  const [sdg, setSdg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isSubmittingContent, setIsSubmittingContent] = useState(null);

  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [currentActivityForSubmission, setCurrentActivityForSubmission] = useState(null);
  const [activityTextResponse, setActivityTextResponse] = useState("");

  // --- DATA FETCHING ---
  const fetchSdgDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/sdgs/${idOrNumber}`);
      setSdg(response.data.sdg || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch SDG details.');
    } finally {
      setIsLoading(false);
    }
  }, [idOrNumber]);

  useEffect(() => {
    fetchSdgDetail();
  }, [fetchSdgDetail]);

  // --- DERIVED STATE & MEMOS ---
  const sdgUserProgress = useMemo(() => {
    const defaultProgress = { completedItems: new Set(), percentage: 0 };
    if (!user || !sdg || !user.progressBySdg || !user.progressBySdg[sdg._id]) return defaultProgress;
    
    const progressData = user.progressBySdg[sdg._id];
    const completed = [
        ...(progressData.completedPresentations || []),
        ...(progressData.completedLessons || []),
        ...((progressData.completedActivities || []).map(act => act.activityId))
    ];

    return {
      completedItems: new Set(completed),
      percentage: progressData.progressPercentage || 0,
    };
  }, [user, sdg]);

  const isEnrolled = useMemo(() => {
    if (!isAuthenticated || !user?.enrolledCourses || !sdg) return false;
    return user.enrolledCourses.some(courseId => courseId === sdg._id);
  }, [isAuthenticated, user, sdg]);


  // --- HANDLER FUNCTIONS ---
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to enroll.");
      navigate('/login', { state: { from: location } });
      return;
    }
    setIsEnrolling(true);
    try {
      await apiClient.post(`/sdgs/${sdg._id}/enroll`);
      toast.success(`Successfully enrolled in ${sdg.title}!`);
      await fetchUserProfile(true); // Force a refresh of user data
    } catch (err) {
      toast.error("Enrollment failed.", { description: err.response?.data?.message || err.message });
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleMarkAsComplete = async (contentType, contentId, submissionData = null) => {
    if (!sdg?._id) return;
    setIsSubmittingContent(contentId);
    try {
      const response = await apiClient.post(`/progress/${sdg._id}/complete/${contentType}/${contentId}`, submissionData ? { submissionData } : {});
      const { progress: updatedSdgProgress, awardedPoints, currentStreak, newTotalPoints } = response.data;

      toast.success(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Completed!`, {
        description: `You earned ${awardedPoints} points. Current streak: ${currentStreak} days.`
      });

      const updatedUser = {
        ...user,
        points: newTotalPoints,
        streak: currentStreak,
        progressBySdg: { ...user.progressBySdg, [sdg._id]: updatedSdgProgress },
      };
      setUser(updatedUser);

      if (isSubmissionDialogOpen) {
        setIsSubmissionDialogOpen(false);
        setActivityTextResponse("");
      }
    } catch (err) {
      toast.error("Completion Failed", { description: err.response?.data?.message || "Could not mark as complete." });
    } finally {
      setIsSubmittingContent(null);
    }
  };
  
  const openSubmissionDialog = (activity) => {
    setCurrentActivityForSubmission(activity);
    setActivityTextResponse("");
    setIsSubmissionDialogOpen(true);
  };

  const handleActivitySubmit = () => {
    if (!currentActivityForSubmission) return;
    if (currentActivityForSubmission.submissionType === 'textResponse' && !activityTextResponse.trim()) {
      toast.error("Please provide a response before submitting.");
      return;
    }
    handleMarkAsComplete('activity', currentActivityForSubmission._id, { textResponse: activityTextResponse });
  };
  
  const renderContentItem = (item, type) => {
    const isCompleted = sdgUserProgress.completedItems.has(item._id);
    const isSubmittingThis = isSubmittingContent === item._id;
    const requiresSubmission = type === 'activity' && item.submissionType !== 'none';

    return (
      // UPDATED: Replaced hard-coded hover colors with theme-aware "hover:bg-secondary"
      <div key={item._id} className="flex items-center justify-between p-3 transition-colors border rounded-md hover:bg-secondary">
        <span className="text-sm font-medium text-foreground">{item.title}</span>
        {isCompleted ? (
          <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-4 h-4 mr-1" />Completed</Badge>
        ) : (
          <Button size="sm" variant="outline" onClick={() => requiresSubmission ? openSubmissionDialog(item) : handleMarkAsComplete(type, item._id)} disabled={isSubmittingThis || !isEnrolled}>
            {isSubmittingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1" />}
            {requiresSubmission ? 'Submit' : 'Mark Complete'}
          </Button>
        )}
      </div>
    );
  };
  
  // --- RENDER LOGIC ---
  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return ( <div className="container py-8 mx-auto text-center"><Alert variant="destructive"><Info className="w-4 h-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert></div>);
  if (!sdg) return <div className="py-10 text-center text-muted-foreground">SDG not found.</div>;
  
  const presentations = sdg.presentations || [];
  const lessons = sdg.lessons || [];
  const activities = sdg.practicalActivities || [];

  return (
    <div className="container py-8 mx-auto">
      <header 
        className="py-12 mb-12 text-center border-b opacity-0 animate-fade-in-up"
        style={{ animationFillMode: 'forwards' }}
      >
        <Badge className="mb-4">{`SDG ${sdg.sdgNumber}`}</Badge>
        {/* UPDATED: text-foreground and text-muted-foreground for theme consistency */}
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">{sdg.title}</h1>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">{sdg.shortDescription}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        <main 
          className="lg:col-span-2 space-y-8 opacity-0 animate-fade-in-up animation-delay-300"
          style={{ animationFillMode: 'forwards' }}
        >
          <Card>
            {sdg.imageUrl && <img src={sdg.imageUrl} alt={sdg.title} className="object-cover w-full h-64 rounded-t-lg" />}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="about"><BookOpen className="w-4 h-4 mr-2" />About</TabsTrigger>
                  <TabsTrigger value="lessons"><ListChecks className="w-4 h-4 mr-2" />Lessons ({lessons.length})</TabsTrigger>
                  <TabsTrigger value="activities"><Edit className="w-4 h-4 mr-2" />Activities ({activities.length})</TabsTrigger>
                  <TabsTrigger value="presentations">Presentations ({presentations.length})</TabsTrigger>
              </TabsList>
              {/* UPDATED: Simplified description rendering logic */}
              <TabsContent value="about" className="p-6 prose prose-lg max-w-none text-muted-foreground dark:prose-invert">
                {(sdg.descriptions || [sdg.fullDescription]).join('\n\n').split('\n').map((p, i) => p && <p key={i}>{p}</p>)}
              </TabsContent>
              <TabsContent value="lessons" className="p-6 space-y-2">
                {lessons.length > 0 ? lessons.map(l => renderContentItem(l, 'lesson')) : <p className="text-sm text-center text-muted-foreground py-4">No lessons available for this course yet.</p>}
              </TabsContent>
              <TabsContent value="activities" className="p-6 space-y-2">
                 {activities.length > 0 ? activities.map(a => renderContentItem(a, 'activity')) : <p className="text-sm text-center text-muted-foreground py-4">No activities available for this course yet.</p>}
              </TabsContent>
              <TabsContent value="presentations" className="p-6 space-y-2">
                {presentations.length > 0 ? presentations.map(p => renderContentItem(p, 'presentation')) : <p className="text-sm text-center text-muted-foreground py-4">No presentations available for this course yet.</p>}
              </TabsContent>
            </Tabs>
          </Card>
        </main>

        <aside 
          className="lg:col-span-1 lg:sticky top-24 h-fit space-y-8 opacity-0 animate-fade-in-up animation-delay-500"
          style={{ animationFillMode: 'forwards' }}
        >
          <Card className="shadow-lg">
            <CardHeader><CardTitle>Course Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {isAuthenticated ? (isEnrolled ? (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><Label>Your Progress</Label><span className="font-semibold text-primary">{Math.round(sdgUserProgress.percentage)}%</span></div>
                    <Progress value={sdgUserProgress.percentage} />
                  </div>
                  <Button variant="secondary" className="w-full" disabled><CheckCircle className="w-4 h-4 mr-2" />Enrolled</Button>
                </>
              ) : (
                <Button onClick={handleEnroll} disabled={isEnrolling} className="w-full" size="lg">
                  {isEnrolling ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : null} Enroll Now
                </Button>
              )) : (
                <Button asChild className="w-full" size="lg">
                  <Link to="/login" state={{ from: location }}>Login to Enroll</Link>
                </Button>
              )}
            </CardContent>
          </Card>
          <Card>
              <CardHeader><CardTitle>What You'll Learn</CardTitle></CardHeader>
              <CardContent>
              {/* UPDATED: Replaced text-slate-600 with text-muted-foreground */}
                <ul className="space-y-3">
                  {sdg.whatYouWillLearn.map((point, index) => <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"/><span>{point}</span></li>)}
                </ul>
              </CardContent>
          </Card>
        </aside>
      </div>

      <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>Submit Activity: {currentActivityForSubmission?.title}</DialogTitle><DialogDescription>{currentActivityForSubmission?.description}</DialogDescription></DialogHeader>
          <div className="py-4"><div className="grid gap-4"><Label htmlFor="activity-response">Your Response</Label><Textarea id="activity-response" value={activityTextResponse} onChange={(e) => setActivityTextResponse(e.target.value)} rows={5} /></div></div>
          <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose><Button type="button" onClick={handleActivitySubmit} disabled={isSubmittingContent === currentActivityForSubmission?._id}>{isSubmittingContent && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Submit</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SdgDetailPage;