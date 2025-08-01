// File: components/dashboard/EditSchoolForm.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { School } from "@prisma/client";

import { useAppDispatch, useAppSelector } from '@/redux/store';
import { updateSchoolAsync } from '@/redux/schoolSlice';

interface EditSchoolFormProps {
  schoolData: School;
  onFormSubmitted: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "School name is required."),
  status: z.string().min(1, "Status is required."),
  npsn: z.string().min(1, "NPSN is required."),
  bentuk: z.string().min(1, "Bentuk is required."),
  telp: z.string().optional(),
  alamat: z.string().min(1, "Address is required."),
  kelurahan: z.string().min(1, "Kelurahan is required."),
  kecamatan: z.string().min(1, "Kecamatan is required."),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  achievements: z.string().optional(),
  contact: z.string().optional(),
  description: z.string().optional(),
  programs: z.string().optional(),
  website: z.string().url("Invalid URL format").optional().or(z.literal('')),
});

export default function EditSchoolForm({ schoolData, onFormSubmitted }: EditSchoolFormProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...schoolData,
      name: schoolData.name || "",
      status: schoolData.status || "",
      npsn: schoolData.npsn || "",
      bentuk: schoolData.bentuk || "",
      telp: schoolData.telp || "",
      alamat: schoolData.alamat || "",
      kelurahan: schoolData.kelurahan || "",
      kecamatan: schoolData.kecamatan || "",
      lat: schoolData.lat || null,
      lng: schoolData.lng || null,
      achievements: Array.isArray(schoolData.achievements) ? schoolData.achievements.join("\n") : (schoolData.achievements || ""),
      contact: schoolData.contact || "", // Ensure default is null if empty string
      description: schoolData.description || "",
      programs: Array.isArray(schoolData.programs) ? schoolData.programs.join("\n") : (schoolData.programs || ""),
      website: schoolData.website || "", // Ensure default is null if empty string
    },
  });

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.school);

  // ADD `useEffect` to reset the form when new `schoolData` is provided
  useEffect(() => {
    if (schoolData) {
      form.reset({
        ...schoolData,
        name: schoolData.name || "",
        status: schoolData.status || "",
        npsn: schoolData.npsn || "",
        bentuk: schoolData.bentuk || "",
        telp: schoolData.telp || "",
        alamat: schoolData.alamat || "",
        kelurahan: schoolData.kelurahan || "",
        kecamatan: schoolData.kecamatan || "",
        lat: schoolData.lat || null,
        lng: schoolData.lng || null,
        achievements: Array.isArray(schoolData.achievements) ? schoolData.achievements.join("\n") : (schoolData.achievements || ""),
        contact: schoolData.contact || "",
        description: schoolData.description || "",
        programs: Array.isArray(schoolData.programs) ? schoolData.programs.join("\n") : (schoolData.programs || ""),
        website: schoolData.website || "",
      });
    }
  }, [schoolData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const updatedData = { ...schoolData, ...values };

    // REPLACE: updateSchoolMutation with Redux thunk
    dispatch(updateSchoolAsync(updatedData))
      .unwrap()
      .then(() => {
        toast.success("School details updated successfully!");
        onFormSubmitted();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="px-6 pb-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <p className="text-sm text-gray-600 mt-1">Essential details about the school</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 mt-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2 mb-6"> {/* Added mb-6 */}
                    <FormLabel className="text-sm font-medium text-gray-700">School Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="mt-1" placeholder="Enter school name" />
                    </FormControl>
                    <FormMessage className="min-h-[20px] pt-1" /> {/* Added min-h and pt */}
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="npsn"
                render={({ field }) => (
                  <FormItem className="mb-6"> {/* Added mb-6 */}
                    <FormLabel className="text-sm font-medium text-gray-700">NPSN</FormLabel>
                    <FormControl>
                      <Input {...field} className="mt-1" placeholder="Enter NPSN" />
                    </FormControl>
                    <FormMessage className="min-h-[20px] pt-1" /> {/* Added min-h and pt */}
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="mb-6"> {/* Added mb-6 */}
                    <FormLabel className="text-sm font-medium text-gray-700">Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Negeri">Negeri</SelectItem>
                        <SelectItem value="Swasta">Swasta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="min-h-[20px] pt-1" /> {/* Added min-h and pt */}
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bentuk"
                render={({ field }) => (
                  <FormItem className="mb-6"> {/* Added mb-6 */}
                    <FormLabel className="text-sm font-medium text-gray-700">Bentuk</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue placeholder="Select bentuk" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SD">SD</SelectItem>
                        {/* <SelectItem value="SMP">SMP</SelectItem>
                        <SelectItem value="SMA">SMA</SelectItem>
                        <SelectItem value="SMK">SMK</SelectItem> */}
                      </SelectContent>
                    </Select>
                    <FormMessage className="min-h-[20px] pt-1" /> {/* Added min-h and pt */}
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="telp"
                render={({ field }) => (
                  <FormItem className="mb-6"> {/* Added mb-6 */}
                    <FormLabel className="text-sm font-medium text-gray-700">Telephone</FormLabel>
                    <FormControl>
                      <Input {...field} className="mt-1" placeholder="Enter phone number" />
                    </FormControl>
                    <FormMessage className="min-h-[20px] pt-1" /> {/* Added min-h and pt */}
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-6 mt-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              <p className="text-sm text-gray-600 mt-1">Contact details and online presence</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-3">
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem className="mb-6"> {/* Added mb-6 */}
                    <FormLabel className="text-sm font-medium text-gray-700">Contact Person</FormLabel>
                    <FormControl>
                      <Input {...field} className="mt-1" placeholder="Enter contact person name" />
                    </FormControl>
                    <FormMessage className="min-h-[20px] pt-1" /> {/* Added min-h and pt */}
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="mb-6"> {/* Added mb-6 */}
                    <FormLabel className="text-sm font-medium text-gray-700">Website</FormLabel>
                    <FormControl>
                      <Input {...field} className="mt-1" placeholder="https://www.example.com" />
                    </FormControl>
                    <FormMessage className="min-h-[20px] pt-1" /> {/* Added min-h and pt */}
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Location Information Section */}
          <div className="space-y-6 mt-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
              <p className="text-sm text-gray-600 mt-1">Address and geographical details</p>
            </div>
            
            <div className="space-y-6"> {/* This space-y-6 will handle vertical spacing between the address textarea and the grid below */}
              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem className="mb-6"> {/* Added mb-6 */}
                    <FormLabel className="text-sm font-medium text-gray-700">Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="mt-1" rows={2} placeholder="Enter complete address" />
                    </FormControl>
                    <FormMessage className="min-h-[20px] pt-1" /> {/* Added min-h and pt */}
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6"> {/* Changed gap-6 to gap-x-6 */}
                <FormField
                  control={form.control}
                  name="kelurahan"
                  render={({ field }) => (
                    <FormItem className="mb-6"> {/* Added mb-6 */}
                      <FormLabel className="text-sm font-medium text-gray-700">Kelurahan</FormLabel>
                      <FormControl>
                        <Input {...field} className="mt-1" placeholder="Enter kelurahan" />
                      </FormControl>
                      <FormMessage className="min-h-[20px] pt-1" /> {/* Added min-h and pt */}
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="kecamatan"
                  render={({ field }) => (
                    <FormItem className="mb-6"> {/* Added mb-6 */}
                      <FormLabel className="text-sm font-medium text-gray-700">Kecamatan</FormLabel>
                      <FormControl>
                        <Input {...field} className="mt-1" placeholder="Enter kecamatan" />
                      </FormControl>
                      <FormMessage className="min-h-[20px] pt-1" /> {/* Added min-h and pt */}
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lat"
                  render={({ field }) => (
                    <FormItem className="mb-6"> {/* Added mb-6 */}
                      <FormLabel className="text-sm font-medium text-gray-700">Latitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="any" 
                          {...field}
                          className="mt-1"
                          placeholder="e.g., -6.200000"
                          value={field.value === null ? '' : field.value}
                          onChange={(e) => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage className="min-h-[20px] pt-1" /> {/* Added min-h and pt */}
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lng"
                  render={({ field }) => (
                    <FormItem className="mb-6"> {/* Added mb-6 */}
                      <FormLabel className="text-sm font-medium text-gray-700">Longitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="any" 
                          {...field}
                          className="mt-1"
                          placeholder="e.g., 106.816666"
                          value={field.value === null ? '' : field.value}
                          onChange={(e) => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage className="min-h-[20px] pt-1" /> {/* Added min-h and pt */}
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* School Details Section */}
          <div className="space-y-6 mt-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900">School Details</h3>
              <p className="text-sm text-gray-600 mt-1">Additional information about the school</p>
            </div>
            
            <div className="space-y-6 mt-3" > {/* This space-y-6 will handle vertical spacing between the description textarea and the grid below */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-6"> {/* Added mb-6 */}
                    <FormLabel className="text-sm font-medium text-gray-700">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="mt-1" 
                        rows={6} 
                        placeholder="Provide a detailed description of the school..."
                      />
                    </FormControl>
                    <FormMessage className="min-h-[20px] pt-1" /> {/* Added min-h and pt */}
                  </FormItem>
                )}
              />
              
              {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6"> */}
                <FormField
                  control={form.control}
                  name="programs"
                  render={({ field }) => (
                    <FormItem className="mb-6"> {/* Added mb-6 */}
                      <FormLabel className="text-sm font-medium text-gray-700">Programs Offered</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="mt-1" 
                          rows={6} 
                          placeholder="List each program this school offers"
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage className="min-h-[20px] pt-1" /> {/* Added min-h and pt */}
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="achievements"
                  render={({ field }) => (
                    <FormItem className="mb-6"> {/* Added mb-6 */}
                      <FormLabel className="text-sm font-medium text-gray-700">Achievements</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="mt-1" 
                          rows={6} 
                          placeholder="List each achievement this school has"
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage className="min-h-[100px] pt-1" /> {/* Added min-h and pt */}
                    </FormItem>
                  )}
                />
              </div>
            </div>
          {/* </div> */}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onFormSubmitted}
              className="text-gray-700 hover:bg-gray-50 border-gray-300 transition-colors mr-4"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
