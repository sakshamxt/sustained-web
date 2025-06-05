// src/pages/admin/sdg/AdminCreateSdgPage.jsx
import React, { useState } from 'react';
import apiClient from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import SdgForm from '@/components/admin/sdg/SdgForm'; // Reusable form
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminCreateSdgPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSdg = async (formData) => { // formData is FormData from SdgForm
    setIsLoading(true);
    try {
      await apiClient.post('/admin/sdgs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success("SDG created successfully.");
      navigate('/admin/sdgs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create SDG.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to SDG List
      </Button>
      <SdgForm onSubmit={handleCreateSdg} isLoading={isLoading} submitButtonText="Create SDG" />
    </div>
  );
};

export default AdminCreateSdgPage;