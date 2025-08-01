// File: components/dashboard/UserForm.tsx
// CORRECTED: New form for creating and editing users

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/redux/store";
import {
  createUserAsync,
  updateUserAsync,
  UserWithSchool,
} from "@/redux/userSlice";
import { School } from "@prisma/client";
import { toast } from "sonner";

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string(),
    password: z.string().optional(),
    role: z.enum(["USER", "SCHOOL_ADMIN", "SUPERADMIN"]),
    assignedSchoolId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "SCHOOL_ADMIN") return !!data.assignedSchoolId;
      return true;
    },
    {
      message: "A school must be assigned for a SCHOOL_ADMIN.",
      path: ["assignedSchoolId"],
    }
  );

interface UserFormProps {
  currentUser: UserWithSchool | null;
  schools: School[];
  onFinished: () => void;
}

export default function UserForm({
  currentUser,
  schools,
  onFinished,
}: UserFormProps) {
  const dispatch = useAppDispatch();
  const isEditMode = !!currentUser;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      password: "",
      role: currentUser?.role === "SCHOOL_ADMIN" ? "SCHOOL_ADMIN" : "USER",
      assignedSchoolId: currentUser?.assignedSchoolId?.toString() || undefined,
    },
  });

  const selectedRole = form.watch("role");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditMode) {
        const updateData: any = { ...values };
        if (!values.password) delete updateData.password;
        await dispatch(
          updateUserAsync({ id: currentUser.id, ...updateData })
        ).unwrap();
        toast.success("User updated successfully!");
      } else {
        if (!values.password) {
          form.setError("password", {
            type: "manual",
            message: "Password is required for new users.",
          });
          return;
        }
        await dispatch(createUserAsync(values)).unwrap();
        toast.success("User created successfully!");
      }
      onFinished();
    } catch (error: any) {
      toast.error(`Operation failed: ${error}`);
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="John Doe" 
                    {...field} 
                    className="bg-white/80 border-slate-300 rounded-xl py-3 px-4 text-slate-900 placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all duration-200"
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">Email Address</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="user@example.com" 
                    {...field} 
                    className="bg-white/80 border-slate-300 rounded-xl py-3 px-4 text-slate-900 placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all duration-200"
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={
                      isEditMode
                        ? "Leave blank to keep current password"
                        : "Enter a secure password"
                    }
                    {...field}
                    className="bg-white/80 border-slate-300 rounded-xl py-3 px-4 text-slate-900 placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all duration-200"
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">User Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/80 border-slate-300 rounded-xl py-3 px-4 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all duration-200">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-xl">
                    <SelectItem value="USER" className="text-slate-700 hover:bg-slate-100 rounded-lg">
                      <div className="flex flex-col">
                        <span className="font-medium">USER</span>
                        <span className="text-sm text-slate-500">Parent or student account</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="SCHOOL_ADMIN" className="text-slate-700 hover:bg-slate-100 rounded-lg">
                      <div className="flex flex-col">
                        <span className="font-medium">SCHOOL_ADMIN</span>
                        <span className="text-sm text-slate-500">School administrator account</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="SUPERADMIN" className="text-slate-700 hover:bg-slate-100 rounded-lg">
                      <div className="flex flex-col">
                        <span className="font-medium">SUPERADMIN</span>
                        <span className="text-sm text-slate-500">System administrator</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          {selectedRole === "SCHOOL_ADMIN" && (
            <FormField
              control={form.control}
              name="assignedSchoolId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Assign to School</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/80 border-slate-300 rounded-xl py-3 px-4 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all duration-200">
                        <SelectValue placeholder="Select a school to assign" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-xl max-h-60">
                      {schools.map((school) => (
                        <SelectItem 
                          key={school.id} 
                          value={school.id.toString()}
                          className="text-slate-700 hover:bg-slate-100 rounded-lg p-3"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{school.name}</span>
                            <span className="text-sm text-slate-500">{school.kelurahan}, {school.kecamatan}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-slate-800 hover:bg-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl py-3 px-6 font-semibold"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  {isEditMode ? 'Save Changes' : 'Create User'}
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onFinished}
              className="flex-1 border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 rounded-xl py-3 px-6 font-semibold transition-all duration-200"
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}