// src/pages/admin/news/AdminNewsManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Newspaper, PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const AdminNewsManagementPage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchNews = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.get('/community/news'); // Using public endpoint
      setNewsItems(response.data.news || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch news.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const handleDeleteNews = async () => {
    if (!newsToDelete) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/admin/news/${newsToDelete._id}`);
      toast.success(`News "${newsToDelete.title}" deleted successfully.`);
      setNewsToDelete(null);
      fetchNews();
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete news.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <p className="text-destructive">Error: {error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center text-3xl font-bold text-primary"><Newspaper className="w-8 h-8 mr-3 text-brand-accent" /> News Management</h1>
        <Button asChild><Link to="/admin/news/new"><PlusCircle className="w-4 h-4 mr-2" /> Create News Article</Link></Button>
      </div>
      <Table>
        <TableCaption>{newsItems.length > 0 ? "A list of all news articles." : "No news articles found."}</TableCaption>
        <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {newsItems.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{item.postedByAdmin?.username || 'Admin'}</TableCell>
              <TableCell>{item.createdAt ? format(new Date(item.createdAt), 'PPpp') : '-'}</TableCell>
              <TableCell className="space-x-2 text-right">
                <Button variant="outline" size="sm" asChild><Link to={`/admin/news/edit/${item._id}`}><Edit className="w-4 h-4 mr-1" />Edit</Link></Button>
                <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => setNewsToDelete(item)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />Delete
                </Button>  
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!newsToDelete} onOpenChange={(isOpen) => !isOpen && setNewsToDelete(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle><DialogDescription>Delete news: "{newsToDelete?.title}"?</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewsToDelete(null)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteNews} disabled={isDeleting}>{isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AdminNewsManagementPage;