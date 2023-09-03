'use client'
import Taskform from '@/app/_components/Taskform'
import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '@/app/_contexts/AuthContext'
import { AppContext } from '@/app/_contexts/AppContext'
import Image from 'next/image'

import axios from 'axios'

//Libraries
import Pulse from '@/app/_components/Pulse'
import TasksContainer from '@/app/_components/TasksContainer'
import AddButton from '@/app/_components/AddButton'
import { User } from '@/app/_types/User'
import { Project } from '@/app/_types/Project'
import { Task } from '@/app/_types/Task'
import Link from 'next/link'
import MiniLoader from '@/app/_components/MiniLoader'

export default function page({params}) {
  const {setMiddleware} = useContext(AuthContext);
  const {showTaskForm, setShowTaskForm, user, users, setError} = useContext(AppContext);

  
  const {project} = params;
  
  const [projectData, setProjectData] = useState<Project>();
  const [tasks, setTasks] = useState<Task[]>();
  const [projectManager, setProjectManager] = useState<User>();
  const [resources, setResources] = useState([]);
  const [completed, setCompleted] = useState<boolean>();
  const [miniLoader, setMiniLoader] = useState<boolean>(false);

  //Set middleware & get initial data when component mounts
  useEffect(() => {
    setMiddleware('auth');
    getSingleProject(project);
    getTasksOfProject(project);
  }, []);

  
  //Filter out project manager when users and projectdata(user_id) are fetched.
  useEffect(() => {
    if(projectData && users){
    getUserById(projectData.user_id)
    }
  }, [projectData, users]);


  //Gets user by given id.
  const getUserById = (id: number) => {
    const ProjManager: User = users.find(user => user.id == id);
    setProjectManager(ProjManager);
  }

  
  async function getSingleProject(project: number) {
  const tk = localStorage.getItem("Collab-app");
  let headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-type': 'application/json',
  'Authorization': `Bearer ${tk}`
  };
    axios.get(`${process.env.API_URL}api/projects/${project}`, {
      headers: headers
    }).then((response) => {
      setProjectData(response.data);
      // console.log(response.data)
  }).catch(error => {
    console.log(error)
      setError(error.message);
  })
}


  async function getTasksOfProject(projectId: number) {
    const tk = localStorage.getItem("Collab-app");
    let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-type': 'application/json',
    'Authorization': `Bearer ${tk}`
    };
    axios.get(`${process.env.API_URL}api/project/${projectId}/tasks`, {
      headers: headers
    }).then((response) => {
      setTasks(response.data);
      // console.log(response.data)
    }).catch(error => {
      console.log(error)
        setError(error);
    })

  }

const addTask = () => {
  setShowTaskForm(true)
}

const refresHandler = () => {
    //Empty tasks array, for beter ux when data comes back
    setTasks(null);
  const tk = localStorage.getItem("Collab-app");
  let headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-type': 'application/json',
  'Authorization': `Bearer ${tk}`
  };
  setMiniLoader(true)
  getTasksOfProject(project);
  setMiniLoader(false)
}

  return (
    <main className='project-detail'>
      {miniLoader && <MiniLoader/>}
      <div className="container">
        <div className="go-back">
          <Link href={'/dashboard'}>Go to Dashboard</Link>
        </div>
        <button onClick={refresHandler} className='btn-3 btn-fixed'>Refresh</button>
        <div className="heading project-heading">
          <div className="name">
          <h3>Project:</h3>
          <h3>{projectData ? projectData.name : <Pulse/>}</h3>
          </div>
          {(user && projectData) && (projectData.user_id == user.id) &&
            <div className="button-wrapper">
              <AddButton btnText={"Add Task +"} onClickHandler={addTask}/>
            </div>
          }
        </div>
        <div className="project-details">
          <div className="project-image">
            <Image src={`/project${Math.floor(Math.random() * 3) + 1}.jpg`} 
              width='1000'
              height='1000'
              alt={`project image`} placeholder="blur"
              blurDataURL={'/logo.png'}
              priority={true}
            />
          </div>
          <div className="details">
            <div className="detail-group">
            <h5 className='heading'>Project Manager: </h5>
            <h5 className='info'>{projectManager ? projectManager.name : <Pulse/>}</h5>
            </div>
            <div className="detail-group">
            <h5 className='heading'>Deadline: </h5>
            <h5 className='info'>{projectData ? projectData.deadline : <Pulse/>}</h5>
      
            </div>
            <div className="detail-group">
            <h5 className='heading'>Progress: </h5>
            <h5 className='info'>{projectData ? 'Yes' : <Pulse/>}</h5>
            </div>
            {/* <h5 className='heading'>Completed: </h5>
            <input id='completed' name='completed' type="checkbox" className='checkbox-input'onChange={handleChange}
                            value='checked' checked={completed}
                          /> */}
          </div>
        </div>
        <TasksContainer tasks={tasks}/>
      </div>

      {/*Show form for creating / editing entity */}
      {showTaskForm && <Taskform projectId={parseInt(project)}/>}
    </main>
  )
}

