'use client'
// React
import { ChangeEvent, useEffect, useState } from 'react'
// Next
import { useRouter } from 'next/navigation'
// Supabase
import { supabase } from '../../supabase-client'

interface Task {
  id: number,
  title: string,
  description: string,
  created_at: string,
  image_url: string
}

function TaskManager() {

  const [newTask, setNewTask] = useState<{}>({ title: "yo", description: "sup"})
  const [task, setTask] = useState<Task[]>([])
  const [newDescription, setNewDescription] = useState("")
  const [newSession, setNewSession] = useState<any>(null)
  const [userEmail, setUserEmail] = useState<any>(null)
  const [taskImage, setTaskImage] = useState<File | null>(null)
  const router = useRouter()

  const fetchSession =  async () => {
      const CurrentSession = await supabase.auth.getSession()
      const userSession = CurrentSession.data.session
      const userEmail = userSession?.user.email
      setUserEmail(userEmail)
      setNewSession(userSession)

      if (!userSession) {
        router.push('/login')
      }
  }

  const signOut = async () => {
      await supabase.auth.signOut()
      router.push('/login')
  }

  const fetchTask =  async () => {
    const { error, data} = await supabase.from("task").select("*").order("created_at", {ascending: true})

    if (error) {
      console.log(error.message)
      return
    }

    setTask(data)
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `${file.name}-${Date.now()}`

    const { error } = await supabase.storage
    .from("task-images")
    .upload(filePath, file)

    if (error){
      console.log(error.message)
      return null
    }
    
    const { data } = await supabase.storage.from("task-images").getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault()

    let imageUrl: string | null = null
    if (taskImage){
      imageUrl = await uploadImage(taskImage)
    }

    const { error } = await supabase.from("task").insert({...newTask, email: userEmail, image_url: imageUrl}).single()

    if (error) {
      console.error(error.message)
      return
    }

    setNewTask({ title: "", description: ""})
    fetchTask()
  }

  const deleteTask = async (id: number) => {

    const { error } = await supabase.from("task").delete().eq("id", id)

    if (error) {
      console.error(error.message)
      return
    }

    setNewTask({ title: "", description: ""})
  }

  const updateTask = async (id: number) => {

    const { error } = await supabase.from("task").update({description: newDescription}).eq("id", id)

    if (error) {
      console.error(error.message)
      return
    }

    setNewTask({ title: "", description: ""})
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length > 0){
      setTaskImage(e.target.files[0])
    }
  }

    useEffect(() => {
      fetchTask()
      fetchSession()

      const {data: authListener} = supabase.auth.onAuthStateChange((_event, session) => {
        setNewSession(session)
      }) 

      return () => {
        authListener.subscription.unsubscribe()
      }
    }, [])

    useEffect(() => {
      const channel = supabase.channel("tasks-channel")
      channel
        .on(
          "postgres_changes", 
          {event: "INSERT", schema: "public", table: "task"}, 
          (payload) => {
          const newTask = payload.new as Task
          setTask((prev) => [...prev, newTask])
      })
      .subscribe((status) => {
        console.log(status)
      })
    })
    return (
      <>
      <div className='flex flex-row-reverse p-2 bg-zinc-800'>
        <button onClick={() => signOut()} className=' px-4 bg-black rounded-md text-white p-1 cursor-pointer col-span-3'>Logout</button>
      </div>
      <div className="min-h-screen bg-[#121212] text-white flex justify-center items-center px-4">
        <div className="w-full max-w-md">
          <h2 className="text-center text-2xl font-bold mb-6">Task Manager CRUD</h2>
  
          {/* Form to add a new task */}
          <form className="space-y-3 mb-6">
            <input
              type="text"
              placeholder="Task Title"
              onChange={(e) => setNewTask((prev) => ({...prev, title: e.target.value}))}
              className="w-full bg-[#1e1e1e] border border-gray-600 text-white rounded px-3 py-2"
            />
            <textarea
              placeholder="Task Description"
              onChange={(e) => setNewTask((prev) => ({...prev, description: e.target.value}))}
              className="w-full bg-[#1e1e1e] border border-gray-600 text-white rounded px-3 py-2"
            />
            <input type="file" accept='image/*' onChange={handleFileChange}/>
            <button
              type="submit"
              className="w-full bg-black text-white font-semibold px-4 py-2 rounded hover:bg-gray-800"
              onClick={(e) => handleSubmit(e)}
            >
              Add Task
            </button>
          </form>
  
          {/* List of Tasks */}
          <ul className="space-y-4">
            {task.map((task) => (
            <li key={task.id} className="border border-gray-700 rounded p-4">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-300 mb-3">{task.description}</p>
              <img src={task.image_url} className='w-[100%] h-[100%] mb-4'></img>
              <div className="flex flex-col space-y-2">
                <textarea
                  placeholder="Updated description..."
                  className="bg-[#1e1e1e] border border-gray-600 text-white rounded px-3 py-2"
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                <div className="flex justify-between">
                  <button className="bg-black px-4 py-2 rounded hover:bg-gray-800" onClick={() => updateTask(task.id)}>Edit</button>
                  <button className="bg-black px-4 py-2 rounded hover:bg-gray-800" onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
              </div>
            </li>
            ))}
          </ul>
        </div>
      </div>
      </>
    );
  }
  
  export default TaskManager;
  