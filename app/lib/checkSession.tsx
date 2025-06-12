import React from 'react'
import { useEffect } from 'react';
import { supabase } from '@/supabase-client';
import Router from 'next/router';

export function checkSession() {
    useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        Router.push('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
}