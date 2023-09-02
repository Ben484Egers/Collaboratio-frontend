'use client'
import MainButton from '@/app/_components/MainButton'
import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '@/app/_contexts/AuthContext'
import axios from 'axios'

//Libraries
import Pulse from '@/app/_components/Pulse'
import Link from 'next/link'
import { AppContext } from '@/app/_contexts/AppContext'
import { Task } from '@/app/_types/Task'
import MiniLoader from '@/app/_components/MiniLoader'

export default function page({params}) {
  const {setMiddleware, setLoading} = useContext(AuthContext);
  
  const {task} = params;
  
  const [assignedByName, setAssignedByName] = useState<string>();
  const [assignedById, setAssignedById] = useState<number>();
  const [projectName, setProjectName] = useState<string>();
  const [projectId, setProjectId] = useState<number>();
  const [taskData, setTaskData] = useState<Task>();
  const [completed, setCompleted] = useState<boolean>();
  const [dataComplete, setDataComplete] = useState<boolean>(false);
  const [miniLoader, setMiniLoader] = useState<boolean>(false);
  const [error, setError] = useState<string>();


  const handleChange = (e) => {
    setCompleted(e.target.checked);
     
  }

  async function getSingleTask(task: Task) {
    const tk = localStorage.getItem("Collab-app");
    let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-type': 'application/json',
    'Authorization': `Bearer ${tk}`
    };
    axios.get(`${process.env.API_URL}api/tasks/${task}`, {
      headers: headers
    }).then((response) => {
      setTaskData(response.data);
      setProjectId(response.data.project_id)
  }).catch(error => {
    console.log(error)
      setError(error.message);
  })

  }
  const updateTask = async () => {
     
    const payload = {
      name: taskData && taskData.name,
      deadline: taskData && taskData.deadline,
      description: taskData && taskData.description,
      assigned_by_id: taskData && taskData.assigned_by_id,
      user_id: taskData && taskData.user_id,
      project_id: taskData && taskData.project_id,
      completed: completed,
      
    }

    const tk = localStorage.getItem("Collab-app");
    setMiniLoader(true)
    let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-type': 'application/json',
    'Authorization': `Bearer ${tk}`
    };

    axios.put(`${process.env.API_URL}api/tasks/${task}`,payload, {
      headers: headers
    }).then((response) => {
      setCompleted(response.data.completed)
      setMiniLoader(false)
  }).catch(error => {
    console.log(error)
      setError(error.message);
      setMiniLoader(false)
  })

  }
  async function getSingleProject(projectId: number) {
    // setLoading(true)
    const tk = localStorage.getItem("Collab-app");
    let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-type': 'application/json',
    'Authorization': `Bearer ${tk}`
    };
    axios.get(`${process.env.API_URL}api/projects/${projectId}`, {
      headers: headers
    }).then((response) => {
      setAssignedById(response.data.user_id);
      setProjectName(response.data.name);
  }).catch(error => {
    console.log(error)
      setError(error.message);
  })

  }
  async function getUser(userId: number) {
    const tk = localStorage.getItem("Collab-app");
    let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-type': 'application/json',
    'Authorization': `Bearer ${tk}`
    };
    axios.get(`${process.env.API_URL}api/users/${userId}`, {
      headers: headers
    }).then((response) => {
      setAssignedByName(response.data.name)
      setLoading(false)
  }).catch(error => {
    console.log(error)
      setError(error.message);
      // setLoading(false)
  })

  }

  useEffect(() => {
    setMiddleware('auth');
    getSingleTask(task)
  }, [])
  
  useEffect(() => {
    if(!projectId){
      return
    }
    setCompleted(taskData && taskData.completed)
    getSingleProject(projectId)
  }, [projectId])
  
  useEffect(() => {
    if(!assignedById){
      return
    }
  getUser(assignedById).then(() => setDataComplete(true))
  
}, [assignedById])


  return (
    <main className='task-detail'>
      <div className="container">
        <div className="go-back">
          <Link href={'/dashboard'}>Go to dashboard</Link>
        </div>
        <div className="heading">
          <h3>Task:</h3>
        </div>
        <div className="task-detail-body">
          <div className="info-group">
            <div className="title task-info">
                  <h5 className='heading'>Task: </h5>
                  <h5 className='info'>{dataComplete ? taskData.name : <Pulse/>}</h5>
            </div>
              <div className="title task-info">
                  <h5 className='heading'>Project: </h5>
                  <h5 className='info'>{dataComplete ? projectName: <Pulse/>}</h5>
              </div>
              <div className="title task-info">
                  <h5 className='heading'>Deadline: </h5>
                  <h5 className='info'>{dataComplete ? taskData.deadline: <Pulse/>}</h5>
              </div>
              <div className="title task-info">
                  <h5 className='heading'>Assigned by: </h5>
                  <h5 className='info'>{dataComplete ? assignedByName: <Pulse/>}</h5>
              </div>
              <div className="title task-info">
                  <h5 className='heading'>Details: </h5>
                  <h5 className='info'>{dataComplete ? taskData.description: <Pulse/>}</h5>
              </div>
              <div className="title task-info">
                  <h5 className='heading'>Completed: </h5>
                  <div className='info'>
                  <input id='completed' name='completed' type="checkbox" className='checkbox-input'onChange={handleChange}
                            value='checked' checked={completed}
                            />

                  </div>
              </div>
          </div>

          <div className="button-wrapper wrapper-full">
            <MainButton btnText={'Save'} onClickHandler={updateTask}/>
          </div>
        </div>
      </div>
      {miniLoader && <MiniLoader/> }
    </main>
  )
}
