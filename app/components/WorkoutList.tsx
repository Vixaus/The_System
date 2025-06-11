'use client'

// React
import { useState } from 'react';
// supabase
import { supabase } from '@/supabase-client';
// Mui
import { Box } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
// Lib
import { hoverScale } from '../lib/hoverScale';
// Components
import Exercise from './Popup/Exercise'
import ManageExercise from './Popup/ManageExercise'
import AddNew from './Popup/AddNew';

interface workout{
    handleRemove?: (id: number) => void
    exercise_id?: number
    remove_key?: number
    title?: string
    edit?: string
    page?: number
}

const IconBg = "size-[30px] rounded-lg flex place-items-center justify-center"

const page = ({handleRemove = () => null, exercise_id = 0, remove_key = 0, title='Leg day', edit='Manage', page=1}: workout) => {

    const [visPage1, setPage1] = useState<boolean>(false)
    const [visPage2, setPage2] = useState<boolean>(false)
    const [visAddNew1, setvisAddNew1] = useState<boolean>(false)
    const [visAddNew2, setvisAddNew2] = useState<boolean>(false)

    const handleManage = () => {
        {page === 1?(
            setPage1(true)
        ):(
            setPage2(true)
        )
        }
    }

    const handleEdit = () => {
        {page === 1?(
            setvisAddNew1(true)
        ):(
            setvisAddNew2(true)
        )
        }
    }

    const handleEditRoutine = async (name: string) => {
        const { error } = await supabase
            .from("routine")
            .update({routine_name: name})
            .eq("id" , remove_key)
            .single()

        if (error){
            console.log(error)
            return
        }
    }

    const handleEditExercise = async (name: string) => {
                const { error } = await supabase
            .from("exercise")
            .update({exercise_name: name})
            .eq("id" , remove_key)
            .single()

        if (error){
            console.log(error)
            return
        }
    }

  return (
    <>
        <Box className='flex flex-col gap-10 border-b-2 border-white/25 py-2 place-items-center'>
            <Box className='md:gap-4 w-full flex gap-2 place-items-center ml-7 mr-7 bg-black/10 p-5 rounded-lg'>
                    <h1 className='text-lg whitespace-nowrap'>{title}</h1>
                <Box className='md:gap-3 w-full flex flex-row-reverse place-items-center gap-2'>
                    <button onClick={() => {handleRemove(remove_key)}} 
                            className={`bg-red-600 ${IconBg} ${hoverScale}`}>
                        <CloseIcon sx={{color:'white'}}/>
                    </button>

                    <button onClick={handleEdit} className={`bg-yellow-500 ${IconBg} ${hoverScale}`}>
                            <EditIcon sx={{color: 'white'}}/>
                    </button>

                    <button onClick={handleManage} 
                            className={`md:py-1 md:px-2 p-1 flex place-items-center justify-center bg-green-600 rounded-lg 
                                ${hoverScale}`}> 
                        <EditDocumentIcon sx={{color:'white'}}/>
                        <h1 className='md:text-base text-sm mx-1 font-bold'>{edit}</h1>
                    </button>
                </Box>
            </Box>
        </Box>

        {page === 1 && visPage1 ? (
            <Exercise routine_id={remove_key} vis={visPage1} onClose={() => setPage1(false)}/>
        ): page === 2 && visPage2 ? (
            <ManageExercise exerciseName={title} exercise_id={exercise_id} vis={visPage2} onClose={() => setPage2(false)} />
        ): page === 1 && visAddNew1 ? (
            <AddNew vis={visAddNew1} title="Edit Routine Name" section="Routine Name" placeholder="New Routine Name" 
                    onClose={() => setvisAddNew1(false)} handleAddNew={handleEditRoutine}
            />
        ): page === 2 && visAddNew2 ? (
            <AddNew vis={visAddNew2} title="Edit Exercise Name" section="Exercise Name" placeholder="New Exercise Name" 
                    onClose={() => setvisAddNew2(false)} handleAddNew={handleEditExercise}
            />
        ):(
            null
        )
        }
    </>
  )
}

export default page