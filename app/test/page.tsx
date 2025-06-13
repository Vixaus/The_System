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

const Page = () => {

  const [menu, setMenu] = useState<boolean>(false)

  const handleMenu = (e: any) => {
    e.preventDefault()
    setMenu(!menu)
  }

  return (
    <>
    <Box className='md:flex hidden'>
      <Box className='bg-gray-800 w-screen h-[70px] flex text-white place-items-center'>
        <Box className='w-full ml-[20px] flex place-items-center gap-5'>
            <Box className='flex-1'>
              <button className='text-xl font-bold cursor-pointer'>The System</button>
            </Box>

          <Box className='flex-1 flex flex-row-reverse gap-10 mr-[40px]'>
            <button className='text-lg cursor-pointer'> Login </button>
            <button className='text-lg cursor-pointer'> Contact </button>
            <button className='text-lg cursor-pointer'> Home </button>
          </Box>
        </Box>
      </Box>
    </Box>
    <Box className='max-md:flex hidden'>
      <Box className='relative bg-gray-800 w-screen h-[65px] flex text-white place-items-center'>
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

export default Page