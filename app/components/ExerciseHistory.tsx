// React
import React, { useState } from 'react'
// Mui
import { Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import CheckIcon from '@mui/icons-material/Check';
// Lib
import { hoverScale } from '../lib/hoverScale';
import { muiTextArea } from '../lib/muiTextArea';


interface check{
  removeList: (id: number) => void
  upDateList: (id: number, rep: number, weight: number) => void
  exercise_id: number
  rep: number
  weight: number
  date: string
  time: string
}

const ExerciseHistory = ({ removeList,  upDateList, exercise_id, rep, weight, date, time}: check) => {

  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [newRep, setNewRep] = useState<any>(rep)
  const [newWeight, setNewWeight] = useState<any>(weight)

  const handleEdit = () => {
    setOpenEdit(false)
    upDateList(exercise_id, newRep, newWeight)
  }

  return (
    <>
      <h1 className='ml-1'>{date}</h1>
      <Box className='md:text-xl md:px-10 md:py-3 flex place-items-center bg-gray-700/50 rounded-lg py-2 px-5 border-b-2 border-white/20 mt-1'>
          <h1>{time}</h1>
          <Box className='md:gap-10 flex flex-row-reverse place-items-center gap-4 w-full font-bold'>
              <Box className='flex gap-2'>
                {openEdit? (
                  <button onClick={handleEdit} className={`bg-green-500 size-[30px] rounded-lg flex place-items-center justify-center ${hoverScale}
                      hover:scale-110`}>
                  <CheckIcon sx={{color:'white'}}/>
                </button>
                ):(
                  <button onClick={() => {setOpenEdit(true)}} className={`bg-yellow-500 size-[30px] rounded-lg flex place-items-center justify-center ${hoverScale}
                      hover:scale-110`}>
                  <EditIcon sx={{color:'white'}}/>
                </button>
                )  
                }
                <button onClick={() => removeList(exercise_id)} className={`bg-red-600 size-[30px] rounded-lg flex place-items-center justify-center ${hoverScale}
                        hover:scale-110`}>
                  <CloseIcon sx={{color:'white'}}/>
                </button>
              </Box>
            {openEdit ? (
              <>
                <TextField
                  id='editRep'
                  onChange={(e) => setNewRep(e.target.value)}
                  placeholder='0'
                  slotProps={{
                      htmlInput:{
                          type:'number',
                          step: "any",
                          defaultValue: newRep,
                          min: 0
                      }
                  }}
                  sx={{
                    width:{
                      xs: '55px',
                      md: '200px'
                    },
                    '& input': {
                    padding: '6px',
                    textAlign: 'center', 
                    },
                    ...muiTextArea
                  }}
                />
                <TextField
                  id='editWeight'
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder='0'
                  slotProps={{
                      htmlInput:{
                          type:'number',
                          step: "any",
                          defaultValue: newWeight,
                          min: 0
                      }
                  }}
                  sx={{
                    width:{
                      xs: '55px',
                      md: '200px'
                    },
                    '& input': {
                    padding: '6px',
                    textAlign: 'center', 
                    },
                    ...muiTextArea
                  }}
                />
              </>
            ):(
              <>
              <h1>{rep} Reps</h1>
              <h1>{weight} kg</h1>
              </>
            )}
          </Box>
      </Box>
    </>
  )
}

export default ExerciseHistory