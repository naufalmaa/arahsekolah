// lib/queries.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import type { Review } from '@prisma/client';
import type { SchoolWithStats, School } from './types';

type CreateReviewInput = {
  schoolId: number;
  name: string;
  role: string;
  biaya: string;
  komentar: string;
  kenyamanan: number;
  pembelajaran: number;
  fasilitas: number;
  kepemimpinan: number;
};

// Fetch all schools with stats
export function useSchools() {
  // MODIFIKASI: Gunakan tipe SchoolWithStats
  return useQuery<School[]>({
    queryKey: ['schools'],
    queryFn: async () => {
      const res = await fetch('/api/schools');
      if (!res.ok) throw new Error('Failed to fetch schools');
      return res.json();
    },
  });
}

// Fetch one school by id
export function useSchool(id: string) {
  return useQuery<School>({
    queryKey: ['school', id],
    queryFn: async () => {
      const res = await fetch(`/api/schools/${id}`);
      if (!res.ok) throw new Error('Failed to fetch school');
      return res.json();
    },
    enabled: Boolean(id),
  });
}

// Fetch reviews for a school
export function useReviews(schoolId: string) {
  return useQuery<Review[]>({
    queryKey: ['reviews', schoolId],
    queryFn: async () => {
      const res = await fetch(`/api/reviews?schoolId=${schoolId}`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return res.json();
    },
    enabled: Boolean(schoolId),
  });
}

// Mutation: add a review
export function useAddReview() {
  const qc = useQueryClient();
  return useMutation<Review, Error, CreateReviewInput>({
    mutationFn: async (newReview) => {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        credentials: 'include',   
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      if (!res.ok) throw new Error('Failed to post review');
      return res.json();
    },
    onSuccess: (created) => {
      // In v5, invalidateQueries takes an object filter
      qc.invalidateQueries({ queryKey: ['reviews', created.schoolId.toString()] });
    },
  });
}
