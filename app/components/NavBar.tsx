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
// Lib
import { hoverScale } from '../lib/hoverScale';




const textHover = `${hoverScale} w-fit`


const NavBar = () => {

    const router = useRouter()

    const [menu, setMenu] = useState<boolean>(false)

    const handleMenu = () => {
      setMenu(!menu)
    }

    const handleHome = () => {
      router.push('/home')
    }

    const handleRoutine = () => {
      router.push('/routine')
    }

    const handleStreak = () => {
      router.push('/streak')
    }

        const handleRank = () => {
      router.push('/rank')
    }

    const signOut = async () => {
        await supabase.auth.signOut()       
    }

  return (
    <>
    <Box className='md:flex hidden fixed min-h-full bg-gray-800 justify-end px-5 w-[75px]'>
      <Box className='relative top-3 right-1/2 translate-x-1/2 translate-y-3'>
        <Box className='h-full flex flex-col mt-10 gap-8'>
          <button onClick={() => {handleHome()}}>
            <NavBarIcon Icon={HomeIcon} TextIcon='Home'/>
          </button>
          <button onClick={() => {handleRoutine()}}>
            <NavBarIcon Icon={FitnessCenterIcon} TextIcon='Routine'/>
          </button>   
          <button onClick={() => {handleStreak()}}>
            <NavBarIcon Icon={WhatshotIcon} TextIcon='Streak'/>
          </button>
          <button onClick={() => {handleRank()}}>
            <NavBarIcon Icon={MilitaryTechIcon} TextIcon='Rank'/>
          </button>
          <Box className='h-[100%] flex flex-col-reverse pb-[100px] gap-5 mb-10'>
            <NavBarIcon Icon={SettingsIcon} TextIcon='Setting'/>
            <button onClick={signOut}>
              <NavBarIcon Icon={ExitToAppIcon} TextIcon='Logout'/>
            </button>
          </Box>
        </Box>
      </Box>
    </Box>

    <Box className='max-md:flex hidden min-w-full bg-gray-800 justify-start px-5 h-[65px]'>
      <button onClick={handleMenu} className='mr-2'>
        <NavBarIcon Icon={MenuIcon}/>
      </button>
      <AnimatePresence>
        {menu && (
          <motion.div
            layout
            className='z-50'
            key='navbar'
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
          <Box className='flex flex-col gap-5 justify-evenly absolute top-[25px] right-0 translate-y-[25px] translate-x-0 w-screen bg-gray-800 my-2 font-semibold text-white
                  shadow-md shadow-gray-700 p-5 z-50'>
            <button onClick={() => {handleHome()}}>
              <h1 className={`${textHover}`}>Home</h1>
            </button>
            <button onClick={() => {handleRoutine()}}>
              <h1 className={`${textHover}`}>Routine</h1>
            </button>
            <button onClick={() => {handleStreak()}}>
              <h1 className={`${textHover}`}>Streak</h1>
            </button>
            <button onClick={() => {handleRank()}}>
              <h1 className={`${textHover}`}>Rank</h1>
            </button>
            <h1 className={`${textHover}`}>Setting</h1>
            <button onClick={signOut}>
              <h1 className={`${textHover}`}>Logout</h1>
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