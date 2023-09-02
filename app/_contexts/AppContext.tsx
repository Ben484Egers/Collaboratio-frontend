import {Dispatch, SetStateAction, createContext, useState, useContext, useEffect } from 'react';

import axios from 'axios'
import { User } from '../_types/User';
import { Project } from '../_types/Project';
import { Task } from '../_types/Task';
import { AuthContext } from './AuthContext';
import Loader from '../_components/Loader';

export interface AppContextInterface {
  user: User, 
  searchTerm: string,
  showTaskForm: boolean,
  showProjectForm: boolean,
  sharedProject: Project,
  projects: Project[],
  sharedTask: Task,
  usersTasks: Task[],
  users: User[],
  error: string | undefined,
  setUser: Dispatch<SetStateAction<User>>,
  setUsers: Dispatch<SetStateAction<User[]>>,
  setSearchTerm: Dispatch<SetStateAction<string>>,
  setShowTaskForm: Dispatch<SetStateAction<boolean>>,
  setShowProjectForm: Dispatch<SetStateAction<boolean>>,
  setSharedProject: Dispatch<SetStateAction<Project>>,
  setProjects: Dispatch<SetStateAction<Project[]>>,
  setSharedTask: Dispatch<SetStateAction<Task>>,
  setUsersTasks: Dispatch<SetStateAction<Task[]>>,
  setError: Dispatch<SetStateAction<string | undefined>>,
  createProject: Function,
  updateProject: Function,
  deleteProject: Function,
  createTask: Function,
  updateTask: Function,
  deleteTask: Function,
  getUserInfo: Function,

}

export const AppContext = createContext<Partial<AppContextInterface>>({});

export default function AppProvider({children}) {
    const {loading, setLoading,  setCheckAuth} = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [showProjectForm, setShowProjectForm] = useState<boolean>(false);
    const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
    const [user, setUser] = useState<User>();
    const [users, setUsers] = useState<User[]>();
    const [sharedProject, setSharedProject] = useState<Project>();
    const [sharedTask, setSharedTask] = useState<Task>();
    const [projects, setProjects] = useState<Project[]>();
    const [usersTasks, setUsersTasks] = useState<Task[]>();
    const [error, setError] = useState<string | undefined>();
    

    useEffect(() => {
      getUserInfo()
      getUsers()

    }, [])    

    //Get user info
    const getUserInfo = async () => {
        const tk = localStorage.getItem("Collab-app");
      let headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-type': 'application/json',
        'Authorization': `Bearer ${tk}`
        };
      await axios.get(`${process.env.API_URL}api/user/info`, {
          headers: headers
      }).then((response) => {
        setUser(response.data);
        // console.log(response.data);
    }).catch( error => {
      //If user not found, check for authentication
      setCheckAuth(true);
    })
  }

  //Get all users
  const getUsers = async () => {
    const tk = localStorage.getItem("Collab-app");
  let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-type': 'application/json',
    'Authorization': `Bearer ${tk}`
    };
  await axios.get(`${process.env.API_URL}api/users`, {
      headers: headers
  }).then((response) => {
    setUsers(response.data);
}).catch( error => {
  //If user not found, check for authentication
  setCheckAuth(true);
})
}


    //Create a project
    const createProject = async (payload: Project) => {
        const tk = localStorage.getItem("Collab-app");
        let headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-type': 'application/json',
        'Authorization': `Bearer ${tk}`
        };
    // await csrf()
          await axios.post(`${process.env.API_URL}api/projects`, payload , {
              headers: headers
          }).then((response) => {
          setShowProjectForm(false);
          return response.data;
        }).catch( error => {
          console.log(error);
        })
      }

      //Update Project
      const updateProject = async (payload: Project) => {    
        const tk = localStorage.getItem("Collab-app");
        let headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-type': 'application/json',
        'Authorization': `Bearer ${tk}`
        };
        axios.put(`${process.env.API_URL}api/projects/${payload.id}`,payload, {
          headers: headers
        }).then((response) => {
          setShowProjectForm(false);
          setSharedProject(undefined);
        }).catch(error => {
          console.log(error)
            setError(error);
        })
    
      }

      //Delete a project.
  const deleteProject = async(id: number) => {
    const tk = localStorage.getItem("Collab-app");
    let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-type': 'application/json',
    'Authorization': `Bearer ${tk}`
    };

    axios.delete(`${process.env.API_URL}api/projects/${id}`, {
      headers: headers
    }).then((response) => {
        setSharedProject(undefined)
  }).catch(error => {
    console.log(error)
      setError(error);
  })
  }

      //Create a task
      const createTask = async (payload: Task) => {
        const tk = localStorage.getItem("Collab-app");
        let headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-type': 'application/json',
        'Authorization': `Bearer ${tk}`
        };
    // await csrf()
          await axios.post(`${process.env.API_URL}api/tasks`, payload , {
              headers: headers
          }).then((response) => {
          setLoading(false);
          setShowTaskForm(false);
        }).catch( error => {
          console.log(error);
        })
    }

    //Update A Task
    const updateTask = async (payload: Task) => {    
      const tk = localStorage.getItem("Collab-app");
      let headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-type': 'application/json',
      'Authorization': `Bearer ${tk}`
      };
      axios.put(`${process.env.API_URL}api/tasks/${payload.id}`,payload, {
        headers: headers
      }).then((response) => {
        setShowTaskForm(false);
        setSharedTask(undefined);
      }).catch(error => {
        console.log(error)
          setError(error);
      })
  
    }

  //Delete a task.
  const deleteTask = async(id: number) => {
  const tk = localStorage.getItem("Collab-app");
  let headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-type': 'application/json',
  'Authorization': `Bearer ${tk}`
  };

  axios.delete(`${process.env.API_URL}api/tasks/${id}`, {
    headers: headers
  }).then((response) => {
    setSharedTask(undefined)
}).catch(error => {
  console.log(error)
    setError(error);
})
}

    
    return (
        <AppContext.Provider value={{users, setUsers, usersTasks, setUsersTasks, projects, setProjects, sharedTask, setSharedTask, updateTask, deleteTask, deleteProject, updateProject, sharedProject, setSharedProject,createTask, showTaskForm, setShowTaskForm, getUserInfo, user, setUser, createProject, searchTerm, setSearchTerm, showProjectForm, setShowProjectForm, error, setError}}>
            {loading && <Loader/>}
            {children}
        </AppContext.Provider>
    )
}