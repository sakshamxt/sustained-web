// src/pages/sdg/SdgDetailPage.jsx

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
import { CheckCircle, Info, BookOpen, ListChecks, Edit, Loader2, ExternalLink, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";


const SdgDetailPage = () => {
  // --- STATE AND HOOKS ---
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

  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState({ id: null, message: '', type: '' });

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
  
  useEffect(() => {
    if (isAuthenticated && (!user || !user.progressBySdg)) {
      fetchUserProfile(true);
    }
  }, [isAuthenticated, user, fetchUserProfile]);

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
      await fetchUserProfile(true); 
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

  const handleQuizSubmit = (item) => {
    if (!selectedQuizOption) {
      toast.error("Please select an answer.");
      return;
    }
    
    const selectedOption = item.quiz?.options.find(opt => opt.text === selectedQuizOption);
    if (!selectedOption) {
      toast.error("An error occurred. Please refresh.");
      return;
    }
    
    if (selectedOption.isCorrect) {
      setQuizFeedback({ id: item._id, message: `Correct! ${item.quiz.explanation}`, type: 'success' });
      handleMarkAsComplete('activity', item._id);
    } else {
      setQuizFeedback({ id: item._id, message: `Not quite. ${item.quiz.explanation || 'Try again!'}`, type: 'destructive' });
    }
    setSelectedQuizOption(null);
  };
  
  const EnrollmentPrompt = () => (
    <div className="text-center p-12 rounded-lg bg-secondary border-dashed">
      <Lock className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold text-foreground">Content Locked</h3>
      <p className="text-muted-foreground mt-2 mb-4">You must enroll in this course to access the lessons, activities, and presentations.</p>
      <Button onClick={handleEnroll} disabled={isEnrolling} size="lg">
        {isEnrolling ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : null} Enroll Now
      </Button>
    </div>
  );

  const renderContentItem = (item, type) => {
    const isCompleted = sdgUserProgress.completedItems.has(item._id);
    const isSubmittingThis = isSubmittingContent === item._id;
    const requiresSubmission = type === 'activity' && item.submissionType === 'textResponse';
    const isQuiz = type === 'activity' && item.submissionType === 'quiz';

    if (type === 'lesson') {
      return (
        <AccordionItem value={item._id} key={item._id}>
          <AccordionTrigger disabled={!isEnrolled} className="hover:no-underline">
            <div className="flex items-center justify-between w-full pr-4">
              <span className="text-left font-medium text-foreground">{item.title}</span>
              {isCompleted && (
                <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 dark:bg-green-900/20 ml-2">
                  <CheckCircle className="w-4 h-4 mr-1" />Completed
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert">
              {item.content && item.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            {!isCompleted && (
              <Button 
                size="sm" 
                className="mt-4" 
                onClick={() => handleMarkAsComplete(type, item._id)} 
                disabled={isSubmittingThis || !isEnrolled}
              >
                {isSubmittingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                Mark Lesson Complete
              </Button>
            )}
          </AccordionContent>
        </AccordionItem>
      );
    }

    if (type === 'presentation') {
      return (
        <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 transition-colors border rounded-lg hover:bg-secondary/50">
          <span className="text-sm font-medium text-foreground mb-3 sm:mb-0">{item.title}</span>
          <div className="flex items-center gap-3 self-end sm:self-center">
            <Button asChild size="sm" variant="outline" disabled={!isEnrolled}><a href={item.urlOrContent} target="_blank" rel="noopener noreferrer">View <ExternalLink className="w-4 h-4 ml-2" /></a></Button>
            {isCompleted ? (
              <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 dark:bg-green-900/20"><CheckCircle className="w-4 h-4 mr-1" />Completed</Badge>
            ) : (
              <Button size="sm" onClick={() => handleMarkAsComplete(type, item._id)} disabled={isSubmittingThis || !isEnrolled}>{isSubmittingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />} Mark Complete</Button>
            )}
          </div>
        </div>
      );
    }

    // Standard Activity (Quiz or Text)
    return (
      <div key={item._id} className="p-5 transition-colors border rounded-lg hover:bg-secondary/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
          {isCompleted && (
            <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 dark:bg-green-900/20"><CheckCircle className="w-4 h-4 mr-1" />Completed</Badge>
          )}
        </div>
        
        {type === 'activity' && item.description && !isQuiz && (<p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>)}

        {isQuiz && !isCompleted && (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">{item.description}</p>
            {item.quiz?.question ? (
              <div className="p-4 border rounded-md bg-card">
                <p className="font-medium text-foreground mb-3">{item.quiz.question}</p>
                <RadioGroup onValueChange={setSelectedQuizOption} value={selectedQuizOption}>
                  {item.quiz.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt.text} id={`${item._id}-opt-${idx}`} />
                      <Label htmlFor={`${item._id}-opt-${idx}`} className="text-sm cursor-pointer">{opt.text}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="mt-4">
                  <Button size="sm" onClick={() => handleQuizSubmit(item)} disabled={!isEnrolled || isSubmittingThis || !selectedQuizOption}>
                    {isSubmittingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Answer"}
                  </Button>
                </div>
                {quizFeedback.id === item._id && (
                  <Alert variant={quizFeedback.type} className="mt-3">
                    <AlertDescription>{quizFeedback.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <p className="text-sm text-destructive">Quiz data is missing for this activity.</p>
            )}
          </div>
        )}

        {requiresSubmission && !isCompleted && (
          <Button size="sm" className="mt-4" onClick={() => openSubmissionDialog(item)} disabled={isSubmittingThis || !isEnrolled}>
            {isSubmittingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit className="w-4 h-4 mr-2" />} Submit Reflection
          </Button>
        )}
        
        {type === 'activity' && !requiresSubmission && !isQuiz && !isCompleted && (
           <Button size="sm" className="mt-4" onClick={() => handleMarkAsComplete(type, item._id)} disabled={isSubmittingThis || !isEnrolled}>
            {isSubmittingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />} Mark Complete
          </Button>
        )}

      </div>
    );
  };
  
  // --- RENDER LOGIC ---
  if (isLoading || (isAuthenticated && authLoading && !user)) return <LoadingSpinner size="lg" />;
  if (error) return ( <div className="container py-8 mx-auto text-center"><Alert variant="destructive"><Info className="w-4 h-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert></div>);
  if (!sdg) return <div className="py-10 text-center text-muted-foreground">SDG not found.</div>;
  
  const presentations = sdg.presentations || [];
  const lessons = sdg.lessons || [];
  const activities = sdg.practicalActivities || [];
  const descriptions = sdg.fullDescription ? sdg.fullDescription.split('\n') : (Array.isArray(sdg.descriptions) ? sdg.descriptions : [sdg.descriptions]);
  const whatYouWillLearn = sdg.whatYouWillLearn || [];

   return (
    <div className="container py-8 mx-auto">
      <header 
        className="py-12 mb-12 text-center border-b opacity-0 animate-fade-in-up"
        style={{ animationFillMode: 'forwards' }}
      >
        <Badge className="mb-4" variant="secondary">{`SDG ${sdg.sdgNumber}`}</Badge>
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
              <TabsList className="grid w-full grid-cols-4 p-0 bg-transparent border-b rounded-none">
                  <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"><BookOpen className="w-4 h-4 mr-2" />About</TabsTrigger>
                  <TabsTrigger value="lessons" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"><ListChecks className="w-4 h-4 mr-2" />Lessons ({lessons.length})</TabsTrigger>
                  <TabsTrigger value="activities" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"><Edit className="w-4 h-4 mr-2" />Activities ({activities.length})</TabsTrigger>
                     <TabsTrigger value="presentations" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Presentations ({presentations.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="p-6 prose prose-lg max-w-none text-muted-foreground dark:prose-invert">
                {descriptions.map((p, i) => p && <p key={i}>{p}</p>)}
               </TabsContent>
              
              <TabsContent value="lessons" className="p-6">
                {isEnrolled ? (
                  lessons.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {lessons.map(l => renderContentItem(l, 'lesson'))}
                    </Accordion>
                  ) : (
                    <div className="py-12 text-center"><Info className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3"/><p className="text-muted-foreground">No lessons available for this course yet.</p></div>
                  )
                ) : (
                  <EnrollmentPrompt />
                )}
              </TabsContent>

              <TabsContent value="activities" className="p-6 space-y-4">
                {isEnrolled ? (
                  activities.length > 0 ? activities.map(a => renderContentItem(a, 'activity')) : <div className="py-12 text-center"><Info className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3"/><p className="text-muted-foreground">No activities available for this course yet.</p></div>
                ) : (
                  <EnrollmentPrompt />
                )}
              </TabsContent>
              <TabsContent value="presentations" className="p-6 space-y-4">
                {isEnrolled ? (
                  presentations.length > 0 ? presentations.map(p => renderContentItem(p, 'presentation')) : <div className="py-12 text-center"><Info className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3"/><p className="text-muted-foreground">No presentations available for this course yet.</p></div>
                ) : (
                  <EnrollmentPrompt />
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </main>

        <aside 
          className="lg:col-span-1 lg:sticky top-24 h-fit space-y-8 opacity-0 animate-fade-in-up animation-delay-500"
          style={{ animationFillMode: 'forwards' }}
        >
          <Card className="shadow-md border-primary/20">
            <CardHeader><CardTitle>Course Status</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {isAuthenticated ? (isEnrolled ? (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-2"><Label>Your Progress</Label><span className="font-bold text-primary">{Math.round(sdgUserProgress.percentage)}%</span></div>
                    <Progress value={sdgUserProgress.percentage} className="h-2" />
                  </div>
                  <Button variant="secondary" className="w-full font-semibold" disabled><CheckCircle className="w-5 h-5 mr-2 text-green-600" />Enrolled</Button>
                </>
              ) : (
                <Button onClick={handleEnroll} disabled={isEnrolling} className="w-full text-lg py-6" size="lg">
                  {isEnrolling ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : null} Enroll Now
                </Button>
            )) : (
                <Button asChild className="w-full text-lg py-6" size="lg">
                 <Link to="/login" state={{ from: location }}>Login to Enroll</Link>
                </Button>
              )}
            </CardContent>
        </Card>
        <Card>
              <CardHeader><CardTitle>What You'll Learn</CardTitle></CardHeader>
              <CardContent>
                  <ul className="space-y-4">
                  {whatYouWillLearn.map((point, index) => <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground"><CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"/><span>{point}</span></li>)}
               </ul>
              </CardContent>
          </Card>
        </aside>
      </div>

      <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
       <DialogContent><DialogHeader><DialogTitle>Submit Activity: {currentActivityForSubmission?.title}</DialogTitle><DialogDescription>{currentActivityForSubmission?.description}</DialogDescription></DialogHeader>
            <div className="py-4"><div className="grid gap-4"><Label htmlFor="activity-response">Your Response</Label><Textarea id="activity-response" value={activityTextResponse} onChange={(e) => setActivityTextResponse(e.target.value)} rows={5} placeholder="Type your reflection here..." /></div></div>
         <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose><Button type="button" onClick={handleActivitySubmit} disabled={isSubmittingContent === currentActivityForSubmission?._id}>{isSubmittingContent && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Submit</Button></DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
};

export default SdgDetailPage;