'use client'
// Framer Motion
import { motion, AnimatePresence } from 'framer-motion'
// Mui
import { CircularProgress, Box, useMediaQuery, useTheme  } from '@mui/material'
import Check from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button'
import { grey } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// Lib 
import { hoverScaleMui } from '../../lib/hoverScaleMui';


const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
});

interface Popup {
  vis?: boolean
  message?: string
  type?: string
  onClose?: () => void
}

export default function NotiPopup({vis=false, message="progressing", type = "progress", onClose = () => {}}: Popup) {
   message = message?? "progressing"
  type = type?? "progress"

  const themes = useTheme();
  const isMd = useMediaQuery(themes.breakpoints.up('md'));

  const handleClick = () => {
    onClose()
  }

 const handleIcon = () => {
  switch (type) {
    case 'progress':
      return <CircularProgress size={isMd? 120 : 80}/>
    case 'check' :
      return <Check sx={{fontSize: {xs:80, md:120}, color:'green'}}/>
    case 'x' :
      return <CloseIcon sx={{fontSize: {xs:80, md:120}, color:'red'}}/>
    default: return
  }
 }

 const handleMessageType = () => {
  switch (type) {
    case 'progress':
      return <h1 className='md:text-2xl font-bold text-xl'>Gurting Please Wait</h1>
    case 'check' :
      return <h1 className='md:text-2xl font-bold text-xl'>Gurt Successfully</h1>
    case 'x' :
      return <h1 className='md:text-2xl font-bold text-xl'>sybau 💔</h1>
    default: return
  }
 }


  return (
    <AnimatePresence>
    {vis && (
      <ThemeProvider theme={theme}>
        <Box className='fixed inset-0 z-50 bg-black/30 backdrop-blur-sm min-h-screen grid place-items-center'>
            <motion.div 
                layout
                className='md:size-[500px] size-[325px] bg-white rounded-xl flex flex-col place-items-center justify-center'
                key='noti'
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.25 }}
            >
                
              <h1 className='md:mb-5 md:text-3xl text-xl font-bold mb-2'>The Sysmtem - gurt</h1>

              <Box className='md:size-[120px] md:m-[50px] m-4 size-[80px]'>
                {handleIcon()}
              </Box>

              <Box className='text-center'>
                  {handleMessageType()}
                  <h1 className='md:m-5 md:text-xl'>{message}</h1>
              </Box>

              <Button 
                variant="contained"
                onClick={handleClick}
                sx={{
                  backgroundColor: grey[900],
                  width:{
                    xs:'100px',
                    md:'150px'
                  },
                  fontSize:{
                    xs:'1.1rem',
                    md:'1.2rem',
                  },
                  borderRadius: '0.5rem',
                  mt: '1rem',
                  ...hoverScaleMui(1.1)
                  }}
                >
                  Okay !
              </Button>
            </motion.div>
        </Box>
      </ThemeProvider>
    )}
   </AnimatePresence>
  )
}
