'use client'
// React
import { useState, useEffect } from 'react'
// Supabase
import { supabase } from '@/supabase-client';
// Mui
import { Box } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// Framer Motion
import { motion, AnimatePresence } from 'framer-motion'
// Components
import WorkoutList from '../WorkoutList'
import { AddNewButton } from '../AddNewButton'
import AddNew from './AddNew';
//Lib
import { hoverScaleMui } from '../../lib/hoverScaleMui'

interface check{
    routine_id: number
    vis: boolean
    onClose : () => void
}

interface checkRoutine {
  id: number
  exercise: {
      id: number
      exercise_name: string;
  }[];
}

interface checkExercise {
  id: number
  exercise_name: string
}


export default function Exercise({routine_id, vis, onClose}: check) {

  const [visible, setVisible] = useState<boolean>(vis)
  const [openAddNew, setOpenAddNew] = useState<boolean>(false)
  const [exerciseList, setExerciseList] = useState<checkExercise[]>([])
  const [userId, setUserId] = useState<any>()

  const fetchSession =  async () => {
    const CurrentSession = await supabase.auth.getSession()
    const userSession = CurrentSession.data.session

    setUserId(userSession?.user.id)
  }
  
  const fetchData = async () => {
    const { error, data } = await supabase
      .from("routine")
      .select(`
          id,
          exercise (
            id,
            exercise_name
          )
        `)
      .eq("id", routine_id)
      .order("id", {ascending: true})

    if (error) {
      console.error(error.message)
      return
    }
    else {
      const rawData = data as checkRoutine[]
      const newExercise = rawData.flatMap(raw => raw.exercise)
      setExerciseList(newExercise)
    }
  }

  const handleOpenNewExercise = (e: any) => {
    e.preventDefault()
    setOpenAddNew(true)
  }

  const handleNewExercise = async (exercise_name: string) => {
    const { error } = await supabase
      .from("exercise")
      .insert({routine_id: routine_id, user_id: userId, exercise_name: exercise_name})

    if (error) {
      console.error(error.message)
      return
    }
  }

    const handleRemove = async (id: number) => {
      console.log(id)
      const { error } = await supabase
        .from("exercise")
        .delete()
        .eq("id", id)

      if (error) {
        console.error(error.message)
        return
      }
    }

  useEffect(()=>{
    const channel = supabase.channel(`exercise-channel-${routine_id}`)
    channel
      .on(
        "postgres_changes", 
        {event: "*", schema: "public", table: "exercise"}, 
        (payload) => {
          if(payload.eventType === "INSERT"){
            setExerciseList((prev) => [...prev, payload.new as checkExercise])
          }
          else if(payload.eventType === "DELETE"){
            const oldKey = payload.old.id
            setExerciseList((prev) => prev.filter( exercise => exercise.id !== oldKey))
          }  
          else if(payload.eventType === "UPDATE"){
            const updatedId = payload.new.id
            const updatedName = payload.new.exercise_name
            setExerciseList((prev) => prev.map( exercise => 
                exercise.id === updatedId ? 
                { ...exercise, exercise_name: updatedName }
                : exercise
            ))
        }
      })
      .subscribe((status) => {

  })

    return () => {
      channel.unsubscribe();
    };
  },[])

  useEffect(()=>{
    fetchData()
    fetchSession()
  },[])

  return (
    <>
    <AnimatePresence onExitComplete={onClose}>
    {visible && (
      <Box onClick={() => {setVisible(false)}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <motion.div
          layout
          onClick={(e) => {e.stopPropagation()}}
          className="md:h-[80%] relative bg-gray-800 rounded-xl w-[90%] h-[50%] flex flex-col shadow-md shadow-gray-700"
          key='exercise'
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Box className='flex gap-3 m-5 place-items-center'>
              <button onClick={() => {setVisible(false)}}>
                <ArrowBackIosIcon sx={{fontSize:28, ...hoverScaleMui(1.2)}}/>
              </button>
              <h1 className='text-[2rem] mb-2 font-bold mt-2'>Exercise</h1>
          </Box>
          <Box className='bg-transparent rounded-xl w-full h-full flex flex-col overflow-scroll scrollbar-hide pb-28 px-2'>
             <AnimatePresence>
              {exerciseList.map((list) => (
                <motion.div
                  layout
                  key={list.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  <WorkoutList handleRemove={handleRemove} exercise_id={list.id} remove_key={list.id} key={list.id} title={list.exercise_name} edit='Record' page={2} />
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
          <button onClick={(e) => {handleOpenNewExercise(e)}} className='md:w-[70%] absolute bottom-0 left-1/2 -translate-x-1/2 py-5'>
            <AddNewButton title='New Exercise'/>
          </button>
        </motion.div>
      </Box>
    )}
  </AnimatePresence>
  {openAddNew && (
     <AddNew onClose={() => {setOpenAddNew(false)}} handleAddNew={handleNewExercise} vis={openAddNew} 
          title='Manage Exercise' section='Exercise Name' placeholder='Enter An Exercise'
          />
  )}
  </>
  )
}
