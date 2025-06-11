'use client'
// React
import React from 'react'
import { useState, useEffect } from 'react'
// Next
import { useRouter } from 'next/navigation'
// Supabase
import { supabase } from "../../supabase-client"


const page = () => {
    
    const [session, setSession] = useState<any>(null)
    const router = useRouter()

    const fetchSession =  async () => {
        const CurrentSession = await supabase.auth.getSession()
        const userSession = CurrentSession.data.session
        setSession(userSession)
    
        if (userSession){
            router.push('/supabase')
        }
        else{
            router.push('/login')
        }
    }

    useEffect(() => {
        fetchSession()

        const {data: authListener} = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        }) 

        return () => {
            authListener.subscription.unsubscribe
        }
    },[])

    const signOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

  return (
    <>
        <div className='grid place-items-center min-h-screen'>
            <div className="flex flex-col">
                <h1 className=' text-white text-[40px] opacity-50'>Signed In...</h1>
                <button onClick={() => signOut()} className='bg-black rounded-md text-white p-1 cursor-pointer'>Logout</button>
            </div>
        </div>
    </>
  )
}

export default page