
import { UserProfile, Submission, Vote, UserRole, Badge } from '../types';

const KEYS = {
  USERS: 'based_users',
  SUBMISSIONS: 'based_submissions',
  VOTES: 'based_votes',
  CURRENT_USER_ID: 'based_current_user_id'
};

// Helper to get current week ID
export const getCurrentWeekId = (): string => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDays = (now.getTime() - startOfYear.getTime()) / 86400000;
  const weekNum = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNum}`;
};

// Helper to get time until next reset (Next Sunday Midnight)
export const getTimeUntilReset = (): { days: number; hours: number; minutes: number; seconds: number } => {
    const now = new Date();
    const nextSunday = new Date();
    nextSunday.setDate(now.getDate() + (7 - now.getDay()));
    nextSunday.setHours(23, 59, 59, 999);
    
    const diff = nextSunday.getTime() - now.getTime();
    
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
    };
};

export const StorageService = {
  getUsers: (): UserProfile[] => {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  getUserByEmail: (email: string): UserProfile | undefined => {
    const users = StorageService.getUsers();
    return users.find(u => u.email === email);
  },

  saveUser: (user: UserProfile): void => {
    const users = StorageService.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  getSubmissions: (): Submission[] => {
    const data = localStorage.getItem(KEYS.SUBMISSIONS);
    return data ? JSON.parse(data) : [];
  },

  saveSubmission: (submission: Submission): void => {
    const subs = StorageService.getSubmissions();
    subs.push(submission);
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(subs));
  },

  deleteSubmission: (id: string): void => {
    const subs = StorageService.getSubmissions();
    const filtered = subs.filter(s => s.id !== id);
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(filtered));
  },

  getVotes: (): Vote[] => {
    const data = localStorage.getItem(KEYS.VOTES);
    return data ? JSON.parse(data) : [];
  },

  saveVote: (vote: Vote): void => {
    const votes = StorageService.getVotes();
    votes.push(vote);
    localStorage.setItem(KEYS.VOTES, JSON.stringify(votes));
  },

  setCurrentUserId: (id: string | null): void => {
    if (id) {
      localStorage.setItem(KEYS.CURRENT_USER_ID, id);
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER_ID);
    }
  },

  getCurrentUserId: (): string | null => {
    return localStorage.getItem(KEYS.CURRENT_USER_ID);
  },

  // Admin Specific Helpers
  getStats: () => {
    const users = StorageService.getUsers();
    const submissions = StorageService.getSubmissions();
    const votes = StorageService.getVotes();
    return {
      totalUsers: users.length,
      totalSubmissions: submissions.length,
      totalVotes: votes.length,
      activeBuilders: users.filter(u => u.role === UserRole.BUILDER).length,
      activeCreators: users.filter(u => u.role === UserRole.CREATOR).length,
    };
  }
};

// Initialize some dummy data if empty
const initDummyData = () => {
  if (StorageService.getSubmissions().length === 0) {
    
    // Sample Badges
    const badgeGold: Badge = { id: 'b1', name: 'Week 1 Winner', icon: '👑', description: 'Placed 1st in Week 1', weekId: '2023-W41', rank: 1, color: 'text-yellow-500 bg-yellow-100' };
    const badgeSilver: Badge = { id: 'b2', name: 'Week 1 Runner Up', icon: '🥈', description: 'Placed 2nd in Week 1', weekId: '2023-W41', rank: 2, color: 'text-gray-500 bg-gray-100' };

    const dummyUsers: UserProfile[] = [
      { id: 'admin1', name: 'System Admin', role: UserRole.ADMIN, email: 'imomitradir123@gmail.com', password: 'omiS1234@', about: 'Platform Administrator', joinedAt: Date.now(), avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=000&color=fff', isVerified: true },
      { id: 'u1', name: 'Alice Builder', role: UserRole.BUILDER, email: 'alice@example.com', password: 'password', about: 'Building DeFi tools.', joinedAt: Date.now(), walletAddress: '0x123...abc', avatarUrl: 'https://picsum.photos/id/64/200/200', badges: [badgeGold], isVerified: true },
      { id: 'u2', name: 'Bob Creator', role: UserRole.CREATOR, email: 'bob@example.com', password: 'password', about: 'NFT Artist on Base.', joinedAt: Date.now(), walletAddress: '0x456...def', avatarUrl: 'https://picsum.photos/id/65/200/200', badges: [badgeSilver] },
      { id: 'u3', name: 'Charlie Dev', role: UserRole.BUILDER, email: 'charlie@example.com', password: 'password', about: 'Smart Contract Auditor.', joinedAt: Date.now(), walletAddress: '0x789...ghi', avatarUrl: 'https://picsum.photos/id/66/200/200' }
    ];
    
    const week = getCurrentWeekId();
    const dummySubs: Submission[] = [
      { id: 's1', userId: 'u1', weekId: week, title: 'BaseDeFi Aggregator', description: 'A unified interface for all Base liquidity pools.', link: 'https://base.org', imageUrl: 'https://picsum.photos/id/20/600/400', createdAt: Date.now(), votes: 5, category: UserRole.BUILDER },
      { id: 's2', userId: 'u2', weekId: week, title: 'Blue NFT Collection', description: 'Generative art based on on-chain metrics.', link: 'https://base.org', imageUrl: 'https://picsum.photos/id/28/600/400', createdAt: Date.now() - 10000, votes: 12, category: UserRole.CREATOR },
      { id: 's3', userId: 'u3', weekId: week, title: 'Gas Optimizer Hook', description: 'React hook to estimate and optimize gas fees in real-time.', link: 'https://base.org', imageUrl: 'https://picsum.photos/id/60/600/400', createdAt: Date.now() - 20000, votes: 8, category: UserRole.BUILDER }
    ];

    localStorage.setItem(KEYS.USERS, JSON.stringify(dummyUsers));
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(dummySubs));
  }
};

initDummyData();
