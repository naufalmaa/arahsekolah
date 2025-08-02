// File: components/dashboard/UpdateProfileForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
});

type UserProfile = {
  id: string;
  name: string;
  email: string;
};

export default function UpdateProfileForm({ user }: { user: UserProfile }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  });

  async function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    setLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      toast.success("Profile updated successfully!");
      // Refresh the page to show the new data from the server session
      router.refresh();

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} disabled />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-slate-500 pt-1">Email cannot be changed.</p>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="bg-slate-800 hover:bg-slate-900">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}