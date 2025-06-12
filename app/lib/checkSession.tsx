'use client';

// import { useEffect } from 'react';
// import { supabase } from '@/supabase-client';
// import { useRouter } from 'next/navigation';

export function useCheckSession() {
  // const router = useRouter();

  // useEffect(() => {

  //   const checkSession = async () => {
  //     const { data: { session } } = await supabase.auth.getSession();
  //     if (!session) {
  //       router.push('/login');
  //     }
  //   };
  //   checkSession();


    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {

        setTimeout(() => {
          router.push('/login');
        }, 50);
      }
    });

  //   return () => {
  //     listener?.subscription?.unsubscribe()
  //   };
  // }, []);
}