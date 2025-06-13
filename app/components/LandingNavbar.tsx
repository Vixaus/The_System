'use client'
// React
import { useState } from 'react';
// Framer Motion
import { motion, AnimatePresence } from 'framer-motion'
// Mui
import { Box } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
// Lib
import { hoverScaleMui } from '../lib/hoverScaleMui';
import { hoverScale } from '../lib/hoverScale';

const page = () => {

  const [menu, setMenu] = useState<boolean>(false)

  const handleMenu = (e: any) => {
    e.preventDefault()
    setMenu(!menu)
  }

  return (
    <>
    <Box className='md:flex hidden'>
      <Box className='bg-gray-900 w-screen h-[70px] flex text-white place-items-center shadow-md shadow-gray-800'>
        <Box className='w-full ml-[40px] flex place-items-center gap-5'>
            <Box className='flex-1'>
              <button className='text-2xl font-bold cursor-pointer hover:text-white/80'>The System</button>
            </Box>

          <Box className='flex-1 flex flex-row-reverse gap-10 mr-[40px]'>
            <button className={`text-lg cursor-pointer hover:font-bold ${hoverScale}`}> Login </button>
            <button className={`text-lg cursor-pointer hover:font-bold ${hoverScale}`}> Contact </button>
            <button className={`text-lg cursor-pointer hover:font-bold ${hoverScale}`}> Home </button>
          </Box>
        </Box>
      </Box>
    </Box>
    <Box className='max-md:flex hidden'>
      <Box className='relative bg-gray-900 w-screen h-[65px] flex text-white place-items-center shadow-md shadow-gray-800'>
          <Box className='ml-[20px] flex place-items-center gap-5'>
            <button onClick={(e) => handleMenu(e)}>
              <MenuIcon sx={{...hoverScaleMui(1.1)}}/>
            </button>
            <button className='text-xl font-bold'> The System </button>
          </Box>
            <AnimatePresence>
              {menu && (
                <motion.div 
                  className='absolute w-screen top-[65px] bg-gray-800'
                  layout
                  key='navbar'
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Box className='flex flex-col'>
                    <Box className='p-3 border-t-[1px] border-b-[1px] border-white/20'>
                      <h1 className=''>Home</h1>
                    </Box>
                    <Box className='p-3 border-b-[1px] border-white/20'>
                      <h1 className=''>Contact</h1>
                    </Box>
                    <Box className='p-3 border-b-[1px] border-white/20'>
                      <h1 className=''>Login</h1>
                    </Box>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
        </Box>
    </Box>
    </>
  )
}

export default page