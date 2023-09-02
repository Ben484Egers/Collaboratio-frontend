'use client'
import React, {useEffect, useState, useContext} from 'react'
import SearchBar from '@/app/_components/SearchBar'
import ProjectsContainer from '@/app/_components/ProjectsContainer'
import TasksContainer from '@/app/_components/TasksContainer'
import axios from 'axios'
import { useSearchParams, useRouter } from 'next/navigation'
import { AppContext } from '../_contexts/AppContext'
import { Project } from '../_types/Project'
import { Task } from '../_types/Task'
import { AuthContext } from '../_contexts/AuthContext'

export default function page() {

    const {setMiddleware, setLoading} = useContext(AuthContext);
    const {searchTerm} = useContext(AppContext);

    const [projects, setProjects] = useState<Project[]>();
    const [tasks, setTasks] = useState<Task[]>();
    const [filteredTerm, setFilteredTerm] = useState<string>();

    const router = useRouter();
  
    let term = useSearchParams().get('search');
    let projectSearchUrl: string;
    let tasksSearchUrl: string;
    
    useEffect(() => {
      setMiddleware('auth');
      if(term == undefined || term == null){
        term = ' '
      }
      fetchProjectsAndTasks(term).then(() => setLoading(false)).then(() => router.push(`/search`)); 
  }, [])


    async function fetchProjectsAndTasks(searchValue:string) {
        setProjects(null)
        setTasks(null)
        if(searchValue == null) return;
        const search = searchValue.trim();
        setFilteredTerm(searchValue.trim())

        if(searchValue.trim() == ''){
          tasksSearchUrl = `${process.env.API_URL}api/tasks/all`
          projectSearchUrl =  `${process.env.API_URL}api/projects`
        } else {
          tasksSearchUrl = `${process.env.API_URL}api/tasks/search/${search}`
          projectSearchUrl = `${process.env.API_URL}api/projects/search/${search}`
        }

        //Headers
        const tk = localStorage.getItem("Collab-app");
        let headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-type': 'application/json',
        'Authorization': `Bearer ${tk}`
        };
        
        //Search for tasks and projects matching filtered search term
        await axios.get(tasksSearchUrl, {
          headers: headers
        }).then((response) => {
          setTasks(response.data);
          // console.log(response.data);
        }).catch( error => {
          console.log("search failed");
        })

        await axios.get(projectSearchUrl, {
          headers: headers
        }).then((response) => {
          setProjects(response.data);
          // console.log(response.data);
        }).catch( error => {
          console.log("search failed");
        })
    
    }
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        fetchProjectsAndTasks(searchTerm).then(() => setLoading(false));
      }

      const onRefresh = () => {
        fetchProjectsAndTasks(searchTerm)
      }


  return (
    <main className='container'>
    <SearchBar searchHandler={handleSubmit}/>
    <div className="searchterm">
      <h5>Showing results for: "{filteredTerm}"</h5>
    </div>
    <button onClick={onRefresh} className='btn-3 btn-fixed'>Refresh</button>

    <TasksContainer tasks={tasks}/>
    <ProjectsContainer projects={projects}/>
    
  </main>
  )
}
