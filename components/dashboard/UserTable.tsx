// File: components/dashboard/UserTable.tsx
// CORRECTED: New component for displaying and managing users in a table

'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UserWithSchool } from '@/redux/userSlice';
import { School } from '@/lib/types'
import { PlusCircle } from 'lucide-react';
import UserForm from './UserForm';
import DeleteUserConfirmation from './DeleteUserConfirmation';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Pencil1Icon, TrashIcon  } from "@radix-ui/react-icons";


interface UserTableProps {
  users: UserWithSchool[];
  loading: boolean;
  schools: School[];
}

export default function UserTable({ users, loading, schools }: UserTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithSchool | null>(null);

  const handleEdit = (user: UserWithSchool) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user: UserWithSchool) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };
  
  const closeForm = () => setIsFormOpen(false);
  const closeDeleteDialog = () => setIsDeleteOpen(false);

  return (
    <>
      {/* Add New User Button */}
      <div className="flex justify-end mb-6">
        <Button 
          onClick={handleAddNew}
          className="bg-slate-800 hover:bg-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-6 py-3 font-semibold"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> 
          Add New User
        </Button>
      </div>

      {/* Table Container */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg">
        <Table >
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-slate-50/50">
              <TableHead className="font-semibold text-slate-700 py-4 px-6">Name</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4 px-6">Email</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4 px-6">Role</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4 px-6">Assigned School</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4 px-6">Created At</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
                    <p className="text-slate-600 font-medium">Loading users...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-200">
                  <TableCell className="font-semibold text-slate-900 py-4 px-6">{user.name}</TableCell>
                  <TableCell className="text-slate-600 py-4 px-6">{user.email}</TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge 
                      variant={user.role === 'SUPERADMIN' ? 'default' : user.role === 'SCHOOL_ADMIN' ? 'secondary' : 'outline'}
                      className={
                        user.role === 'SUPERADMIN' 
                          ? 'bg-slate-800 hover:bg-slate-900 text-white' 
                          : user.role === 'SCHOOL_ADMIN'
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'border-slate-300 text-slate-600'
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 py-4 px-6">
                    {user.assignedSchool?.name || (
                      <span className="text-slate-400 italic">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-600 py-4 px-6">
                    {format(new Date(user.createdAt), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell className="text-right py-4 px-6">
                    {user.role !== 'SUPERADMIN' && (
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(user)} 
                          className="mr-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 rounded-lg px-3 py-1.5 font-medium transition-all duration-200"
                        >
                          <Pencil1Icon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(user)}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-1.5 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                        >
                        <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">No Users Found</h3>
                      <p className="text-slate-600">Start by creating your first user account.</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit/Create User Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl shadow-2xl">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-2xl font-bold text-slate-900">
              {selectedUser ? 'Edit User Account' : 'Create New User'}
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-base leading-relaxed">
              {selectedUser 
                ? "Update the user's details and permissions. Leave password blank to keep it unchanged." 
                : 'Create a new user account and assign appropriate role and permissions.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6">
            <UserForm currentUser={selectedUser} schools={schools} onFinished={closeForm} />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div>
            <DeleteUserConfirmation user={selectedUser} onCancel={closeDeleteDialog} onFinished={closeDeleteDialog}/>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}