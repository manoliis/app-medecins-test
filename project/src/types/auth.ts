export type UserRole = 'admin' | 'doctor' | 'patient' | 'guest' | 'affiliate';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  doctorId?: number;
  affiliateId?: string;
}

export interface AffiliateStats {
  id: string;
  name: string;
  email: string;
  totalEarnings: number;
  monthlyEarnings: number;
  referredDoctors: number;
  activeReferrals: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface PatientStats {
  totalPatients: number;
  activePatients: number;
  totalReviews: number;
  averageRating: number;
}