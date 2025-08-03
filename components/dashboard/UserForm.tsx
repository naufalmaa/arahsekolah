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
import { School } from '@/lib/types'
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

// Infer the type from the Zod schema
type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  currentUser: UserWithSchool | null;
  schools: School[];
  onFinished: () => void;
}

function isErrorMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string" // Cast to { message: unknown } here is safe
  );
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

  const onSubmit = async (values: UserFormValues) => {
    try {
      if (isEditMode) {
        // Define a type for the update payload based on what updateUserAsync expects
        // This assumes updateUserAsync takes a Partial<UserFormValues> plus an id
        // We use Omit to exclude 'password' from the base UserFormValues, then manually add it if needed.
        // This is a more precise type than just Partial<UserFormValues>
        type UpdatePayload = Omit<
          Partial<UserFormValues>,
          "password" | "assignedSchoolId"
        > & {
          id: string;
          password?: string; // Add password back as optional for the payload
          assignedSchoolId?: number | null; // Correct type for assignedSchoolId
        };

        const updateData: UpdatePayload = {
          id: currentUser!.id, // currentUser is guaranteed to exist in edit mode
          name: values.name,
          email: values.email,
          role: values.role,
          // Convert assignedSchoolId to number or null for Prisma
          assignedSchoolId:
            values.role === "SCHOOL_ADMIN" && values.assignedSchoolId
              ? Number(values.assignedSchoolId)
              : null,
        };

        // Only include password if it's provided and not an empty string
        if (values.password && values.password !== "") {
          updateData.password = values.password;
        }

        await dispatch(updateUserAsync(updateData)).unwrap();
        toast.success("User updated successfully!");
      } else {
        // For creation, password is required by schema, but double-check here.
        // The schema's .optional() and .or(z.literal("")) might need adjustment
        // if you strictly require password for new users.
        // For new users, if the password field is optional in Zod, it needs to be made required here.
        // A better approach is to have different schemas for create and update.

        // Given your current code, you're handling it manually with setError:
        if (!values.password || values.password === "") {
          form.setError("password", {
            type: "manual",
            message: "Password is required for new users.",
          });
          return;
        }

        // Prepare data for creation, converting assignedSchoolId
        // The `values` from the form are already `UserFormValues`.
        // We need to transform `assignedSchoolId` to a number or null.
        const createData = {
          ...values,
          assignedSchoolId:
            values.role === "SCHOOL_ADMIN" && values.assignedSchoolId
              ? Number(values.assignedSchoolId)
              : null,
        };

        await dispatch(createUserAsync(createData)).unwrap();
        toast.success("User created successfully!");
      }
      onFinished();
    } catch (error: unknown) {
      let errorMessage = "Operation failed: An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = `Operation failed: ${error.message}`;
      } else if (typeof error === "string") {
        errorMessage = `Operation failed: ${error}`;
      } else if (isErrorMessage(error)) {
        // Use the custom type guard here
        errorMessage = `Operation failed: ${error.message}`;
      } else {
        // Fallback for truly unexpected error types
        errorMessage =
          "Operation failed: An unexpected error occurred. Please try again.";
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">
                  Full Name
                </FormLabel>
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
                            <FormItem className="mt-4">

                <FormLabel className="text-slate-700 font-semibold">
                  Email Address
                </FormLabel>
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
                            <FormItem className="mt-4">

                <FormLabel className="text-slate-700 font-semibold">
                  Password
                </FormLabel>
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
              <FormItem className="mt-4">
                <FormLabel className="text-slate-700 font-semibold">
                  User Role
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white/80 border-slate-300 rounded-xl py-3 px-4 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all duration-200 p-6 w-full justify-evenly">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-xl">
                    <SelectItem
                      value="USER"
                      className="text-slate-700 hover:bg-slate-100 rounded-lg p-2"
                    >
                      <div className="flex flex-col p-2">
                        <span className="font-medium">USER</span>
                        <span className="text-sm text-slate-500">
                          Parent or student account
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="SCHOOL_ADMIN"
                      className="text-slate-700 hover:bg-slate-100 rounded-lg p-2"
                    >
                      <div className="flex flex-col p-2">
                        <span className="font-medium">SCHOOL_ADMIN</span>
                        <span className="text-sm text-slate-500">
                          School administrator account
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="SUPERADMIN"
                      className="text-slate-700 hover:bg-slate-100 rounded-lg p-2"
                    >
                      <div className="flex flex-col p-2">
                        <span className="font-medium">SUPERADMIN</span>
                        <span className="text-sm text-slate-500">
                          System administrator
                        </span>
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
                              <FormItem className="mt-4">

                  <FormLabel className="text-slate-700 font-semibold">
                    Assign to School
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/80 border-slate-300 rounded-xl py-3 px-4 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all duration-200 p-6 w-full justify-evenly">
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
                            <span className="text-sm text-slate-500">
                              {school.kelurahan}, {school.kecamatan}
                            </span>
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
                  {isEditMode ? "Save Changes" : "Create User"}
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
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
