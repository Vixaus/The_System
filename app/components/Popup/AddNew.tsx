'use client'
// React
import { useState } from 'react'
// Framer Motion
import { motion, AnimatePresence } from 'framer-motion'
// Mui
import { Box } from '@mui/material'
import { muiTextArea } from '../../lib/muiTextArea'
import TextField from '@mui/material/TextField';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// Component
import { AddNewButton } from '../../components/AddNewButton';
//Lib
import { hoverScaleMui } from '../../lib/hoverScaleMui'

interface check{
    onClose: () => void
    handleAddNew: (name: string) => void
    vis: boolean
    title: string
    section: string
    placeholder: string
}

export default function AddNew({onClose, handleAddNew, vis, title, section, placeholder}:check){


    const [routineName, setRoutineName] = useState<any>("")
    const [visible, setVisible] = useState<boolean>(vis)

    const handleSubmit = (e: any) => {
        e.preventDefault()

        if (!routineName.trim()) return
        
        handleAddNew(routineName)
        setVisible(false)
    }

    return(
        <AnimatePresence onExitComplete={onClose}>
            {visible && (
                <Box onClick={() => {setVisible(false)}} className={`fixed inset-0 z-50 min-h-screen grid place-items-center bg-black/30 backdrop-blur-sm`}>
                    <motion.div
                        layout
                        onClick={(e) => {e.stopPropagation()}}
                        className='md:size-[500px] w-[325px] h-[400px] p-5 rounded-xl bg-gray-800 flex flex-col text-white shadow-md shadow-gray-700' 
                        key='New'
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 40, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <Box className='md:my-7 md:gap-3 text-xl mb-7 mt-3 flex gap-1 place-items-center justify-center'>
                            <button onClick={() => {setVisible(false)}}>
                                <ArrowBackIosIcon sx={{fontSize:28, ...hoverScaleMui(1.2)}}/>
                            </button>
                            <h1 className='md:text-[2rem] text-[1.25rem] font-bold '>{title}</h1>
                        </Box>
                        <Box component='form' onSubmit={(e) => {handleSubmit(e)}} className='md:gap-5 mt-10 gap-2 px-5 flex flex-col'>
                            <Box component='label' htmlFor='exerciseName' className='md:text-[1.5rem] md:mb-1 ml-1 text-lg'>{section}</Box>
                            <TextField
                                id='exerciseName'
                                placeholder={placeholder}
                                onChange={(e) => setRoutineName(e.target.value)}
                                slotProps={{
                                htmlInput:{
                                    type:'text'}
                                }}
                                sx={{...muiTextArea}}
                            />
                            <button type='submit' className='md:my-[140px] my-[90px]'>
                                <AddNewButton title='Confirm'/>
                            </button>
                        </Box>
                    </motion.div>
                </Box>
            )}
        </AnimatePresence>
    )
}