// src/pages/user/ProfilePage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import useAuthStore from '@/store/authStore';
import apiClient from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Edit3, UserX, ImagePlus, Trash2, Loader2 } from 'lucide-react'; // Icons

const ProfilePage = () => {
  const { user, isAuthenticated, fetchUserProfile, setUser, isLoading: authLoading } = useAuthStore();
 

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [removeProfilePicFlag, setRemoveProfilePicFlag] = useState(false);

  const getInitials = (name) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  // Initialize form when user data is available or dialog opens
  useEffect(() => {
    if (user) {
      setEditFormData({
        username: user.username || '',
        email: user.email || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
      });
      setProfilePicturePreview(user.profilePictureUrl || null);
      setProfilePictureFile(null); // Reset file input
      setRemoveProfilePicFlag(false); // Reset flag
    }
  }, [user, isEditDialogOpen]); // Re-initialize if dialog opens with new user data

  useEffect(() => {
    if (isAuthenticated && (!user || !user.points)) {
      fetchUserProfile();
    }
  }, [isAuthenticated, user, fetchUserProfile]);

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
      setRemoveProfilePicFlag(false); // If new file is chosen, don't remove
    }
  };

  const handleRequestRemoveProfilePicture = () => {
    setProfilePictureFile(null); // Clear any selected file
    setProfilePicturePreview(null); // Clear preview
    setRemoveProfilePicFlag(true); // Set flag to remove
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('username', editFormData.username);
    formDataToSubmit.append('email', editFormData.email);
    formDataToSubmit.append('city', editFormData.city || '');
    formDataToSubmit.append('state', editFormData.state || '');
    formDataToSubmit.append('country', editFormData.country || '');

    if (profilePictureFile) {
      formDataToSubmit.append('profilePicture', profilePictureFile);
    } else if (removeProfilePicFlag) {
      // As per spec: "send profilePictureUrl: "" to remove if no new file"
      // This is unusual for FormData with files, typically backend handles absence of file or a flag.
      // We'll send it as a field. Backend needs to interpret this alongside other fields.
      formDataToSubmit.append('profilePictureUrl', "");
    }
    // If neither new file nor remove flag, picture is not changed by this request.

    try {
      const response = await apiClient.put('/users/me/profile', formDataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Assuming backend returns the updated user object
      setUser(response.data.user || response.data); // Update user in auth store
      toast.success("Profile updated successfully!");
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Profile update error:", error.response?.data || error.message);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (authLoading && !user) return <div className="py-10 text-center"><Loader2 className="w-8 h-8 mx-auto animate-spin" /> Loading profile...</div>;
  if (!user) return <div className="py-10 text-center">Could not load user profile.</div>;

  const profileItems = [
    { label: "Email", value: user.email },
    { label: "City", value: user.city || "Not set" },
    { label: "State", value: user.state || "Not set" },
    { label: "Country", value: user.country || "Not set" },
  ];

  return (
    <div className="container px-4 py-8 mx-auto md:px-0">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="border-b">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <Avatar className="w-24 h-24 ring-2 ring-primary ring-offset-background ring-offset-2">
              <AvatarImage src={user.profilePictureUrl || undefined} alt={user.username} />
              <AvatarFallback className="text-3xl bg-muted text-muted-foreground">
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-3xl font-bold text-primary">{user.username}</CardTitle>
              <CardDescription className="text-muted-foreground">Manage your personal account details.</CardDescription>
            </div>
            <div className="pt-4 sm:ml-auto sm:pt-0">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm"><Edit3 className="w-4 h-4 mr-2" />Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleProfileUpdate} className="py-4 space-y-4">
                    <div className="flex flex-col items-center space-y-3">
                      <Avatar className="h-28 w-28">
                        <AvatarImage src={profilePicturePreview || undefined} alt="Profile Preview" />
                        <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
                          {getInitials(editFormData.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex space-x-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => document.getElementById('profilePictureInput')?.click()}>
                          <ImagePlus className="w-4 h-4 mr-2" /> Change Photo
                        </Button>
                        <Input id="profilePictureInput" type="file" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
                        {(profilePicturePreview || user.profilePictureUrl) && !removeProfilePicFlag && (
                           <Button type="button" size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={handleRequestRemoveProfilePicture}>
                              <Trash2 className="w-4 h-4 mr-2" /> Remove
                           </Button>
                        )}
                        {removeProfilePicFlag && <p className="text-xs text-destructive">Photo will be removed on save.</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="edit-username">Username</Label>
                      <Input id="edit-username" name="username" value={editFormData.username || ''} onChange={handleEditFormChange} />
                    </div>
                    <div>
                      <Label htmlFor="edit-email">Email</Label>
                      <Input id="edit-email" name="email" type="email" value={editFormData.email || ''} onChange={handleEditFormChange} />
                    </div>
                    <div>
                      <Label htmlFor="edit-city">City</Label>
                      <Input id="edit-city" name="city" value={editFormData.city || ''} onChange={handleEditFormChange} />
                    </div>
                    <div>
                      <Label htmlFor="edit-state">State</Label>
                      <Input id="edit-state" name="state" value={editFormData.state || ''} onChange={handleEditFormChange} />
                    </div>
                    <div>
                      <Label htmlFor="edit-country">Country</Label>
                      <Input id="edit-country" name="country" value={editFormData.country || ''} onChange={handleEditFormChange} />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isUpdatingProfile}>Cancel</Button>
                      </DialogClose>
                      <Button type="submit" disabled={isUpdatingProfile}>
                        {isUpdatingProfile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {profileItems.map(item => (
              <div key={item.label} className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                <span className="text-lg font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="pt-6 space-y-4 border-t">
            <h3 className="mb-2 text-lg font-semibold text-primary">Stats</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-lg bg-muted/50"><p className="text-sm text-muted-foreground">Points</p><p className="text-2xl font-bold text-brand-accent">{user.points ?? 0}</p></div>
              <div className="p-4 rounded-lg bg-muted/50"><p className="text-sm text-muted-foreground">Current Streak</p><p className="text-2xl font-bold text-brand-accent">{user.streak ?? 0} days</p></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;