"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { LogOut } from 'lucide-react';

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    console.log("Logout button clicked.");
    const { data: { session: currentSession }, error: getSessionError } = await supabase.auth.getSession();
    if (getSessionError) {
      console.error("Error getting session before logout:", getSessionError.message);
    } else {
      console.log("Current session before calling signOut:", currentSession);
    }

    if (!currentSession) {
      showError("No active session found to log out from.");
      console.error("Logout attempted with no active session.");
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error.message);
      showError('Failed to log out: ' + error.message);
    } else {
      console.log("Logout successful. Session state change should follow.");
      showSuccess('You have been logged out successfully.');
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;