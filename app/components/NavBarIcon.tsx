// React
import React from 'react'
// Mui
import { Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// Lib
import { hoverScaleMui } from '../lib/hoverScaleMui';
interface Template{
    Icon: React.ElementType
    TextIcon?: string
}
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
const textHover = 'group-hover:scale-110 transition duration-100 ease-in-out'

const NavBarIcon = ({Icon, TextIcon} : Template) => {

    const ComponentIcon = Icon

  return (
    <ThemeProvider theme={theme}>
      <Box className='group flex flex-col items-center justify-center}'>
        <ComponentIcon sx={{fontSize:{xs:40,md:45}, color:'white', ...hoverScaleMui(1.15)}}/>
        <h1 className={`${textHover} text-white text-[12px]`}>{TextIcon}</h1>
    </Box>
    </ThemeProvider>
  )
}

export default NavBarIcon

