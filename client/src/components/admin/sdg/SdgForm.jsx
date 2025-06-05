// src/components/admin/sdg/SdgForm.jsx
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // For image preview

const SdgForm = ({ initialData, onSubmit, isLoading, submitButtonText = "Submit" }) => {
  const [formData, setFormData] = useState({
    sdgNumber: '',
    title: '',
    shortDescription: '',
    descriptions: '', // Treat as single string, admin separates by newline
    whatYouWillLearn: '', // Treat as single string, admin separates by newline
    imageUrl: '', // For displaying existing image URL
    // No sdgImage field here, handle file separately
  });
  const [sdgImageFile, setSdgImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        sdgNumber: initialData.sdgNumber || '',
        title: initialData.title || '',
        shortDescription: initialData.shortDescription || '',
        // Join arrays into newline-separated strings for Textarea
        descriptions: Array.isArray(initialData.descriptions) ? initialData.descriptions.join('\n') : (initialData.descriptions || ''),
        whatYouWillLearn: Array.isArray(initialData.whatYouWillLearn) ? initialData.whatYouWillLearn.join('\n') : (initialData.whatYouWillLearn || ''),
        imageUrl: initialData.imageUrl || '',
      });
      setImagePreview(initialData.imageUrl || null);
      setSdgImageFile(null); // Reset file input on initialData change
    } else {
      // Reset form for create mode
      setFormData({ sdgNumber: '', title: '', shortDescription: '', descriptions: '', whatYouWillLearn: '', imageUrl: '' });
      setImagePreview(null);
      setSdgImageFile(null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSdgImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    submissionData.append('sdgNumber', formData.sdgNumber);
    submissionData.append('title', formData.title);
    submissionData.append('shortDescription', formData.shortDescription);
    // Split newline-separated strings back into arrays for backend
    submissionData.append('descriptions', JSON.stringify(formData.descriptions.split('\n').filter(line => line.trim() !== '')));
    submissionData.append('whatYouWillLearn', JSON.stringify(formData.whatYouWillLearn.split('\n').filter(line => line.trim() !== '')));
    
    if (sdgImageFile) {
      submissionData.append('sdgImage', sdgImageFile); // Backend expects 'sdgImage' for file
    } else if (initialData && initialData.imageUrl && !imagePreview) {
      // This logic handles image removal if preview is cleared but no new file selected.
      // Your backend needs to support a way to clear the image, e.g., by sending imageUrl: "" or a specific flag.
      // For now, if no new sdgImageFile, backend should keep the old one unless explicitly told to remove.
      // If you want to remove: submissionData.append('removeSdgImage', 'true');
    }
    // If initialData.imageUrl exists and sdgImageFile is null, backend should retain existing image.

    onSubmit(submissionData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Edit SDG" : "Create New SDG"}</CardTitle>
        <CardDescription>Fill in the details for the Sustainable Development Goal.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="sdgNumber">SDG Number</Label>
              <Input id="sdgNumber" name="sdgNumber" type="number" value={formData.sdgNumber} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <Label htmlFor="shortDescription">Short Description (for cards)</Label>
            <Textarea id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={3} />
          </div>
          <div>
            <Label htmlFor="descriptions">Detailed Descriptions (one per line)</Label>
            <Textarea id="descriptions" name="descriptions" value={formData.descriptions} onChange={handleChange} rows={5} />
          </div>
          <div>
            <Label htmlFor="whatYouWillLearn">What You Will Learn (one point per line)</Label>
            <Textarea id="whatYouWillLearn" name="whatYouWillLearn" value={formData.whatYouWillLearn} onChange={handleChange} rows={5} />
          </div>
          
          <div>
            <Label htmlFor="sdgImageFile">SDG Image</Label>
            {imagePreview && (
              <div className="my-2">
                <Avatar className="w-32 h-32 rounded-md">
                  <AvatarImage src={imagePreview} alt="SDG Image Preview" className="object-cover"/>
                  <AvatarFallback>Preview</AvatarFallback>
                </Avatar>
              </div>
            )}
            <Input id="sdgImageFile" name="sdgImageFile" type="file" accept="image/*" onChange={handleImageChange} />
            {initialData?.imageUrl && !sdgImageFile && (
                <p className="mt-1 text-xs text-muted-foreground">Current image will be kept if no new image is uploaded.</p>
            )}
             {initialData?.imageUrl && (
                 <Button type="button" variant="link" size="sm" className="h-auto p-0 text-destructive" onClick={() => {setImagePreview(null); setSdgImageFile(null); /* set flag for removal if needed */}}>Remove current image</Button>
             )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {submitButtonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SdgForm;