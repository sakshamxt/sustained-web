// src/pages/admin/sdg/AdminSdgManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { BookOpen, PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';

const AdminSdgManagementPage = () => {
  const [sdgs, setSdgs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sdgToDelete, setSdgToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSdgs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/sdgs'); // Using public endpoint for listing for now
      setSdgs(response.data.sdgs || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch SDGs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSdgs();
  }, [fetchSdgs]);

  const handleDeleteSdg = async () => {
    if (!sdgToDelete) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/admin/sdgs/${sdgToDelete._id}`);
      toast.success(`SDG "${sdgToDelete.title}" deleted successfully.`);
      setSdgToDelete(null);
      fetchSdgs(); // Refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete SDG.');
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
          <BookOpen className="w-8 h-8 mr-3 text-brand-accent" /> SDG Management
        </h1>
        <Button asChild>
          <Link to="/admin/sdgs/new"><PlusCircle className="w-4 h-4 mr-2" /> Create New SDG</Link>
        </Button>
      </div>

      <Table>
        <TableCaption>{sdgs.length > 0 ? "A list of all SDGs." : "No SDGs found."}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Number</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Short Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sdgs.map((sdg) => (
            <TableRow key={sdg._id}>
              <TableCell className="font-medium">{sdg.sdgNumber}</TableCell>
              <TableCell>{sdg.title}</TableCell>
              <TableCell className="max-w-xs truncate">{sdg.shortDescription || (Array.isArray(sdg.descriptions) ? sdg.descriptions[0] : '-')}</TableCell>
              <TableCell className="space-x-2 text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/admin/sdgs/edit/${sdg._id}`}><Edit className="w-4 h-4 mr-1" />Edit</Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setSdgToDelete(sdg)}>
                  <Trash2 className="w-4 h-4 mr-1" />Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!sdgToDelete} onOpenChange={(isOpen) => !isOpen && setSdgToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the SDG: "{sdgToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSdgToDelete(null)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteSdg} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSdgManagementPage;