'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase-client';
import { useRouter } from 'next/navigation';

export function useCheckSession() {

    const router = useRouter()
    const [ready, setReady] = useState(false)

   useEffect(() => {
    const listener = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setReady(true)
      }
    });

    return () => {
      listener.data?.subscription?.unsubscribe()
    };
}, []);

  useEffect(() => {
      if (ready) {
        router.push('/login')
      }
    }, [ready]);

}