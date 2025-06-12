'use client'

// Next
import { useRouter } from 'next/navigation'
// Supabase
import { supabase } from '../../supabase-client'
// Framer Motion
import { AnimatePresence, motion } from 'framer-motion'
// Mui
import { Box} from '@mui/material'
// Components
import NavBar from '../components/NavBar'
// Lib
import { checkSession } from '../lib/checkSession'
import { useEffect } from 'react'



const title = 'md:text-[2rem] md:-top-5 md:-translate-y-5 absolute -top-4 -translate-y-4 ml-1 text-xl font-bold'

const Page = () => {

  const router = useRouter()

  const fetchSession =  async () => {
      const CurrentSession = await supabase.auth.getSession()
      const userSession = CurrentSession.data.session
  
      if (userSession){
          router.push('/home')
      }
      else{
          router.push('/login')
      }
  }

  useEffect(() => {
    fetchSession
  },[])

  checkSession()

  return (
    <>
      <NavBar/>
      <AnimatePresence>
        <motion.div  
          className='md:ml-[75px]'
          key='page'
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >

          <Box className='flex place-items-center gap-5 pt-10 px-5 pb-[75px]
                          md:pt-[50px] md:px-[50px] md:pb-[75px] md:gap-10'>
              <Box className='md:size-[120px] size-[70px] rounded-[50%] bg-white'></Box>
              <h1 className='md:text-[2.5rem] text-white text-2xl font-bold'>Welcome Back ???</h1>
          </Box>

          <Box className='h-[calc(100vh-250px)] text-white grid grid-cols-2 grid-rows-10 px-5 gap-5
                          md:h-[100vh-100px] md:px-[50px]'>
            <Box className='md:mb-10 relative bg-gray-700 col-span-2 row-span-5 rounded-xl mb-5 flex place-items-center'>
              <h1 className={`${title}`}>Routine Preview</h1>
              <Box className='flex flex-wrap overflow-scroll size-[85%] rounded-xl mx-auto scrollbar-hide'>
              
              </Box>

            </Box>
            <Box className='relative bg-gray-700 col-span-1 row-span-4 rounded-xl'>
              <h1 className={`${title}`}>Streak</h1>
            </Box>
            <Box className='relative bg-gray-700 col-span-1 row-span-4 rounded-xl'>
                <h1 className={`${title}`}>Rank</h1>
            </Box>
          </Box>
        </motion.div >
      </AnimatePresence>
    </>
  )
}

export default Page