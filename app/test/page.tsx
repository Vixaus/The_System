'use client'
// Framer Motion
import { motion, AnimatePresence } from 'framer-motion'
// Component
import NavBar from '../components/NavBar';

const page = () => {
  return (
    <>
    <NavBar/>
    <AnimatePresence>
        <motion.div
          className='h-screen flex justify-center place-items-center text-white'
          key='popup'
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
        <h1 className='text-[2rem] font-bold'>Coming Soon...</h1>
      </motion.div>

    </AnimatePresence>
    </>
  )
}

export default page