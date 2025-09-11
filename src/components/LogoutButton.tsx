"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { LogOut } from 'lucide-react';

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError('Failed to log out: ' + error.message);
    } else {
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