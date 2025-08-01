// lib/schemas.ts
import { z } from 'zod';

// Utility schema for ID parameter parsing
export const IdParamSchema = z.object({
  id: z.string().refine(val => !isNaN(parseInt(val, 10)), {
    message: "ID must be a valid number string",
  }).transform(val => parseInt(val, 10)),
});

// Zod schema for a Review rating (1-5)
export const RatingSchema = z.number().int().min(1).max(5, "Rating must be between 1 and 5.");

// Zod schema for Review creation payload
// This is what the client sends to POST /api/reviews
export const CreateReviewSchema = z.object({
  schoolId: z.number().int("School ID must be an integer.").min(1, "School ID is required."),
  name: z.string().min(1, "Name is required.").optional().nullable(),
  role: z.string().min(1, "Role is required."), // e.g., "Parent", "Student", "Alumni"
  biaya: z.string().min(1, "Cost is required."),
  komentar: z.string().min(1, "Comment is required."),
  kenyamanan: RatingSchema,
  pembelajaran: RatingSchema,
  fasilitas: RatingSchema,
  kepemimpinan: RatingSchema,
});

// Zod schema for Review update payload
// This is what the client sends to PUT /api/reviews/[id]
export const UpdateReviewSchema = CreateReviewSchema.partial().extend({
  // An update might not include all fields, so we make them optional,
  // but ensure `schoolId` is not allowed here since it doesn't change on update.
  schoolId: z.never().optional(), // Ensure schoolId cannot be updated via this endpoint
});

// Zod schema for School update payload
// This is what the client sends to PUT /api/schools/[id]
// It should match the formSchema in EditSchoolForm.tsx
export const UpdateSchoolSchema = z.object({
  name: z.string().min(1, "School name is required."),
  status: z.string().min(1, "Status is required."),
  npsn: z.string().min(1, "NPSN is required."),
  bentuk: z.string().min(1, "Bentuk is required."),
  telp: z.string().optional().nullable(),
  alamat: z.string().min(1, "Address is required."),
  kelurahan: z.string().min(1, "Kelurahan is required."),
  kecamatan: z.string().min(1, "Kecamatan is required."),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  achievements: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  programs: z.string().optional().nullable(),
  website: z.string().url("Invalid URL format").optional().or(z.literal('')) // Allow empty string for optional URL
});

// Optional: Schema for a full Review object (as returned by API)
// This extends the CreateReviewSchema with fields added by the server
export const ReviewResponseSchema = CreateReviewSchema.extend({
  id: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  userId: z.string().uuid(), // Assuming userId is a UUID
  user: z.object({ // Include user data for the review
    id: z.string().uuid(),
    name: z.string().nullable(),
    email: z.string().email(),
  }),
});

// Zod schema for School creation payload
// This is what the client sends to POST /api/schools
export const CreateSchoolSchema = z.object({
  name: z.string().min(1, "School name is required."),
  status: z.string().min(1, "Status is required."),
  npsn: z.string().min(1, "NPSN is required."),
  bentuk: z.string().min(1, "Bentuk is required."),
  telp: z.string().min(1, "Telpon is required."),
  alamat: z.string().min(1, "Address is required."),
  kelurahan: z.string().min(1, "Kelurahan is required."),
  kecamatan: z.string().min(1, "Kecamatan is required."),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  achievements: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  programs: z.string().optional().nullable(),
  website: z.string().url("Invalid URL format").optional().or(z.literal('')) // Allow empty string for optional URL
});

// Optional: Schema for a full School object (as returned by API)
// This extends the UpdateSchoolSchema with fields added by the server
export const SchoolResponseSchema = UpdateSchoolSchema.extend({
  id: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  avgRating: z.number().optional().nullable(), // For schools list/detail
  // Add other fields that might be returned by Prisma like _count etc.
  _count: z.object({
    reviews: z.number().int(),
  }).optional(),
});