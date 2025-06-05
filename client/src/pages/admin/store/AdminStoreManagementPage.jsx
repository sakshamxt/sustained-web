// src/pages/admin/store/AdminStoreManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Gift, PlusCircle, Edit, Trash2, Loader2, CheckCircle, XCircle } from 'lucide-react';
import RedemptionOptionForm from '@/components/admin/store/RedemptionOptionForm';

const AdminStoreManagementPage = () => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // For editing
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [optionToDelete, setOptionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOptions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/redemption/options'); // Fetching all for admin view
      setOptions(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch redemption options.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchOptions(); }, [fetchOptions]);

  const handleOpenCreate = () => {
    setSelectedOption(null); // Ensure no initial data for create form
    setIsFormOpen(true);
  };

  const handleOpenEdit = (option) => {
    setSelectedOption(option);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    const isEditing = !!selectedOption;
    const endpoint = isEditing ? `/admin/redemption/options/${selectedOption._id}` : '/admin/redemption/options';
    const method = isEditing ? 'put' : 'post';

    try {
      await apiClient[method](endpoint, formData);
      toast.success(isEditing ? "Option updated successfully!" : "New option created successfully!");
      setIsFormOpen(false);
      fetchOptions(); // Refresh list
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to save option.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteDialog = (option) => {
    setOptionToDelete(option);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!optionToDelete) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/admin/redemption/options/${optionToDelete._id}`);
      toast.success(`Option "${optionToDelete.title}" deleted successfully!`);
      setIsDeleteConfirmOpen(false);
      setOptionToDelete(null);
      fetchOptions();
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete option.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <p className="text-destructive">Error: {error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center text-3xl font-bold text-primary">
            <Gift className="w-8 h-8 mr-3 text-brand-accent"/> Store Management
        </h1>
        <Button onClick={handleOpenCreate}><PlusCircle className="w-4 h-4 mr-2" /> Create New Option</Button>
      </div>

      <Table>
        <TableCaption>{options.length > 0 ? "A list of all redemption options." : "No options found."}</TableCaption>
        <TableHeader><TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="text-center">Points</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-center">Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {options.map((option) => (
            <TableRow key={option._id}>
              <TableCell className="font-medium">{option.title}</TableCell>
              <TableCell className="text-center">{option.pointsRequired}</TableCell>
              <TableCell className="text-center">{option.stock === Infinity ? '∞' : option.stock}</TableCell>
              <TableCell className="text-center">
                {option.isActive ? <CheckCircle className="w-5 h-5 mx-auto text-green-500" /> : <XCircle className="w-5 h-5 mx-auto text-muted-foreground" />}
              </TableCell>
              <TableCell className="space-x-2 text-right">
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(option)}><Edit className="w-4 h-4 mr-1" />Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(option)}><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedOption ? 'Edit Option' : 'Create New Option'}</DialogTitle>
            <DialogDescription>
              {selectedOption ? `Editing "${selectedOption.title}"` : 'Add a new item available for redemption.'}
            </DialogDescription>
          </DialogHeader>
          <RedemptionOptionForm 
            initialData={selectedOption}
            onSubmit={handleFormSubmit}
            isLoading={isSubmitting}
            submitButtonText={selectedOption ? 'Update Option' : 'Create Option'}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the option: "{optionToDelete?.title}"? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStoreManagementPage;