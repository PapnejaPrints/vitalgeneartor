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
  const [isLoading, setIsLoading] = useState(true); // Initialized to true
  const navigate = useNavigate();

  useEffect(() => {
    console.log("SessionContextProvider useEffect triggered");

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("onAuthStateChange event:", event, "session:", currentSession);
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setIsLoading(false);
        if (currentSession && window.location.pathname === '/login') {
          console.log("Redirecting from /login to / (SIGNED_IN)");
          navigate('/'); // Redirect authenticated users from login page to home
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setIsLoading(false);
        console.log("Redirecting to /login (SIGNED_OUT)");
        navigate('/login'); // Redirect unauthenticated users to login page
      } else if (event === 'INITIAL_SESSION') {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setIsLoading(false);
        if (!currentSession && window.location.pathname !== '/login') {
          console.log("Redirecting to /login (INITIAL_SESSION, no session)");
          navigate('/login'); // Redirect to login if no session and not already on login page
        } else if (currentSession && window.location.pathname === '/login') {
          console.log("Redirecting from /login to / (INITIAL_SESSION, has session)");
          navigate('/');
        }
      } else if (event === 'AUTH_ERROR') {
        showError('Authentication error. Please try again.');
        setIsLoading(false);
        console.error("Supabase AUTH_ERROR:", currentSession);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Render a loading state until the session is fully determined
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