
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Submission, Vote, UserRole } from '../types';
import { StorageService, getCurrentWeekId } from '../services/storage';

interface AuthContextType {
  user: UserProfile | null;
  allUsers: UserProfile[];
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; role?: UserRole }>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; message: string }>;
  sendVerificationCode: (email: string) => Promise<{ success: boolean; message: string; code?: string }>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  submissions: Submission[];
  refreshSubmissions: () => void;
  voteForSubmission: (submissionId: string) => { success: boolean; message: string };
  submitEntry: (entry: Omit<Submission, 'id' | 'userId' | 'weekId' | 'createdAt' | 'votes'>) => { success: boolean; message: string };
  deleteSubmission: (id: string) => void;
  toggleBanUser: (userId: string) => void;
  userVotesThisWeek: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default "Ghost" Avatar (Simple Gray User Icon)
const DEFAULT_AVATAR = "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    const loadData = () => {
      const storedUsers = StorageService.getUsers();
      setAllUsers(storedUsers);

      const currentId = StorageService.getCurrentUserId();
      if (currentId) {
        const found = storedUsers.find(u => u.id === currentId);
        if (found) setUser(found);
      }
      setSubmissions(StorageService.getSubmissions());
      setVotes(StorageService.getVotes());
    };
    loadData();
  }, []);

  const refreshSubmissions = () => {
    setSubmissions(StorageService.getSubmissions());
    setVotes(StorageService.getVotes());
    setAllUsers(StorageService.getUsers());
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string; role?: UserRole }> => {
    const existingUser = StorageService.getUserByEmail(email);
    if (!existingUser) {
        return { success: false, message: "User not found." };
    }
    if (existingUser.password !== password) {
        return { success: false, message: "Invalid password." };
    }
    if (existingUser.isBanned) {
        return { success: false, message: "This account has been suspended." };
    }
    
    StorageService.setCurrentUserId(existingUser.id);
    setUser(existingUser);
    return { success: true, message: "Welcome back!", role: existingUser.role };
  };

  const sendVerificationCode = async (email: string): Promise<{ success: boolean; message: string; code?: string }> => {
    const existingUser = StorageService.getUserByEmail(email);
    if (existingUser) {
        return { success: false, message: "Email already registered." };
    }

    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real app, you would call an API to send this code via email.
    // Here we return it to be displayed in a mock alert.
    return { success: true, message: "Verification code sent.", code };
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<{ success: boolean; message: string }> => {
    // Double check existence (though sendVerificationCode checked it earlier)
    const existingUser = StorageService.getUserByEmail(email);
    if (existingUser) {
        return { success: false, message: "Email already registered." };
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name,
      email,
      password,
      role,
      joinedAt: Date.now(),
      // Set to a generic default so they have to upload their own later
      avatarUrl: DEFAULT_AVATAR,
      isBanned: false,
      isVerified: false
    };
    
    StorageService.saveUser(newUser);
    setAllUsers([...allUsers, newUser]);
    StorageService.setCurrentUserId(newUser.id);
    setUser(newUser);
    return { success: true, message: "Account created successfully!" };
  };

  const logout = () => {
    StorageService.setCurrentUserId(null);
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    StorageService.saveUser(updatedUser);
    setUser(updatedUser);
    setAllUsers(allUsers.map(u => u.id === user.id ? updatedUser : u));
  };

  // ADMIN ACTION: Toggle Ban
  const toggleBanUser = (userId: string) => {
    if (!user || user.role !== UserRole.ADMIN) return;
    
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return;
    if (targetUser.role === UserRole.ADMIN) return; // Cannot ban admins

    const updatedUser = { ...targetUser, isBanned: !targetUser.isBanned };
    StorageService.saveUser(updatedUser);
    
    setAllUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
  };

  // ADMIN ACTION: Delete Submission
  const deleteSubmission = (id: string) => {
    if (!user || user.role !== UserRole.ADMIN) return;
    StorageService.deleteSubmission(id);
    setSubmissions(prev => prev.filter(s => s.id !== id));
  };

  const voteForSubmission = (submissionId: string): { success: boolean; message: string } => {
    if (!user) return { success: false, message: "Please sign in to vote." };
    
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return { success: false, message: "Submission not found." };
    
    if (sub.userId === user.id) return { success: false, message: "You cannot vote for your own submission." };

    const weekId = getCurrentWeekId();
    const myVotesThisWeek = votes.filter(v => v.voterId === user.id && v.weekId === weekId);
    
    if (myVotesThisWeek.length >= 2) return { success: false, message: "You have used all 2 votes for this week." };
    
    if (myVotesThisWeek.some(v => v.submissionId === submissionId)) return { success: false, message: "You already voted for this." };

    const newVote: Vote = {
      voterId: user.id,
      submissionId,
      weekId,
      timestamp: Date.now()
    };

    StorageService.saveVote(newVote);
    
    // Update local submission vote count
    const updatedSubs = submissions.map(s => {
        if (s.id === submissionId) {
            return { ...s, votes: s.votes + 1 };
        }
        return s;
    });
    
    localStorage.setItem('based_submissions', JSON.stringify(updatedSubs));

    setVotes([...votes, newVote]);
    setSubmissions(updatedSubs);

    return { success: true, message: "Vote cast successfully!" };
  };

  const submitEntry = (entry: Omit<Submission, 'id' | 'userId' | 'weekId' | 'createdAt' | 'votes'>): { success: boolean; message: string } => {
    if (!user) return { success: false, message: "Must be logged in." };
    
    const weekId = getCurrentWeekId();
    const mySubmission = submissions.find(s => s.userId === user.id && s.weekId === weekId);
    
    if (mySubmission) return { success: false, message: "You have already submitted an entry for this week." };

    // Infer title if missing (since we removed the input)
    let finalTitle = entry.title;
    if (!finalTitle || finalTitle === "Project Submission") {
        // Try to generate a better title or keep generic
        finalTitle = `${user.name}'s ${entry.category} Entry`;
    }

    const newSub: Submission = {
      id: `sub_${Date.now()}`,
      userId: user.id,
      weekId,
      createdAt: Date.now(),
      votes: 0,
      ...entry,
      title: finalTitle,
      imageUrl: entry.imageUrl || `https://picsum.photos/seed/${Date.now()}/600/400` // Fallback image
    };

    StorageService.saveSubmission(newSub);
    setSubmissions([...submissions, newSub]);
    return { success: true, message: "Project submitted successfully!" };
  };

  const userVotesThisWeek = user ? votes.filter(v => v.voterId === user.id && v.weekId === getCurrentWeekId()).length : 0;

  return (
    <AuthContext.Provider value={{ 
      user, allUsers, isAdmin: user?.role === UserRole.ADMIN, login, register, sendVerificationCode, logout, updateProfile, 
      submissions, refreshSubmissions, voteForSubmission, submitEntry, deleteSubmission, toggleBanUser, userVotesThisWeek 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
