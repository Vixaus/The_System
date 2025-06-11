'use client'
// Framer Motion
import { motion, AnimatePresence } from 'framer-motion'
// Mui
import { Box } from '@mui/material'
// Component
import NavBar from '../components/NavBar';

const page = () => {
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

export default page