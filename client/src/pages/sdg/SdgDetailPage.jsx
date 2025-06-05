// src/pages/sdg/SdgDetailPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'; // Added useLocation
import apiClient from '@/lib/api';
import useAuthStore from '@/store/authStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Info, BookOpen, ListChecks, Edit, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress"; // For SDG progress bar

const SdgDetailPage = () => {
  const { idOrNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // For login redirect state
  const { isAuthenticated, user, fetchUserProfile, setUser, isLoading: authLoading } = useAuthStore();

  const [sdg, setSdg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isSubmittingContent, setIsSubmittingContent] = useState(null); // Tracks contentId being submitted

  // For activity submission dialog
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [currentActivityForSubmission, setCurrentActivityForSubmission] = useState(null);
  const [activityTextResponse, setActivityTextResponse] = useState("");

  // Memoize user's progress for the current SDG
  const sdgUserProgress = useMemo(() => {
    if (!user || !sdg || !user.progressBySdg || !user.progressBySdg[sdg._id]) {
      return { completedItems: [], percentage: 0 };
    }
    return user.progressBySdg[sdg._id];
  }, [user, sdg]);

  const fetchSdgDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/sdgs/${idOrNumber}`);
      setSdg(response.data.sdg || response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch SDG details.');
    } finally {
      setIsLoading(false);
    }
  }, [idOrNumber]);

  useEffect(() => {
    fetchSdgDetail();
  }, [fetchSdgDetail]);

  // Fetch user profile if not fully loaded (e.g. for progress data)
  useEffect(() => {
    if (isAuthenticated && user && !user.progressBySdg) {
       fetchUserProfile(); // To get progress data
    }
  }, [isAuthenticated, user, fetchUserProfile]);


  const isEnrolled = useMemo(() => {
    if (!isAuthenticated || !user || !user.enrolledCourses || !sdg) return false;
    return user.enrolledCourses.some(courseId => courseId === sdg._id);
  }, [isAuthenticated, user, sdg]);

  const handleEnroll = async () => {
    // ... (same as before) ...
    if (!isAuthenticated) {
      toast.error("You must be logged in to enroll in an SDG course.");
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!sdg || !sdg._id) return;

    setIsEnrolling(true);
    try {
      await apiClient.post(`/sdgs/${sdg._id}/enroll`);
      toast.success("Successfully enrolled in the SDG course!");
      await fetchUserProfile(); // Refresh user profile for enrollment status and progress data
    } catch (err) {
      toast.error("Failed to enroll in the SDG course. " + (err.response?.data?.message || err.message));
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleMarkAsComplete = async (contentType, contentId, submissionData = null) => {
    if (!sdg || !sdg._id) return;
    setIsSubmittingContent(contentId); // Set loading for specific item

    const requestBody = submissionData ? { submissionData } : {};

    try {
      const response = await apiClient.post(`/progress/${sdg._id}/complete/${contentType}/${contentId}`, requestBody);
      const { progressPercentage, awardedPoints, currentStreak, newTotalPoints } = response.data;

      toast.success(`Marked ${contentType} as complete! You earned ${awardedPoints} points. Current streak: ${currentStreak} days.`);

      // Update user store and local SDG progress state
     await fetchUserProfile(true);

      // Close submission dialog if it was open
      if (contentType === 'activity' && isSubmissionDialogOpen) {
        setIsSubmissionDialogOpen(false);
        setActivityTextResponse("");
      }

    } catch (err) {
      toast.error("Failed to mark as complete. " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmittingContent(null); // Clear loading for specific item
    }
  };

  const openSubmissionDialog = (activity) => {
    setCurrentActivityForSubmission(activity);
    setActivityTextResponse(""); // Reset previous response
    setIsSubmissionDialogOpen(true);
  };

  const handleActivitySubmit = () => {
    if (!currentActivityForSubmission) return;
    // Basic validation for text response
    if (currentActivityForSubmission.submissionType === 'textResponse' && !activityTextResponse.trim()) {
        toast.error("Please enter a response before submitting.");
        return;
    }
    const submissionData = { textResponse: activityTextResponse };
    handleMarkAsComplete('activity', currentActivityForSubmission._id, submissionData);
  };


  // Loading and error states
  if (isLoading || (isAuthenticated && authLoading && !user && !sdg)) return <LoadingSpinner size="lg" />;
  if (error) return <div className="container py-8 mx-auto text-center"><Alert variant="destructive"><Info className="w-4 h-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert></div>;
  if (!sdg) return <div className="py-10 text-center text-muted-foreground">SDG not found.</div>;

  // Assuming content items have an `_id` field.
  const renderContentItem = (item, type) => {
    const isCompleted = sdgUserProgress.completedItems.includes(item._id);
    const isSubmittingThis = isSubmittingContent === item._id;

    return (
      <div key={item._id} className="flex items-center justify-between p-3 transition-colors border rounded-md hover:bg-muted/30">
        <span className="text-sm">{item.title}</span>
        {isCompleted ? (
          <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-4 h-4 mr-1" />Completed</Badge>
        ) : (
          item.requiresSubmission ? ( // Assuming activities have 'requiresSubmission' and 'submissionType' fields
            <Button size="sm" variant="outline" onClick={() => openSubmissionDialog(item)} disabled={isSubmittingThis || !isEnrolled}>
              {isSubmittingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit className="w-4 h-4 mr-1" />} Submit
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => handleMarkAsComplete(type, item._id)} disabled={isSubmittingThis || !isEnrolled}>
              {isSubmittingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1" />} Mark Complete
            </Button>
          )
        )}
      </div>
    );
  };

  // Use sdg.presentations etc. These should be arrays from your API.
  const presentations = sdg.presentations || [];
  const lessons = sdg.lessons || [];
  const activities = sdg.practicalActivities || [];


  return (
    <div className="container py-8 mx-auto">
      {/* ... (SDG Header and Enroll button - same as before) ... */}
      <Card className="mb-8 overflow-hidden">
        {sdg.imageUrl && <img src={sdg.imageUrl} alt={sdg.title} className="object-cover w-full h-64 md:h-96" />}
        <CardHeader className="border-b">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <Badge className="mb-2 text-sm bg-brand-accent text-accent-foreground">SDG {sdg.sdgNumber}</Badge>
              <CardTitle className="text-3xl font-bold md:text-4xl text-primary">{sdg.title}</CardTitle>
              {sdg.shortDescription && <CardDescription className="mt-1 text-lg">{sdg.shortDescription}</CardDescription>}
            </div>
            <div className="flex-shrink-0">
              {isAuthenticated ? (isEnrolled ? (
                <Button variant="default" disabled className="bg-green-600 hover:bg-green-700"><CheckCircle className="w-5 h-5 mr-2" />Enrolled</Button>
              ) : (
                <Button onClick={handleEnroll} disabled={isEnrolling} className="bg-brand-accent hover:bg-brand-accent-hover text-accent-foreground" size="lg">
                  {isEnrolling ? <Loader2 className="w-4 h-4 mr-1 animate-spin"/> : null} Enroll Now
                </Button>
              )) : (
                <Button asChild className="bg-brand-accent hover:bg-brand-accent-hover text-accent-foreground" size="lg">
                  <Link to="/login" state={{ from: location }}>Login to Enroll</Link>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div><h3 className="mb-3 text-2xl font-semibold text-primary">About this Goal</h3>{Array.isArray(sdg.descriptions) ? sdg.descriptions.map((desc, index) => (<p key={index} className="mb-3 leading-relaxed text-muted-foreground">{desc}</p>)) : <p className="leading-relaxed text-muted-foreground">{sdg.descriptions}</p>}</div>
          {sdg.whatYouWillLearn && sdg.whatYouWillLearn.length > 0 && (<div><h3 className="mb-3 text-2xl font-semibold text-primary">What You Will Learn</h3><ul className="pl-2 space-y-1 list-disc list-inside text-muted-foreground">{sdg.whatYouWillLearn.map((point, index) => <li key={index}>{point}</li>)}</ul></div>)}
        </CardContent>
      </Card>

      {isEnrolled && (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={sdgUserProgress.percentage} className="w-full h-3" />
              <p className="mt-2 text-sm text-right text-muted-foreground">{sdgUserProgress.percentage}% Complete</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="lessons" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-muted/50">
              <TabsTrigger value="presentations"><BookOpen className="inline-block w-4 h-4 mr-2"/>Presentations ({presentations.length})</TabsTrigger>
              <TabsTrigger value="lessons"><ListChecks className="inline-block w-4 h-4 mr-2"/>Lessons ({lessons.length})</TabsTrigger>
              <TabsTrigger value="activities"><Edit className="inline-block w-4 h-4 mr-2"/>Activities ({activities.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="presentations" className="py-4">
              <Card><CardHeader><CardTitle>Presentations</CardTitle></CardHeader><CardContent className="space-y-2">
                {presentations.length > 0 ? presentations.map(p => renderContentItem(p, 'presentation')) : <p className="text-sm text-muted-foreground">No presentations available.</p>}
              </CardContent></Card>
            </TabsContent>
            <TabsContent value="lessons" className="py-4">
              <Card><CardHeader><CardTitle>Lessons</CardTitle></CardHeader><CardContent className="space-y-2">
                {lessons.length > 0 ? lessons.map(l => renderContentItem(l, 'lesson')) : <p className="text-sm text-muted-foreground">No lessons available.</p>}
              </CardContent></Card>
            </TabsContent>
            <TabsContent value="activities" className="py-4">
              <Card><CardHeader><CardTitle>Practical Activities</CardTitle></CardHeader><CardContent className="space-y-2">
                {activities.length > 0 ? activities.map(a => renderContentItem(a, 'activity')) : <p className="text-sm text-muted-foreground">No activities available.</p>}
              </CardContent></Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Dialog for Activity Submission */}
      <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Submit Activity: {currentActivityForSubmission?.title}</DialogTitle>
            <DialogDescription>
              {currentActivityForSubmission?.description || "Complete the required task for this activity."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentActivityForSubmission?.submissionType === 'textResponse' && ( // Check if submission type is textResponse
              <div className="grid gap-4">
                <Label htmlFor="activity-text-response">Your Response</Label>
                <Textarea
                  id="activity-text-response"
                  value={activityTextResponse}
                  onChange={(e) => setActivityTextResponse(e.target.value)}
                  placeholder="Type your response here..."
                  rows={5}
                />
              </div>
            )}
            {/* Add other submission types here if needed, e.g., file upload */}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmittingContent === currentActivityForSubmission?._id}>Cancel</Button></DialogClose>
            <Button type="button" onClick={handleActivitySubmit} disabled={isSubmittingContent === currentActivityForSubmission?._id}>
              {isSubmittingContent === currentActivityForSubmission?._id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Submit Completion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default SdgDetailPage;