// src/components/admin/store/RedemptionOptionForm.jsx
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from 'lucide-react';

const RedemptionOptionForm = ({ initialData, onSubmit, isLoading, submitButtonText = "Save" }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pointsRequired: 0,
    stock: 0,
    imageUrl: '',
    isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      // If editing, populate form with existing data
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        pointsRequired: initialData.pointsRequired || 0,
        stock: initialData.stock === Infinity ? 'Infinity' : (initialData.stock ?? 0),
        imageUrl: initialData.imageUrl || '',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
    } else {
      // If creating, use default empty state
      setFormData({ title: '', description: '', pointsRequired: 0, stock: 0, imageUrl: '', isActive: true });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSwitchChange = (checked) => {
      setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare data for submission, handling "Infinity" for stock
    const submissionData = {
      ...formData,
      stock: formData.stock === 'Infinity' ? 'Infinity' : Number(formData.stock),
      pointsRequired: Number(formData.pointsRequired)
    };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="py-4 space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pointsRequired">Points Required</Label>
          <Input id="pointsRequired" name="pointsRequired" type="number" min="0" value={formData.pointsRequired} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" name="stock" type="text" value={formData.stock} onChange={handleChange} placeholder="e.g., 100 or 'Infinity'" required />
        </div>
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
      </div>
      <div className="flex items-center pt-2 space-x-2">
        <Switch id="isActive" name="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
        <Label htmlFor="isActive">Item is Active</Label>
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default RedemptionOptionForm;