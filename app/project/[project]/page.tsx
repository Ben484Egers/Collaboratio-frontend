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

export default function page({params}) {
  const {setMiddleware} = useContext(AuthContext);
  const {showTaskForm, setShowTaskForm, user} = useContext(AppContext);

  
  const {project} = params;
  
  const [users, setUsers] = useState<User[]>();
  const [projectData, setProjectData] = useState<Project>();
  const [tasks, setTasks] = useState<Task[]>();
  const [projectManager, setProjectManager] = useState<User>();
  const [isOwner, setIsOwner] = useState<boolean>();
  const [resources, setResources] = useState('');
  const [completed, setCompleted] = useState<boolean>();
  const [dataComplete, setDataComplete] = useState<boolean>(false);
  const [error, setError] = useState<string>();


  const handleChange = (e) => {
    setCompleted(e.target.checked);
  }

  
  async function getSingleProject(project) {
    // setLoading(true)
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
      // setLoading(false)
  })
}


  async function getTasksOfProject(projectId: number) {
    // setLoading(true)
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
      // setLoading(false)
    }).catch(error => {
      console.log(error)
        setError(error.message);
        // setLoading(false)
    })

  }
  

  async function getProjectManager(userId: number) {
    const tk = localStorage.getItem("Collab-app");

    let headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-type': 'application/json',
      'Authorization': `Bearer ${tk}`
    };
  
    //Get projectmanager/user of project
    axios.get(`${process.env.API_URL}api/users/${userId}`, {
      headers: headers
    }).then((response) => {
      setProjectManager(response.data);
      console.log(response.data);
    }).catch(error => {
      console.log(error)
      setError(error);
    })
  }


  // async function getUsers(userId: number) {
  //   // setLoading(true)
  //   const tk = localStorage.getItem("Collab-app");
  //   let headers = {
  //   'X-Requested-With': 'XMLHttpRequest',
  //   'Content-type': 'application/json',
  //   'Authorization': `Bearer ${tk}`
  //   };
  //   axios.get(`${process.env.API_URL}api/users`, {
  //     headers: headers
  //   }).then((response) => {
  //     setUsers(response.data)
  //     console.log(response.data)
  //     setLoading(false)
  // }).catch(error => {
  //   console.log(error)
  //     setError(error.message);
  //     // setLoading(false)
  // })

  // }

  useEffect(() => {
    setMiddleware('auth');
    getSingleProject(project);
    getTasksOfProject(project);
  }, []);

  useEffect(() => {
    if(!projectData){
      return;
    }
    getProjectManager(projectData.user_id).then(() => setDataComplete(true));
  }, [projectData]);


const addTask = () => {
  setShowTaskForm(true)
}

const onRefresh = () => {
  const tk = localStorage.getItem("Collab-app");
  let headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-type': 'application/json',
  'Authorization': `Bearer ${tk}`
  };
  getTasksOfProject(project);

}

  return (
    <main className='project-detail'>
      <div className="container">
        <div className="go-back">
          <Link href={'/dashboard'}>Go to Dashboard</Link>
        </div>
        <button onClick={onRefresh} className='btn-3 btn-fixed'>Refresh</button>
        <div className="heading project-heading">
          <div className="name">
          <h3>Project:</h3>
          <h3>{projectData ? projectData.name : <Pulse/>}</h3>
          </div>
            <div className="button-wrapper">
              <AddButton btnText={"Add Task +"} onClickHandler={addTask}/>
            </div>

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
        {/* <div className="button-wrapper wrapper-full">
          <MainButton btnText={'Save'} onClickHandler={updateProject}/>
        </div> */}

      </div>
      {showTaskForm && <Taskform projectId={project}/>}
    </main>
  )
}

