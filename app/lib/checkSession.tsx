'use client'

import { useEffect } from 'react';
import { supabase } from '@/supabase-client';
import { useRouter } from 'next/navigation';

export function CheckSession() {

    const router = useRouter()

    useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
}