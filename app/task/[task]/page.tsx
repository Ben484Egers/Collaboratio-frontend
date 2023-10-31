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
import { User } from '@/app/_types/User'

export default function page({params}) {
  const {setMiddleware} = useContext(AuthContext);
  const {users, setError, setSuccesMessage} = useContext(AppContext);
  
  const {task} = params;
  
  const [assignedBy, setAssignedBy] = useState<User>();
  const [assignedById, setAssignedById] = useState<number>();
  const [projectName, setProjectName] = useState<string>();
  const [projectId, setProjectId] = useState<number>();
  const [taskData, setTaskData] = useState<Task>();
  const [completed, setCompleted] = useState<boolean>();
  const [dataComplete, setDataComplete] = useState<boolean>(false);
  const [miniLoader, setMiniLoader] = useState<boolean>(false);

  
  //On mount: set middleware & fetch task details
  useEffect(() => {
    setMiddleware('auth');
    getSingleTask(task)
  }, [])
  
  //When taskdetails are fetched & project_id is defined, fetch Project for name, 
  // For better UX, make sure task is fetched, before we set the completed state. 
  useEffect(() => {
    if(!projectId){
      return
    }

    getSingleProject(projectId)
    setCompleted(taskData && taskData.completed);
  }, [projectId])

  //Filter out project manager when users are fetched.
  //Gets Id from the task which is fetched.
  useEffect(() => {
    if(assignedById && users) {
      getUserById(assignedById);
      setDataComplete(true);
    }
    
  }, [assignedById])
  
  //Gets user by given id.
  const getUserById = (id: number) => {
    const ProjManager: User = users.find(user => user.id == id);
    setAssignedBy(ProjManager);
  }

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
  })
  }

  const updateTaskCompletion = async () => {
     
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
      completed ? setSuccesMessage("Task Completed ✔🤝") : setSuccesMessage("Task Updated ⚙")
      setCompleted(response.data.completed)
      setMiniLoader(false)
  }).catch(error => {
    console.log(error)
      setError("Could not update task. Check if you have the rights to the task. 🚩🚨");
      setMiniLoader(false)
  })
  }


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
        {miniLoader && <MiniLoader/> }
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
                  <h5 className='info'>{assignedBy ? assignedBy.name: <Pulse/>}</h5>
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
            <MainButton btnText={'Save'} onClickHandler={updateTaskCompletion}/>
          </div>
        </div>
      </div>
    </main>
  )
}
