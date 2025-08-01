// lib/api.ts
import {
  CreateReviewSchema,
  UpdateReviewSchema,
  UpdateSchoolSchema,
  ReviewResponseSchema,
  SchoolResponseSchema,
} from './schemas';
import { z } from 'zod';

// Base API URL (can be an environment variable in a real app)
const API_BASE_URL = '/api';

// --- Generic API Utility Function ---
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  issues?: z.ZodIssue[]; // For Zod validation errors
}

async function apiCall<T>(
  url: string,
  method: string,
  body?: object,
  schema?: z.ZodSchema<T>
): Promise<ApiResponse<T>> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle server-side errors (e.g., 400, 404, 500)
      return {
        success: false,
        error: data.message || `API error: ${response.statusText}`,
        issues: data.issues || [], // Pass Zod issues from server if available
      };
    }

    // Client-side Zod validation
    if (schema) {
      const validationResult = schema.safeParse(data);
      if (!validationResult.success) {
        console.error('Client-side data validation failed:', validationResult.error.issues);
        return {
          success: false,
          error: 'Data received from server is invalid.',
          issues: validationResult.error.issues,
        };
      }
      return { success: true, data: validationResult.data };
    }

    return { success: true, data: data as T };
  } catch (error: unknown) { // Changed 'any' to 'unknown'
    console.error('Network or unexpected error:', error);
    // Type narrowing to safely access 'message' property
    let errorMessage = 'An unexpected error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
        // This handles cases where error is an object but not an instance of Error,
        // but still has a 'message' property.
        errorMessage = (error as any).message;
    }
    return { success: false, error: errorMessage };
  }
}

// --- School API Functions ---

export const getSchool = async (id: number) => {
  return apiCall<z.infer<typeof SchoolResponseSchema>>(
    `${API_BASE_URL}/schools/${id}`,
    'GET',
    undefined,
    SchoolResponseSchema
  );
};

export const updateSchool = async (id: number, schoolData: z.infer<typeof UpdateSchoolSchema>) => {
  // We'll validate the input data against the schema before sending.
  // This is redundant if components already use react-hook-form with Zod,
  // but acts as a safeguard.
  const validationResult = UpdateSchoolSchema.safeParse(schoolData);
  if (!validationResult.success) {
    return { success: false, error: 'Invalid school data provided.', issues: validationResult.error.issues };
  }

  return apiCall<z.infer<typeof SchoolResponseSchema>>(
    `${API_BASE_URL}/schools/${id}`,
    'PUT',
    validationResult.data,
    SchoolResponseSchema
  );
};

// --- Review API Functions ---

export const getReviewsBySchoolId = async (schoolId: number) => {
  // Your current API route for reviews doesn't seem to support filtering by schoolId
  // directly for GET /api/reviews. It seems you fetch reviews via the school detail page.
  // If you later add a GET /api/reviews?schoolId=X endpoint, you can uncomment/use this.
  // For now, assume reviews are fetched as part of school data or via a direct endpoint like /api/schools/[id]/reviews
  return apiCall<z.infer<typeof ReviewResponseSchema>[]>(
    `${API_BASE_URL}/schools/${schoolId}/reviews`, // Assuming you create this endpoint
    'GET',
    undefined,
    z.array(ReviewResponseSchema) // Array of review schemas
  );
};

export const createReview = async (reviewData: z.infer<typeof CreateReviewSchema>) => {
  const validationResult = CreateReviewSchema.safeParse(reviewData);
  if (!validationResult.success) {
    return { success: false, error: 'Invalid review data provided.', issues: validationResult.error.issues };
  }

  return apiCall<z.infer<typeof ReviewResponseSchema>>(
    `${API_BASE_URL}/reviews`,
    'POST',
    validationResult.data,
    ReviewResponseSchema
  );
};

export const updateReview = async (id: number, reviewData: z.infer<typeof UpdateReviewSchema>) => {
  const validationResult = UpdateReviewSchema.safeParse(reviewData);
  if (!validationResult.success) {
    return { success: false, error: 'Invalid review data provided.', issues: validationResult.error.issues };
  }

  return apiCall<z.infer<typeof ReviewResponseSchema>>(
    `${API_BASE_URL}/reviews/${id}`,
    'PUT',
    validationResult.data,
    ReviewResponseSchema
  );
};

export const deleteReview = async (id: number) => {
  return apiCall<Record<string, never>>( // Changed '{}' to 'Record<string, never>'
    `${API_BASE_URL}/reviews/${id}`,
    'DELETE'
  );
};