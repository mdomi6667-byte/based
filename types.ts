
export enum UserRole {
  BUILDER = 'Builder',
  CREATOR = 'Creator',
  OBSERVER = 'Observer',
  ADMIN = 'Admin'
}

export interface Badge {
  id: string;
  name: string;
  icon: string; // Emoji or URL
  description: string;
  weekId: string;
  rank: number; // 1, 2, 3
  color: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  password?: string;
  about?: string;
  twitter?: string;
  walletAddress?: string;
  avatarUrl?: string;
  farcasterLink?: string;
  telegram?: string;
  joinedAt: number;
  badges?: Badge[];
  isBanned?: boolean; // Admin feature
  isVerified?: boolean; // Admin feature
}

export interface Submission {
  id: string;
  userId: string;
  weekId: string; // e.g., "2023-W42"
  title: string;
  description: string;
  link: string;
  imageUrl?: string;
  createdAt: number;
  votes: number;
  category: UserRole; // Added to track if this is a Builder or Creator submission
}

export interface Vote {
  voterId: string;
  submissionId: string;
  weekId: string;
  timestamp: number;
}

// Mock service types
export interface AppState {
  users: UserProfile[];
  submissions: Submission[];
  votes: Vote[];
  currentUser: UserProfile | null;
}

// Extend Window interface for Farcaster SDK
declare global {
  interface Window {
    frame?: {
      sdk?: {
        actions?: {
          ready: () => void;
        };
      };
    };
  }
}
