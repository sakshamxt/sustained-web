// src/pages/admin/news/AdminCreateNewsPage.jsx
import React, { useState } from 'react';
import apiClient from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import NewsForm from '@/components/admin/news/NewsForm';
import {toast} from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminCreateNewsPage = () => {
  const navigate = useNavigate(); 
  const [isLoading, setIsLoading] = useState(false);
  const handleCreateNews = async (formData) => {
    setIsLoading(true);
    try {
      await apiClient.post('/admin/news', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success("News article created successfully!");
      navigate('/admin/news');
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to create news article.');
    } finally { setIsLoading(false); }
  };
  return (
    <div>
      <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-6"><ArrowLeft className="w-4 h-4 mr-2" /> Back to News List</Button>
      <NewsForm onSubmit={handleCreateNews} isLoading={isLoading} submitButtonText="Publish News" />
    </div>
  );
};
export default AdminCreateNewsPage;