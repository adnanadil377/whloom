// ========== Auth Types ==========

export type UserType = 'business' | 'creator';

export interface User {
  id: number;
  email: string;
  email_verified: boolean;
  user_type: UserType;
  created_at: string;
  // Creator-specific
  username?: string;
  instagram_url?: string;
  youtube_url?: string;
  // Business-specific
  company_name?: string;
  tax_id?: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  user_type: UserType;
  // Creator-specific
  username?: string;
  instagram_url?: string;
  youtube_url?: string;
  // Business-specific
  company_name?: string;
  tax_id?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface MessageResponse {
  message: string;
}

// ========== Business Types ==========

// Type definitions for the application
export interface OverviewStat {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
  color: string;
  subtitle?: string;
}

export interface Platform {
  name: string;
  views: string;
  spend: string;
  cpm: string;
  color: string;
}

export interface TopContent {
  title: string;
  creator: string;
  views: string;
  engagement: string;
}

export interface Campaign {
  id: number;
  name: string;
  platform: string;
  status: 'Active' | 'Draft' | 'Paused' | 'Completed' | 'In Progress' | 'Archived';
  budget?: string;
  spent?: string;
  views?: string;
  creators?: number;
  startDate: string | null;
  endDate: string | null;
  lastUpdated?: string;
  progress?: number;
  avatars?: string[];
}

export interface Creator {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  platform: string;
  subscribers: string;
  avgViews: string;
  rating: number;
  campaigns: number;
  status: 'Active' | 'Pending' | 'Inactive';
}

export interface Payment {
  id: number;
  creator: string;
  avatar: string;
  amount: string;
  campaign: string;
  status: 'Paid' | 'Pending' | 'Processing' | 'Failed';
  date: string;
  method: string;
}

export interface Asset {
  id: number;
  title: string;
  name?: string;  // For backwards compatibility
  creator: string;
  avatar: string;
  thumbnail: string;
  platform: string;
  views: string;
  uploadDate: string;
  uploadedAt?: string;  // For backwards compatibility
  uploadedBy?: string;  // For backwards compatibility
  status: 'Published' | 'Draft' | 'Under Review' | 'Scheduled';
  duration: string;
  type?: string;  // For backwards compatibility
  size?: string;  // For backwards compatibility
  campaign?: string;  // For backwards compatibility
}
