import { create } from "zustand";
import { getSession } from "next-auth/react";

export const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  
  setUser: (user) => set({ user }),

  checkSession: async () => {
    try {
      const session = await getSession();
      
      if (session) {
        set({ isAuthenticated: true });
        // Fetch user data if session exists
        get().fetchUserData(session.user.email);
      } else {
        set({ isAuthenticated: false });
      }
    } catch (error) {
      console.error("Error checking session:", error);
      set({ isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchUserData: async (email) => {
    try {
      set({ isLoading: true });
      const response = await fetch(`/api/users?email=${email}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      
      const userData = await response.json();
      set({ user: userData });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: () => {
    set({ isAuthenticated: false, user: null });
  }
}));