'use client'

// React
import { useEffect } from 'react'
// Next
import { useRouter } from 'next/navigation'
// Supabase
import { supabase } from '@/supabase-client'
// Framer Motion
import { motion, AnimatePresence } from 'framer-motion'
// Mui
import { Box } from '@mui/material'
// Component
import NavBar from '../components/NavBar'
// Lib
import { CheckSession } from '../lib/checkSession'

const Page = () => {

  const router = useRouter()

  const fetchSession =  async () => {
    const CurrentSession = await supabase.auth.getSession()
    const userSession = CurrentSession.data.session

    if (!userSession) {
      router.push('/login')
    }
  }

  useEffect(() => {
    fetchSession()
  })

  CheckSession()

  return (
    <>
    <NavBar/>
    <AnimatePresence>
        <motion.div
          className='md:ml-[75px] md:h-screen h-[calc(100vh-80px)] flex justify-center place-items-center text-white'
          key='popup'
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
        <Box className='flex justify-center place-items-center bg-gray-800 size-[90%] rounded-xl'>
            <h1 className='text-[2rem] font-bold'>Coming Soon...</h1>
        </Box>
      </motion.div>
    </AnimatePresence>
    </>
  )
}

export default Page