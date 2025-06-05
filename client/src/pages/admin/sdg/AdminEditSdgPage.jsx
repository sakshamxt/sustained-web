// src/pages/admin/sdg/AdminEditSdgPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api';
import { useNavigate, useParams } from 'react-router-dom';
import SdgForm from '@/components/admin/sdg/SdgForm'; // Reusable form
import { toast } from 'sonner'
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';


const AdminEditSdgPage = () => {
  const { sdgId } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading for fetch
  const [isUpdating, setIsUpdating] = useState(false); // Loading for update

  const fetchSdg = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/sdgs/${sdgId}`); // Use public GET for details
      setInitialData(response.data.sdg || response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch SDG details.");
        navigate('/admin/sdgs');
    } finally {
      setIsLoading(false);
    }
  }, [sdgId, toast, navigate]);

  useEffect(() => {
    fetchSdg();
  }, [fetchSdg]);

  const handleUpdateSdg = async (formData) => { // formData is FormData from SdgForm
    setIsUpdating(true);
    try {
      await apiClient.put(`/admin/sdgs/${sdgId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success("SDG updated successfully.");
      navigate('/admin/sdgs');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update SDG.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !initialData) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to SDG List
      </Button>
      <SdgForm
        initialData={initialData}
        onSubmit={handleUpdateSdg}
        isLoading={isUpdating}
        submitButtonText="Update SDG"
      />
    </div>
  );
};

export default AdminEditSdgPage;