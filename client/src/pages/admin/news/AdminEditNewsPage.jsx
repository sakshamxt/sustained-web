// src/pages/admin/news/AdminEditNewsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api';
import { useNavigate, useParams } from 'react-router-dom';
import NewsForm from '@/components/admin/news/NewsForm';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminEditNewsPage = () => {
  const { newsId } = useParams(); 
  const navigate = useNavigate(); 
  const [initialData, setInitialData] = useState(null); const [isLoading, setIsLoading] = useState(true); const [isUpdating, setIsUpdating] = useState(false);

  const fetchNewsItem = useCallback(async () => {
    setIsLoading(true);
    try {
      // Assuming /api/community/news/:id fetches a single news item for editing
      const response = await apiClient.get(`/community/news/${newsId}`); 
      setInitialData(response.data.newsArticle || response.data); // Adjust based on your API
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch news details.");
        navigate('/admin/news');
    } finally { setIsLoading(false); }
  }, [newsId, toast, navigate]);

  useEffect(() => { fetchNewsItem(); }, [fetchNewsItem]);

  const handleUpdateNews = async (formData) => {
    setIsUpdating(true);
    try {
      await apiClient.put(`/admin/news/${newsId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success("News article updated successfully!");
      navigate('/admin/news');
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update news article.');
    } finally { setIsUpdating(false); }
  };

  if (isLoading || !initialData) return <LoadingSpinner size="lg" />;
  return (
    <div>
      <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-6"><ArrowLeft className="w-4 h-4 mr-2" /> Back to News List</Button>
      <NewsForm initialData={initialData} onSubmit={handleUpdateNews} isLoading={isUpdating} submitButtonText="Update News" />
    </div>
  );
};
export default AdminEditNewsPage;