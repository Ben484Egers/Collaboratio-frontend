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
import MiniLoader from '../_components/MiniLoader'
import Taskform from '../_components/Taskform'
import Projectform from '../_components/Projectform'

export default function page() {

    const {setMiddleware, setLoading} = useContext(AuthContext);
    const {searchTerm, showProjectForm, showTaskForm} = useContext(AppContext);

    const [projects, setProjects] = useState<Project[]>();
    const [tasks, setTasks] = useState<Task[]>();
    const [filteredTerm, setFilteredTerm] = useState<string>();

    const router = useRouter();
  
    let term = useSearchParams().get('search');
    let projectSearchUrl: string;
    let tasksSearchUrl: string;
    
    //Set middleware, configure search term & search api by search term when component mounts.
    useEffect(() => {
      setMiddleware('auth');
      if(term == undefined || term == null){
        term = ' '
      }
      fetchProjectsAndTasks(term).then(() => setLoading(false)).then(() => router.push(`/search`)); 
  }, [])


    async function fetchProjectsAndTasks(searchValue:string) {
        //Empty projects and tasks array, for beter ux when data comes back
        setProjects(null)
        setTasks(null)
        //If searchvalue not present, return
        if(searchValue == null) return;

        //Set searchterm (shown on screen) to searchvalue
        setFilteredTerm(searchValue.trim())
        
        //Trim searchterm for api search.
        const search = searchValue.trim();
        
        if(searchValue.trim() == ''){
          //If searchterm = empty string, get all projects and tasks.
          tasksSearchUrl = `${process.env.API_URL}api/tasks/all`
          projectSearchUrl =  `${process.env.API_URL}api/projects`
        } else {
          //Else search bij searchterm
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

      const refreshHandler = () => {
        //Empty projects and tasks array, for beter ux when data comes back
        setProjects(null)
        setTasks(null)
        
        //Refetch intial data
        fetchProjectsAndTasks(searchTerm)
      }


  return (
    <main className='container'>
    <SearchBar searchHandler={handleSubmit}/>
    <div className="searchterm">
      <h5>Showing results for: "{filteredTerm}"</h5>
    </div>
    <button onClick={refreshHandler} className='btn-3 btn-fixed'>Refresh</button>
    <TasksContainer tasks={tasks}/>
    <ProjectsContainer projects={projects}/>

    {/*Show forms for editing entity */}
    {showTaskForm && <Taskform projectId={undefined}/>}
    {showProjectForm && <Projectform/>}
  </main>
  )
}
