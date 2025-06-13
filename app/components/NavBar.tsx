'use client'
// React
import React from 'react'
import { useState } from 'react'
// Next
import { useRouter } from 'next/navigation';
// Supabase
import { supabase } from '../../supabase-client';
// Framer Motion
import { AnimatePresence, motion } from 'framer-motion'
// Mui
import { Box } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
// Component
import NavBarIcon from './NavBarIcon';

const NavBar = () => {

    const router = useRouter()

    const [menu, setMenu] = useState<boolean>(false)

    const handleMenu = () => {
      setMenu(!menu)
    }

    const handleHome = (e: any) => {
      e.preventDefault()
      router.push('/home')
    }

    const handleRoutine = (e: any) => {
      e.preventDefault()
      router.push('/routine')
    }

    const handleStreak = (e: any) => {
      e.preventDefault()
      router.push('/streak')
    }

    const handleRank = (e: any) => {
      e.preventDefault()
      router.push('/rank')
    }

    const signOut = async (e: any) => {
      e.preventDefault()
        await supabase.auth.signOut()
        router.push('/login')       
    }

  return (
    <>
    <Box className='md:flex hidden fixed min-h-full bg-gray-800 justify-end px-5 w-[75px]'>
      <Box className='relative top-3 right-1/2 translate-x-1/2 translate-y-3'>
        <Box className='h-full flex flex-col mt-10 gap-8'>
          <button onClick={(e) => {handleHome(e)}}>
            <NavBarIcon Icon={HomeIcon} TextIcon='Home'/>
          </button>
          <button onClick={(e) => {handleRoutine(e)}}>
            <NavBarIcon Icon={FitnessCenterIcon} TextIcon='Routine'/>
          </button>   
          <button onClick={(e) => {handleStreak(e)}}>
            <NavBarIcon Icon={WhatshotIcon} TextIcon='Streak'/>
          </button>
          <button onClick={(e) => {handleRank(e)}}>
            <NavBarIcon Icon={MilitaryTechIcon} TextIcon='Rank'/>
          </button>
          <Box className='h-[100%] flex flex-col-reverse pb-[100px] gap-5 mb-10'>
            <NavBarIcon Icon={SettingsIcon} TextIcon='Setting'/>
            <button onClick={(e) => {signOut(e)}}>
              <NavBarIcon Icon={ExitToAppIcon} TextIcon='Logout'/>
            </button>
          </Box>
        </Box>
      </Box>
    </Box>

    <Box className='max-md:flex hidden relative z-50 min-w-full bg-gray-800 justify-start h-[65px]'>
      <button onClick={handleMenu} className='ml-5'>
        <NavBarIcon Icon={MenuIcon}/>
      </button>
      <AnimatePresence>
        {menu && (
          <motion.div 
            className='absolute w-screen top-[65px] bg-gray-800 text-white'
            layout
            key='navbar'
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >

            <Box className='flex flex-col'>
              <button onClick={(e) => {handleHome(e)}} className='p-3 border-t-[1px] border-b-[1px] border-white/20'>
                <h1 className='text-left'>Home</h1>
              </button>
              <button onClick={(e) => {handleRoutine(e)}} className='p-3 border-b-[1px] border-white/20'>
                <h1 className='text-left'>Routine</h1>
              </button>
              <button onClick={(e) => {handleStreak(e)}} className='p-3 border-b-[1px] border-white/20'>
                <h1 className='text-left'>Streak</h1>
              </button>
              <button onClick={(e) => {handleRank(e)}} className='p-3 border-b-[1px] border-white/20'>
                <h1 className='text-left'>Rank</h1>
              </button>
              <button className='p-3 border-b-[1px] border-white/20'>
                <h1 className='text-left'>Setting</h1>
              </button>
              <button onClick={(e) => {signOut(e)}} className='p-3 border-b-[1px] border-white/20'>
                <h1 className='text-left'>Sign Out</h1>
              </button>
            </Box>

          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  </>
  )
}

export default NavBar