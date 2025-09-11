"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { showError } from '@/utils/toast';

interface SessionContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("SessionContextProvider useEffect triggered.");

    const getInitialSession = async () => {
      console.log("Fetching initial session...");
      setIsLoading(true);
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting initial session:", error.message);
        showError("Failed to retrieve session: " + error.message);
      }
      setSession(initialSession);
      setUser(initialSession?.user || null);
      setIsLoading(false);
      console.log("Initial session fetched:", initialSession);

      // Handle initial redirection based on fetched session
      if (initialSession && window.location.pathname === '/login') {
        console.log("Initial session found, redirecting from /login to /");
        navigate('/');
      } else if (!initialSession && window.location.pathname !== '/login') {
        console.log("No initial session found, redirecting to /login");
        navigate('/login');
      }
    };

    getInitialSession(); // Call once on mount to set initial state

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("onAuthStateChange event:", event, "currentSession:", currentSession);
      setSession(currentSession);
      setUser(currentSession?.user || null);

      // Redirection logic for state changes
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (currentSession && window.location.pathname === '/login') {
          console.log("Redirecting from /login to / (SIGNED_IN/USER_UPDATED)");
          navigate('/');
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("Redirecting to /login (SIGNED_OUT)");
        navigate('/login');
      } else if (event === 'AUTH_ERROR') {
        showError('Authentication error. Please try again.');
        console.error("Supabase AUTH_ERROR:", currentSession);
      }
      // isLoading is only for the very first load, not subsequent state changes
    });

    return () => {
      console.log("SessionContextProvider useEffect cleanup: Unsubscribing from auth state changes.");
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-xl">Loading authentication...</p>
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ session, user, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};