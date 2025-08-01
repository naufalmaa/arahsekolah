// app/lib/types.ts
import { Role } from '@prisma/client';

export interface User {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  role: Role;
  assignedSchoolId?: number | null;
  assignedSchool?: {
    id: number;
    name: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface School {
  id: number;
  name: string;
  status: string;
  npsn: string;
  bentuk: string;
  telp: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  lat?: number | null;
  lng?: number | null;
  description?: string | null;
  programs?: string | null;
  achievements?: string | null;
  website?: string | null;
  contact?: string | null;
  admins?: {
    id: string;
    name?: string | null;
    email: string;
  }[];
  reviews?: Review[];
  _count?: {
    reviews: number;
    admins: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: number;
  schoolId: number;
  userId: string;
  name: string;
  role: string;
  biaya: string;
  komentar: string;
  tanggal: Date;
  kenyamanan: number;
  pembelajaran: number;
  fasilitas: number;
  kepemimpinan: number;
  user?: {
    id: string;
    name?: string | null;
    role: Role;
  };
  school?: {
    id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// For forms and API requests
export interface CreateReviewInput {
  schoolId: number;
  name: string;
  role: string;
  biaya: string;
  komentar: string;
  kenyamanan: number;
  pembelajaran: number;
  fasilitas: number;
  kepemimpinan: number;
}

// export interface UpdateReviewInput extends Partial<CreateReviewInput> {}

export interface CreateUserInput {
  name: string;
  email: string;
  password?: string;
  role: Role;
  assignedSchoolId?: number;
}

// export interface UpdateUserInput extends Partial<CreateUserInput> {}

// Permission types
export type Permission = 'create' | 'read' | 'update' | 'delete';
export type Resource = 'school' | 'review' | 'user';

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}