'use client'
// React
import { useEffect, useState } from 'react';
// Supabase
import { supabase } from '@/supabase-client';
// Mui
import { Box } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import TextField from '@mui/material/TextField';
// Framer Motion
import { motion, AnimatePresence } from 'framer-motion'
// Date-fns
import { formatDistanceToNow, format } from 'date-fns';
// Component
import { AddNewButton } from '../AddNewButton'
import ExerciseHistory from '../ExerciseHistory'
// Lib
import { hoverScaleMui } from '../../lib/hoverScaleMui'
import { muiTextArea } from '../../lib/muiTextArea'

interface check {
    exerciseName: string
    exercise_id: number
    vis: boolean
    onClose: () => void
}

interface checkExercise {
    id: number
    exercise_log: {
        id: number
        created_at: any
        rep: number
        weight: number
    }[]
}

interface checkRecordList {
    id: number
    created_at: any
    rep: number
    weight: number
    time: string
}

export default function ManageExercise({exerciseName, exercise_id, vis, onClose}: check) {

    const [visible, setVisible] = useState<boolean>(vis)
    const [recordList, setRecordList] = useState<checkRecordList[]>([])
    const [enterRep, setEnterRep] = useState<number>(0)
    const [enterWeight, setEnterWeight] = useState<number>(0)
    const [userId, setUserId] = useState<string>()

    const fetchSession =  async () => {
        const CurrentSession = await supabase.auth.getSession()
        const userSession = CurrentSession.data.session

        setUserId(userSession?.user.id)
    }

    const fetchData = async () => {
        const { error, data } = await supabase
          .from("exercise")
          .select(`
            id,
            exercise_log (
                id,
                created_at,
                rep,
                weight
            )
            `)
          .eq("id", exercise_id)
          .order("id", {ascending: true})
    
        if (error) {
          console.error(error.message)
          return
        }
        else {
          const rawData = data as checkExercise[]
          const newLogs = rawData.flatMap(raw => raw.exercise_log)
          const finalLog = newLogs.map(raw => ({...raw, time:"0:00"}))
          setRecordList(convertTime(finalLog))
        }
    }

    const convertTime = (table: checkRecordList[]) => {
        const converted = table.map(raw => ({
        ...raw,
        time: format(raw.created_at, "HH:mm"),
        created_at: formatDistanceToNow(new Date(raw.created_at), {addSuffix: true})
        }))
        return(converted)
    }

    const handleNewLogs = async (e: any) => {
        e.preventDefault()

        if (!enterRep && !enterWeight) return

        const { error } = await supabase
            .from("exercise_log")
            .insert({exercise_id: exercise_id, user_id: userId, rep: enterRep, weight: enterWeight})

        if (error) {
            console.log(error)
        }
    }

    const handleRemove = async (id: number) => {
        const { error } = await supabase
            .from("exercise_log")
            .delete()
            .eq("id", id)

        if (error) {
            console.error(error.message)
            return
        }
    }

    const handleUpdate = async (id: number, rep: number, weight: number) => {
        const { error } = await supabase
            .from("exercise_log")
            .update({rep: rep, weight: weight})
            .eq("id" , id)
            .single()

        if (error){
            console.log(error)
            return
        }

    }

    useEffect(()=>{
        const channel = supabase.channel(`exercise_log-channel-${exercise_id}`)
        channel
            .on(
            "postgres_changes", 
            {event: "*", schema: "public", table: "exercise_log"}, 
            (payload) => {
                if(payload.eventType === "INSERT"){
                    const newLogs = [payload.new as checkRecordList]
                    const converted = convertTime(newLogs)
                    setRecordList((e) => [...e, ...converted])
                }
                else if(payload.eventType === "DELETE"){
                    const oldKey = payload.old.id
                    setRecordList((prev) => prev.filter( exercise => exercise.id !== oldKey))
                }
                else if(payload.eventType === "UPDATE"){
                    const updatedId = payload.new.id
                    const updatedRep= payload.new.rep
                    const updatedWeight = payload.new.weight
                    setRecordList((prev) => prev.map( exercise => 
                       exercise.id === updatedId ? 
                       { ...exercise, rep: updatedRep, weight: updatedWeight }
                       : exercise
                    ))
                }
            })
            .subscribe()

        return () => {
            channel.unsubscribe();
        };
  },[])

    useEffect(() => {
        fetchSession()
        fetchData()
    },[])

  return (
    <AnimatePresence onExitComplete={onClose}>
    {visible && (
        <Box onClick={() => {setVisible(false)}} className='fixed inset-0 z-50 h-screen flex place-items-center justify-center text-white bg-transparent'>
            <motion.div
                layout
                onClick={(e) => {e.stopPropagation()}}
                className="md:h-[80%] relative bg-gray-800 rounded-xl w-[90%] h-[60%] flex flex-col shadow-md shadow-gray-700"
                key='manage'
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <Box className='flex gap-3 m-5 place-items-center'>
                    <button onClick={() => {setVisible(false)}}>
                    <ArrowBackIosIcon sx={{fontSize:28, ...hoverScaleMui(1.2)}}/>
                    </button>
                    <h1 className='text-[1.5rem] mb-2 font-bold mt-2'>{exerciseName}</h1>
                </Box>
                <Box component='form' onSubmit={(e) => {handleNewLogs(e)}} className='md:justify-center flex gap-5 px-5'>
                    <Box className='flex flex-col gap-1'>
                        <Box component='label' htmlFor='rep' className='ml-1 text-lg'>Enter Rep</Box>
                        <TextField
                            onChange={(e) => {setEnterRep(Number(e.target.value))}}
                            id='rep'
                            placeholder='0'
                            slotProps={{
                                htmlInput:{
                                    type:'number',
                                    min: 0
                                }
                            }}
                            sx={{
                                '& input': {
                                    padding: {
                                        xs: "8px",
                                        md: "16px"
                                    }
                                },
                                ...muiTextArea
                            }}
                        />
                    </Box>
                    <Box className='flex flex-col gap-1'>
                        <Box component='label' htmlFor='weight' className='ml-1 text-lg'>Enter Weight</Box>
                        <TextField
                            onChange={(e) => {setEnterWeight(Number(e.target.value))}}
                            id='weight'
                            placeholder='0'
                            slotProps={{
                                htmlInput:{
                                    type:'number',
                                    step: "any",
                                    min: 0
                                }
                            }}
                             sx={{
                                '& input': {
                                    padding: {
                                        xs: "8px",
                                        md: "16px"
                                    }
                                },
                                ...muiTextArea
                            }}
                        />
                    </Box>
                    <button className='md:w-[50%] absolute bottom-0 left-1/2 -translate-x-1/2 py-5' type='submit'>
                        <AddNewButton title='Record New Exercise'/>
                    </button>
                </Box>               
                <Box className='bg-transparent rounded-xl w-full h-full flex flex-col overflow-scroll scrollbar-hide pb-24 px-6 py-5'>
                    <Box className='flex flex-col h-full w-full overflow-scroll scrollbar-hide gap-3'>
                        <AnimatePresence>
                            {recordList.map((list) => (
                                <motion.div
                                    layout
                                    key={list.id}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <ExerciseHistory removeList={handleRemove} upDateList={handleUpdate} key={list.id} exercise_id={list.id} rep={list.rep} weight={list.weight} 
                                                    date={list.created_at} time={list.time}/>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </Box>
                </Box>
            </motion.div>
        </Box>
    )}
   </AnimatePresence>
  )
}
