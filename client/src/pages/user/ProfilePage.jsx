// src/pages/user/ProfilePage.jsx - FIXED

import React, { useEffect, useState, useMemo } from 'react';
import useAuthStore from '@/store/authStore';
import apiClient from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Edit3, ImagePlus, Trash2, Loader2, Star, Zap, User, MapPin, Mail, LogOut } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, isAuthenticated, fetchUserProfile, setUser, logoutUser, isLoading: authLoading } = useAuthStore();
  const [allSdgs, setAllSdgs] = useState([]);
 
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [removeProfilePicFlag, setRemoveProfilePicFlag] = useState(false);

  useEffect(() => {
    const fetchAllSdgs = async () => {
      try {
        const response = await apiClient.get('/sdgs');
        const sdgData = response.data?.sdgs || response.data || [];
        if (Array.isArray(sdgData)) setAllSdgs(sdgData);
      } catch (error) {
        console.error("Could not fetch SDG list for profile page", error);
      }
    };
    fetchAllSdgs();
  }, []);

  const getInitials = (name) => {
    if (!name) return '??';
    const names = name.split(' ');
    return (names[0][0] + (names.length > 1 ? names[names.length - 1][0] : '')).toUpperCase();
  };

  useEffect(() => {
    if (user) {
      setEditFormData({
        username: user.username || '', email: user.email || '',
        city: user.city || '', state: user.state || '', country: user.country || '',
      });
      setProfilePicturePreview(user.profilePictureUrl || null);
      setProfilePictureFile(null); setRemoveProfilePicFlag(false);
    }
  }, [user, isEditDialogOpen]);

  useEffect(() => {
    if (isAuthenticated && (!user || !user.points)) { fetchUserProfile(); }
  }, [isAuthenticated, user, fetchUserProfile]);

  const handleEditFormChange = (e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
      setRemoveProfilePicFlag(false);
    }
  };
  const handleRequestRemoveProfilePicture = () => {
    setProfilePictureFile(null);
    setProfilePicturePreview(null);
    setRemoveProfilePicFlag(true);
  };
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    const formDataToSubmit = new FormData();
    // Use a different name for the remove flag for FormData
    const { removeProfilePicFlag: _flag, ...otherData } = editFormData;
    Object.keys(otherData).forEach(key => formDataToSubmit.append(key, otherData[key] || ''));

    if (profilePictureFile) {
      formDataToSubmit.append('profilePicture', profilePictureFile);
    } else if (removeProfilePicFlag) {
      // A common pattern is to send a specific field to indicate removal
      formDataToSubmit.append('removeProfilePicture', 'true');
    }
    try {
      const response = await apiClient.put('/users/me/profile', formDataToSubmit, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser(response.data.user || response.data);
      toast.success("Profile updated successfully!");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const enrolledCoursesWithDetails = useMemo(() => {
    if (!user?.enrolledCourses || allSdgs.length === 0) return [];
    return user.enrolledCourses.map(courseId => {
      const sdgDetail = allSdgs.find(s => s._id === courseId);
      const progress = user.progressBySdg?.[courseId]?.progressPercentage || 0;
      return { ...sdgDetail, progress };
    }).filter(course => course._id);
  }, [user, allSdgs]);

  if (authLoading && !user) return <LoadingSpinner size="lg" />;
  if (!user) return <div className="py-10 text-center">Could not load user profile.</div>;

  return (
    <div className="container py-8 mx-auto">
      <header className="py-12 mb-12 text-center border-b">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">Your Profile</h1>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-slate-600">Manage your account details, track your progress, and view your achievements.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        <aside className="lg:col-span-1 space-y-8 lg:sticky top-24 h-fit">
            <Card className="text-center">
                <CardContent className="p-8">
                    <Avatar className="w-28 h-28 mx-auto ring-4 ring-primary/20 ring-offset-background ring-offset-2">
                      <AvatarImage src={user.profilePictureUrl || undefined} alt={user.username} />
                      <AvatarFallback className="text-4xl">{getInitials(user.username)}</AvatarFallback>
                    </Avatar>
                    <h2 className="mt-4 text-2xl font-bold text-slate-900">{user.username}</h2>
                    <p className="text-sm text-slate-500">{user.email}</p>
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full mt-4"><Edit3 className="w-4 h-4 mr-2" />Edit Profile</Button>
                      </DialogTrigger>
                      {/* --- FIX: The complete Edit Profile form is now correctly placed inside the Dialog --- */}
                      <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleProfileUpdate} className="py-4 space-y-4">
                          <div className="flex flex-col items-center space-y-3">
                            <Avatar className="h-28 w-28"><AvatarImage src={profilePicturePreview || undefined} alt="Profile Preview" /><AvatarFallback className="text-4xl">{getInitials(editFormData.username)}</AvatarFallback></Avatar>
                            <div className="flex space-x-2">
                              <Button type="button" size="sm" variant="outline" onClick={() => document.getElementById('profilePictureInput')?.click()}><ImagePlus className="w-4 h-4 mr-2" /> Change Photo</Button>
                              <Input id="profilePictureInput" type="file" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
                              {(profilePicturePreview || user.profilePictureUrl) && !removeProfilePicFlag && (<Button type="button" size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={handleRequestRemoveProfilePicture}><Trash2 className="w-4 h-4 mr-2" /> Remove</Button>)}
                              {removeProfilePicFlag && <p className="text-xs text-destructive self-center">Photo will be removed.</p>}
                            </div>
                          </div>
                          <div><Label htmlFor="edit-username">Username</Label><Input id="edit-username" name="username" value={editFormData.username || ''} onChange={handleEditFormChange} /></div>
                          <div><Label htmlFor="edit-email">Email</Label><Input id="edit-email" name="email" type="email" value={editFormData.email || ''} onChange={handleEditFormChange} /></div>
                          <div><Label htmlFor="edit-city">City</Label><Input id="edit-city" name="city" value={editFormData.city || ''} onChange={handleEditFormChange} /></div>
                          <div><Label htmlFor="edit-state">State</Label><Input id="edit-state" name="state" value={editFormData.state || ''} onChange={handleEditFormChange} /></div>
                          <div><Label htmlFor="edit-country">Country</Label><Input id="edit-country" name="country" value={editFormData.country || ''} onChange={handleEditFormChange} /></div>
                          <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="outline" disabled={isUpdatingProfile}>Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isUpdatingProfile}>{isUpdatingProfile && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Changes</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
            <Card><CardHeader><CardTitle>Your Stats</CardTitle></CardHeader><CardContent className="space-y-6"><div className="flex items-start gap-4"><Star className="w-8 h-8 text-amber-500 mt-1"/><div className="flex flex-col"><p className="text-sm text-slate-500">Points</p><p className="text-3xl font-bold text-primary">{user.points?.toLocaleString() ?? 0}</p></div></div><div className="flex items-start gap-4"><Zap className="w-8 h-8 text-red-500 mt-1"/><div className="flex flex-col"><p className="text-sm text-slate-500">Current Streak</p><p className="text-3xl font-bold text-primary">{user.streak ?? 0} days</p></div></div></CardContent></Card>
            <Card><CardHeader><CardTitle>Account</CardTitle></CardHeader><CardContent><Button variant="outline" className="w-full" onClick={logoutUser}><LogOut className="w-4 h-4 mr-2"/>Log Out</Button></CardContent></Card>
        </aside>

        <main className="lg:col-span-2 space-y-8">
            <Card><CardHeader><CardTitle>Personal Information</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="flex items-start gap-3"><Mail className="w-5 h-5 text-slate-400 mt-1"/><div className="flex flex-col"><p className="text-sm text-slate-500">Email</p><p>{user.email}</p></div></div><div className="flex items-start gap-3"><User className="w-5 h-5 text-slate-400 mt-1"/><div className="flex flex-col"><p className="text-sm text-slate-500">Username</p><p>{user.username}</p></div></div><div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-slate-400 mt-1"/><div className="flex flex-col"><p className="text-sm text-slate-500">City</p><p>{user.city || 'Not set'}</p></div></div><div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-slate-400 mt-1"/><div className="flex flex-col"><p className="text-sm text-slate-500">State</p><p>{user.state || 'Not set'}</p></div></div></CardContent></Card>
            <Card>
                <CardHeader><CardTitle>Your Enrolled Courses</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {enrolledCoursesWithDetails.length > 0 ? (
                    enrolledCoursesWithDetails.map(course => (
                      <div key={course._id} className="space-y-2">
                        <div className="flex justify-between items-center"><p className="font-semibold">{course.sdgNumber}. {course.title}</p><p className="text-sm font-medium text-primary">{Math.round(course.progress)}%</p></div>
                        <Progress value={course.progress} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">You haven't enrolled in any courses yet. <Link to="/sdgs" className="text-primary hover:underline">Explore courses</Link> to get started!</p>
                  )}
                </CardContent>
            </Card>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;