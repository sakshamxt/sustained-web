// src/components/admin/news/NewsForm.jsx
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NewsForm = ({ initialData, onSubmit, isLoading, submitButtonText = "Submit" }) => {
  const [formData, setFormData] = useState({ title: '', text: '', imageUrl: '' });
  const [newsImageFile, setNewsImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({ title: initialData.title || '', text: initialData.text || '', imageUrl: initialData.imageUrl || '' });
      setImagePreview(initialData.imageUrl || null);
      setNewsImageFile(null);
    } else {
      setFormData({ title: '', text: '', imageUrl: '' });
      setImagePreview(null);
      setNewsImageFile(null);
    }
  }, [initialData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setNewsImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    submissionData.append('title', formData.title);
    submissionData.append('text', formData.text);
    if (newsImageFile) {
      submissionData.append('newsImage', newsImageFile); // Backend expects 'newsImage'
    }
    // Handle image removal if preview is cleared (similar to SdgForm, needs backend support)
    onSubmit(submissionData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle>{initialData ? "Edit News Article" : "Create New Article"}</CardTitle><CardDescription>Fill in the article details.</CardDescription></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div><Label htmlFor="title">Title</Label><Input id="title" name="title" value={formData.title} onChange={handleChange} required /></div>
          <div><Label htmlFor="text">Text</Label><Textarea id="text" name="text" value={formData.text} onChange={handleChange} rows={10} required /></div>
          <div>
            <Label htmlFor="newsImageFile">News Image</Label>
            {imagePreview && (<div className="my-2"><Avatar className="w-auto h-32 rounded-md"><AvatarImage src={imagePreview} alt="News Preview" className="object-contain"/><AvatarFallback>Preview</AvatarFallback></Avatar></div>)}
            <Input id="newsImageFile" name="newsImageFile" type="file" accept="image/*" onChange={handleImageChange} />
            {initialData?.imageUrl && !newsImageFile && (<p className="mt-1 text-xs text-muted-foreground">Current image kept if no new one.</p>)}
            {initialData?.imageUrl && (<Button type="button" variant="link" size="sm" className="h-auto p-0 text-destructive" onClick={() => {setImagePreview(null); setNewsImageFile(null);}}>Remove current image</Button>)}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>{isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{submitButtonText}</Button>
        </form>
      </CardContent>
    </Card>
  );
};
export default NewsForm;