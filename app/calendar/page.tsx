'use client'
import {useContext, useEffect, useState } from 'react'
import Calendar from '../_components/Calendar'
import { AuthContext } from '../_contexts/AuthContext'
import { AppContext } from '../_contexts/AppContext'
import { Project } from '../_types/Project'
import { Task } from '../_types/Task'
import axios from 'axios'
import { Event } from '../_types/Event'
import MiniLoader from '../_components/MiniLoader'
import Notifications from '@/app/_components/Notifications'


export default function calendar() {
    const {setMiddleware} = useContext(AuthContext);
    const {showProjectForm, showTaskForm, getUserInfo, user, setError} = useContext(AppContext);
     const [projects, setProjects] = useState<Project[]>();
    const [tasks, setTasks] = useState<Task[]>();
    const [tasksAndProjects, setTasksAndProjects] = useState([]);
    const [events, setEvents] = useState([]);
    const [miniLoader, setMiniLoader] = useState<boolean>(false);

  
  useEffect(() => {
    setMiniLoader(true);
    setMiddleware('auth');
    const tk = localStorage.getItem("Collab-app");
    let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-type': 'application/json',
    'Authorization': `Bearer ${tk}`
    };

    getTasksOfUser(headers);
    getProjects(headers);
  }, []);

    useEffect(() => {
    if(projects !== undefined) {
      setTasksAndProjects([...projects, ...tasks]);
      setMiniLoader(false);
    }

  }, [projects]);


    useEffect(() => {
    if(tasksAndProjects !== undefined) {
      // console.log(events);
      let eventArray : Event[] = []
      tasksAndProjects.map(element => {
        const tempEvent: Event = {id: element.id, title: element.name , allDay: true, start: element.deadline, end: element.deadline,
        link: element.project_id == undefined ? `/project/${element.id}`: `/task/${element.id}`}

        eventArray = [...eventArray, tempEvent];
      })
      setEvents(eventArray);
    }
  }, [tasksAndProjects]);



  //Get tasks of loggedin user first
  const getTasksOfUser = async(headers) => {
    axios.get(`${process.env.API_URL}api/tasks`, {
      headers: headers
    }).then((response) => {
      setTasks(response.data);
      // console.log(response.data);
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



  return (
    <main>
      {miniLoader && <MiniLoader/>}
      <Notifications/>
      <Calendar events={events}/>
    </main>
  )
}
