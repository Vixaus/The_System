'use client'
// React
import { useEffect, useState } from 'react'
// Next
import { useRouter } from 'next/navigation'
// Supabase
import { supabase } from '../../supabase-client'
// Framer Motion
import { AnimatePresence, motion } from 'framer-motion'
// Mui
import { Box } from '@mui/material'
// Components
import NavBar from '../components/NavBar'
import WorkoutList from '../components/WorkoutList'
import { AddNewButton } from '../components/AddNewButton'
import AddNew from '../components/Popup/AddNew'
// Lib
import { checkSession } from '../lib/checkSession'

interface checkRoutine{
  id: number
  routine_name: string
}

const Page = () => {

  const router = useRouter()
  const [openAddNew, setOpenAddNew] = useState<boolean>(false)
  const [routineList, setRoutineList] = useState<checkRoutine[]>([])
  const [userId, setUserId] = useState<any>()
  const [userEmail, setUserEmail] = useState<any>("")

  const fetchSession =  async () => {
    const CurrentSession = await supabase.auth.getSession()
    const userSession = CurrentSession.data.session

    setUserEmail(userSession?.user.email)
    setUserId(userSession?.user.id)

    if (!userSession) {
      router.push('/login')
    }
  }

  const fetchData = async () => {
    const { error, data } = await supabase
      .from("routine")
      .select("*")
      .order("id", {ascending: true})

    if (error) {
      console.error(error.message)
      return
    }
    else {
      setRoutineList(data)
    }
  }

  const handleOpenNewRoutine = async (e: any) => {
    e.preventDefault()
    setOpenAddNew(true)
    console.log(openAddNew)
  }

  const handleAddNew =  async (routine_name: string) => {
    const { error } = await supabase
      .from("routine")
      .insert({user_id: userId, email: userEmail, routine_name: routine_name})

    if (error) {
      console.error(error.message)
      return
    }
  }

  const handleRemoveRoutine = async (id: number) => {
    const { error } = await supabase
      .from("routine")
      .delete()
      .eq("id", id)

    if (error) {
      console.error(error.message)
      return
    }
  }

  useEffect(()=>{
    const channel = supabase.channel(`routine-channel`)
    channel
      .on(
        "postgres_changes", 
        {event: "*", schema: "public", table: "routine"}, 
        (payload) => {
          if(payload.eventType === "INSERT"){
            setRoutineList((prev) => [...prev, payload.new as checkRoutine])
          }
          else if(payload.eventType === "DELETE"){
            const oldKey = payload.old.id
            setRoutineList((prev) => prev.filter( exercise => exercise.id !== oldKey))
          }
          else if(payload.eventType === "UPDATE"){
                    const updatedId = payload.new.id
                    const updatedName = payload.new.routine_name
                    setRoutineList((prev) => prev.map( routine => 
                       routine.id === updatedId ? 
                       { ...routine, routine_name: updatedName }
                       : routine
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

  checkSession()

  return (
    <>
    <NavBar/>
    <AnimatePresence>
        <motion.div
          layout
          className='md:ml-[75px] h-[calc(100vh-150px)] px-8 py-2 text-white
                      md:h-[calc(100vh-100px)]'
          key='page'
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >

        <h1 className='text-[2rem] font-bold mb-2'>Routine</h1>

        <Box className='relative h-full bg-gray-800 rounded-xl'>
          <Box className='md:p-4 h-full flex flex-col gap-2 overflow-scroll scrollbar-hide pb-36 p-2'>
            <AnimatePresence>
              {routineList.map((list) => (
                <motion.div
                  layout
                  key={list.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  <WorkoutList key={list.id} remove_key={list.id} handleRemove={handleRemoveRoutine} title={list.routine_name} page={1}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

          </Box>
          <button onClick={(e) => {handleOpenNewRoutine(e)}} className='md:w-[70%] absolute bottom-0 left-1/2 -translate-x-1/2 py-5 '>
            <AddNewButton title='New Routine'/>
          </button>
        </Box>
      </motion.div>
    </AnimatePresence>
    
    {openAddNew && (
       <AddNew onClose={() => {setOpenAddNew(false)}} handleAddNew={handleAddNew} vis={openAddNew} 
       title='Configure Routine' section='Routine Name' placeholder='Enter A Routine Name'/>
    )}
    </>
  )
}

export default Page