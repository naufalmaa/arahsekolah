// File: components/dashboard/DeleteUserConfirmation.tsx
// CORRECTED: New component for user deletion confirmation dialog

'use client';

import { Button } from "@/components/ui/button";
import { DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useAppDispatch } from "@/redux/store";
import { deleteUserAsync, UserWithSchool } from "@/redux/userSlice";
import { toast } from "sonner";
import { useState } from "react";

interface DeleteUserConfirmationProps {
    user: UserWithSchool | null;
    onCancel: () => void;
    onFinished: () => void;
}

export default function DeleteUserConfirmation({ user, onCancel, onFinished }: DeleteUserConfirmationProps) {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            await dispatch(deleteUserAsync(user.id)).unwrap();
            toast.success(`User "${user.name}" has been deleted.`);
            onFinished();
        } catch (error: unknown) {
            toast.error(`Deletion failed: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div>
            <DialogDescription className="text-lg py-4">
                Are you sure you want to delete the user account for <span className="font-semibold text-gray-800">{user.name}</span>? This action cannot be undone.
            </DialogDescription>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                    {isLoading ? 'Deleting...' : 'Confirm Delete'}
                </Button>
            </DialogFooter>
        </div>
    );
}