'use client'
import SearchBar from '@/app/_components/SearchBar'
import ProjectsContainer from '@/app/_components/ProjectsContainer'
import TasksContainer from '@/app/_components/TasksContainer'
import Projectform from '../_components/Projectform'
import Taskform from '../_components/Taskform'
import { Project } from '../_types/Project'
import { Task } from '../_types/Task'
import MiniLoader from '../_components/MiniLoader'

import axios from 'axios'
import {useContext, useEffect, useState } from 'react'
import { AuthContext } from '../_contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { AppContext } from '../_contexts/AppContext'


export default function dashboard() {

  const {token, setMiddleware} = useContext(AuthContext);
  const {showProjectForm, showTaskForm, searchTerm, getUserInfo, user, setError} = useContext(AppContext  );
  
  const [projects, setProjects] = useState<Project[]>();
  const [tasks, setTasks] = useState<Task[]>();
  const [username, setUsername] = useState<string>(undefined);
  const [miniLoader, setMiniLoader] = useState<boolean>(false);

  const router = useRouter();

  //Get tasks of loggedin user first
  const getTasksOfUser = async(headers) => {
    axios.get(`${process.env.API_URL}api/tasks`, {
      headers: headers
    }).then((response) => {
      setTasks(response.data);
      // console.log(response.data)
  }).catch(error => {
    console.log(error)
    setError(error.message);
  })
  }

  //Get all Projects of organization
  const getProjects = async(headers) => {
    axios.get(`${process.env.API_URL}api/projects`, {
      headers: headers
    }).then((response) => {
      setProjects(response.data);
      // console.log(response.data)
  }).catch(error => {
    console.log(error)
      setError(error.message);
  })
  }

  useEffect(() => {
    setMiddleware('auth');
    
    const tk = localStorage.getItem("Collab-app");
    let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-type': 'application/json',
    'Authorization': `Bearer ${tk}`
    };

    getTasksOfUser(headers);
    getProjects(headers);

    getUserInfo();
  }, []);

  //If user is definded, setUsername
  useEffect(() => {
    if(user){
      setUsername(user.name)
    } 
  }, [user])

  const onRefresh = () => {
    setMiniLoader(true);
    const tk = localStorage.getItem("Collab-app");
    let headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-type': 'application/json',
      'Authorization': `Bearer ${tk}`
    };
    
    getTasksOfUser(headers);
    getProjects(headers);
    getUserInfo();
    
    setMiniLoader(false);
  }


  //Search handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    router.push(`/search?search=${searchTerm}`)
  }

  return (
    <main className='dashboard container'>
      {miniLoader && <MiniLoader/>}
    <SearchBar searchHandler={handleSubmit}/>
      <div className="welcome">
      <h2>Welcome, {!username ? '' : username}</h2>
      <button onClick={onRefresh} className='btn-3 btn-fixed'>Refresh</button>
      </div>
      <TasksContainer tasks={tasks}/>
      <ProjectsContainer projects={projects}/>
      {showProjectForm && <Projectform/>}
      {showTaskForm && <Taskform projectId={undefined}/>}
    </main>
  )
}
