// src/pages/admin/AdminUserManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { toast } from 'sonner'
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Users, ShieldAlert, ShieldCheck, Trash2, Eye, UserX, UserCheck } from 'lucide-react'; // Icons
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(''); // 'ban', 'unban', 'makeAdmin', 'revokeAdmin'
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/admin/users');
      setUsers(response.data.users || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch users.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleActionConfirm = async () => {
    if (!selectedUser || !actionType) return;
    setIsActionLoading(true);
    let endpoint = '';
    let payload = {};
    let successMessage = '';

    switch (actionType) {
      case 'ban':
        endpoint = `/admin/users/${selectedUser._id}/banstatus`;
        payload = { isBanned: true };
        successMessage = `User ${selectedUser.username} has been banned.`;
        break;
      case 'unban':
        endpoint = `/admin/users/${selectedUser._id}/banstatus`;
        payload = { isBanned: false };
        successMessage = `User ${selectedUser.username} has been unbanned.`;
        break;
      case 'makeAdmin':
        endpoint = `/admin/users/${selectedUser._id}/adminstatus`;
        payload = { isAdmin: true };
        successMessage = `User ${selectedUser.username} is now an admin.`;
        break;
      case 'revokeAdmin':
        endpoint = `/admin/users/${selectedUser._id}/adminstatus`;
        payload = { isAdmin: false };
        successMessage = `User ${selectedUser.username} is no longer an admin.`;
        break;
      default:
        setIsActionLoading(false);
        return;
    }

    try {
      await apiClient.put(endpoint, payload);
      toast.success(successMessage);
      fetchUsers(); // Re-fetch users to update the table
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to perform action.');
    } finally {
      setIsActionLoading(false);
      setSelectedUser(null);
      setActionType('');
    }
  };

  const openConfirmationDialog = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
  };

  const getConfirmationDialogContent = () => {
    if (!selectedUser) return { title: '', description: ''};
    switch(actionType) {
        case 'ban': return { title: `Ban ${selectedUser.username}?`, description: `Are you sure you want to ban ${selectedUser.username}? They will not be able to log in.` };
        case 'unban': return { title: `Unban ${selectedUser.username}?`, description: `Are you sure you want to unban ${selectedUser.username}? They will regain access.` };
        case 'makeAdmin': return { title: `Make ${selectedUser.username} Admin?`, description: `Are you sure you want to grant admin privileges to ${selectedUser.username}?` };
        case 'revokeAdmin': return { title: `Revoke Admin from ${selectedUser.username}?`, description: `Are you sure you want to revoke admin privileges from ${selectedUser.username}?` };
        default: return { title: '', description: ''};
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <p className="text-destructive">Error: {error}</p>;

  const dialogContent = getConfirmationDialogContent();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center text-3xl font-bold text-primary">
            <Users className="w-8 h-8 mr-3 text-brand-accent"/> User Management
        </h1>
        {/* <Button>Add New User (Not Implemented)</Button> */}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage all registered users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>{users.length > 0 ? `A list of all users.` : `No users found.`}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Points</TableHead>
                <TableHead className="text-center">Admin</TableHead>
                <TableHead className="text-center">Banned</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-center">{user.points ?? 0}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={user.isAdmin}
                      onCheckedChange={() => openConfirmationDialog(user, user.isAdmin ? 'revokeAdmin' : 'makeAdmin')}
                      aria-label="Toggle Admin Status"
                      disabled={isActionLoading && selectedUser?._id === user._id}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={user.isBanned}
                      onCheckedChange={() => openConfirmationDialog(user, user.isBanned ? 'unban' : 'ban')}
                      aria-label="Toggle Ban Status"
                      className="data-[state=checked]:bg-destructive"
                      disabled={isActionLoading && selectedUser?._id === user._id}
                    />
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    {/* <Button variant="ghost" size="icon" title="View Details (Not Implemented)">
                      <Eye className="w-4 h-4" />
                    </Button> */}
                     {user.isBanned ? (
                        <Button variant="outline" size="sm" onClick={() => openConfirmationDialog(user, 'unban')} disabled={isActionLoading && selectedUser?._id === user._id} title="Unban User">
                            <UserCheck className="w-4 h-4"/>
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:border-destructive" onClick={() => openConfirmationDialog(user, 'ban')} disabled={isActionLoading && selectedUser?._id === user._id} title="Ban User">
                            <UserX className="w-4 h-4"/>
                        </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedUser && !!actionType} onOpenChange={(isOpen) => { if (!isOpen) { setSelectedUser(null); setActionType(''); }}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedUser(null); setActionType(''); }} disabled={isActionLoading}>Cancel</Button>
            <Button 
                onClick={handleActionConfirm} 
                disabled={isActionLoading}
                variant={actionType.includes('ban') || actionType.includes('revoke') ? 'destructive' : 'default'}
            >
              {isActionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagementPage;