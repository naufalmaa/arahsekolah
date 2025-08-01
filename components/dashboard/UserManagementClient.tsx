// File: components/dashboard/UserManagementClient.tsx
// CORRECTED: New client component for the user management page

'use client';

import React, { useMemo } from 'react';
import { useAppSelector } from '@/redux/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, ShieldCheck } from 'lucide-react';
import UserTable from './UserTable';
import { School as SchoolType } from '@prisma/client';

interface UserManagementClientProps {
    schools: SchoolType[];
}

export default function UserManagementClient({ schools }: UserManagementClientProps) {
    const { users, loading, error } = useAppSelector((state) => state.user);
    
    const userCounts = useMemo(() => {
        const schoolAdmins = users.filter(u => u.role === 'SCHOOL_ADMIN').length;
        const regularUsers = users.filter(u => u.role === 'USER').length;
        return { schoolAdmins, regularUsers };
    }, [users]);
    
    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <Card className="group bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-lg font-semibold text-slate-900">School Admins</CardTitle>
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <ShieldCheck className="h-6 w-6 text-slate-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 mb-2">
                            {loading ? '...' : userCounts.schoolAdmins}
                        </div>
                        <p className="text-slate-600">Accounts assigned to schools</p>
                    </CardContent>
                </Card>
                
                <Card className="group bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-lg font-semibold text-slate-900">Regular Users</CardTitle>
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <User className="h-6 w-6 text-slate-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 mb-2">
                            {loading ? '...' : userCounts.regularUsers}
                        </div>
                        <p className="text-slate-600">Parent and student accounts</p>
                    </CardContent>
                </Card>
                
                <Card className="group bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-lg font-semibold text-slate-900">Total Users</CardTitle>
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 mb-2">
                            {loading ? '...' : users.length}
                        </div>
                        <p className="text-slate-600">Active system accounts</p>
                    </CardContent>
                </Card>
            </div>
            
            {/* User Table Card */}
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-xl">
                <CardHeader className="p-8 pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900">User Account Management</CardTitle>
                    <CardDescription className="text-lg text-slate-600">
                        View, create, and manage user accounts in the system. Assign roles and school permissions as needed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                            <p className="text-red-700 font-medium">Error: {error}</p>
                        </div>
                    )}
                    <UserTable users={users} loading={loading} schools={schools} />
                </CardContent>
            </Card>
        </div>
    );
}