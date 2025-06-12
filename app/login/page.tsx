'use client'
// React
import React, { FormEvent, useEffect, useState } from 'react'
// Next
import { useRouter } from 'next/navigation'
// Supabase
import { supabase } from '../../supabase-client';
// Mui
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { grey } from '@mui/material/colors';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
// Components
import NotiPopup from '../components/Popup/NotiPopup'
// Lib
import { muiTextArea } from '../lib/muiTextArea';
import { hoverScaleMui } from '../lib/hoverScaleMui'

const Page = () => {

  const [AuthCheck, setAuthCheck] = useState<boolean>(true)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [loadPopup, setLoadPopup] = useState<boolean>(false)
  const [msg, setMsg] = useState<any>(null)
  const [popupType, setPopupType] = useState<any>(null)
  const router = useRouter()

  const fetchSession =  async () => {
    const CurrentSession = await supabase.auth.getSession()
    const userSession = CurrentSession.data.session

    setLoading(false)

    if (userSession){
      router.push('/home')
    }
    else{
      router.push('/login')
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setPopupType(null)
    setMsg(null)
    setLoadPopup(true)
  
    if (AuthCheck){
      const { error:signUpError  } = await supabase.auth.signUp({email, password})

      if (signUpError ){
        console.log(signUpError.message)
        setPopupType('x')
        setMsg("error gng")

      }else{
        setPopupType('check')
        setMsg("success fully signed up please sign in to use the web")

      }
    }
    else{
      const { error:signInError  } = await supabase.auth.signInWithPassword({email, password})

      if (signInError ){
        console.log(signInError.message)
        setPopupType('x')
        setMsg("error gng")

      }else{
        setPopupType('check')
        setMsg("gg vro")
        setTimeout(() => {
          router.push('/home')
        }, 2000)
      }
    }
  }

  const handleAuth = () => {
    setAuthCheck(!AuthCheck)
    setEmail("")
    setPassword("")
  }

  useEffect(() => {
    fetchSession()
  },[])

  if(loading){
    return(
    <Box className='grid place-items-center min-h-screen bg-gray-800'>
      <Box className="flex flex-col">
          <h1 className=' text-white text-[40px] opacity-50'>Loading...</h1>
      </Box>
    </Box>
    )
  }else {
    return (
    <>
      <Box className="grid place-items-center min-h-screen bg-gray-900">
        <Box className='md:size-[600px] md:px-10 flex flex-col rounded-2xl overflow-hidden bg-gray-800 backdrop-blur-xl border-2 border-gray-600 shadow-xl shadow-gray-800 px-6 text-white'>
        <Box className="md:my-10 my-5">
          <h1 className='md:mb-2 text-[2rem] md:text-[40px] font-semibold bg-customBlue'>{AuthCheck? "Sign Up":"Sign In"}</h1>
          <Box className="flex flex-row gap-3">
            <h2 className='md:text-[20px] flex flex-row'>{AuthCheck? "Already have an account?" : " Don't have an account?"}</h2>
            <button className="md:text-[20px] underline hover:cursor-pointer transition duration-100 ease-in-out hover:scale-110"
              onClick={() => handleAuth()}
            >
              Click here
            </button>
          </Box>
        </Box>

        <Box component='form' className="md:gap-8 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Box className="flex flex-col">
            <label htmlFor="email" className="md:text-[23px] mb-[0.5rem]"><AccountCircle sx={{fontSize:{md:'30px'}, marginBottom:'5px'}}></AccountCircle> Email</label>
            <TextField
              id="email"
              placeholder='Enter Your Email'
              size='small'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              sx={{...muiTextArea}}
            />
          </Box>

          <Box className="flex flex-col">
            <label htmlFor="password" className="md:text-[23px] mb-[0.5rem]"><LockIcon sx={{ marginBottom:'5px'}}></LockIcon> Password</label>
            <TextField
              id="password"
              type='password'
              placeholder='Enter Your Password'
              size='small'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              sx={{...muiTextArea}}
            />
          </Box>

        <Box>
          <FormControlLabel 
            control={
              <Checkbox 
              defaultChecked
              icon={<CheckBoxOutlineBlankIcon 
                sx={{
                  border:'1px solid white',
                  borderRadius:'3px'
                }} 
              />}
              checkedIcon={<CheckBoxIcon 
                sx={{
                  backgroundColor:'white',
                  borderRadius:'3px',
                }} 
              />}
              sx={{
                '&.Mui-checked':{color: grey[900]},
                ...hoverScaleMui(1.1),
              }}
              />
            } 
            label="Remember me"
            sx={{fontSize:'20px'}}
            slotProps={{
              typography: {
                fontWeight: 'semibold',
              },
            }}
          />
          <a href="" className='font-semibold underline transition duration-100 ease-in-out hover:scale-105 inline-block md:text-[18px]'>Forgot password?</a>
        </Box>

          <Button 
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: grey[100],
              color: 'black',
              borderRadius: '0.5rem',
              px: '1rem',
              py: '0.5rem',
              mt: '0.5rem',
              mb: '2rem',
              ...hoverScaleMui(1.1)
              }}
            >
              {AuthCheck?"Sign Up":"Sign In"}
          </Button>

        </Box>

        </Box>
      </Box>
      <NotiPopup vis={loadPopup} message={msg}  type={popupType} onClose={() => {setLoadPopup(false)}}/>
    </>
    )
  }
}

export default Page