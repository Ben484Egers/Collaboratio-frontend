import {Dispatch, SetStateAction, createContext, useState, useContext, useEffect } from 'react';

import axios from 'axios'
import { User } from '../_types/User';
import { Project } from '../_types/Project';
import { Task } from '../_types/Task';
import { AuthContext } from './AuthContext';
import Loader from '../_components/Loader';


import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  succesMessage: string | undefined,
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
  setSuccesMessage: Dispatch<SetStateAction<string | undefined>>,
  createProject: Function,
  updateProject: Function,
  deleteProject: Function,
  createTask: Function,
  updateTask: Function,
  deleteTask: Function,
  getUserInfo: Function,
  uploadResource: Function,

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
    const [succesMessage, setSuccesMessage] = useState<string | undefined>();
    
    //Get all users, and loggedin user when layout first mounts.
    //Its neccesary data for ownership etc..
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
            notify("Project Created Succesfully 🎨👔")
          setShowProjectForm(false);
          return response.data;
        }).catch( error => {
          notifyError("Could not create project. Check ur fields constraints. 🚩🚨")
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
          // console.log(response)
          notify("Project Updated Succesfully 🧩⚙")
        }).catch(error => {
          console.log(error)
          notifyError("Could not update project. Check ur fields constraints. 🚩🚨")
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
      // console.log(response)
      notify("Project Deleted Succesfully 🧨🗑")
    }).catch(error => {
    console.log(error)
    notifyError("Could not delete project. Check ur fields constraints. 🚩🚨")
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
            // console.log(response)
            notify("Task Created Succesfully 🎨👔")
            return response;
        }).catch( error => {
          console.log(error);
          notifyError("Could not create task. Check ur fields constraints. 🚩🚨")
          return error;
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
        // console.log(response)
        notify("Task Updated Succesfully 🔨⚙")
      }).catch(error => {
        console.log(error)
        notifyError("Could not update task. Check ur fields constraints. 🚩🚨")
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
    // console.log('succesfully deleted')
    notify("Task Deleted Succesfully 🔗🗑")
  }).catch(error => {
  console.log(error)
  notifyError("Could not delete task. Check ur fields constraints. 🚩🚨")
  return
})
}

//Upload a resource
const uploadResource = async (payload) => {
  const tk = localStorage.getItem("Collab-app");
  let headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-type': 'application/json',
  'Authorization': `Bearer ${tk}`
  };
// await csrf()
    await axios.post(`${process.env.API_URL}api/resources`, payload , {
        headers: headers
    }).then((response) => {
      console.log(response.data)
    return response.data;
  }).catch( error => {
    console.log(error);
  })
}

//When succesMessage or Error is present in de appcontext, this wil run.
useEffect(() => {
  if(succesMessage) {
    notify(succesMessage);
    return
  }
  if(error) {
    notifyError(error);
  }
}, [succesMessage, error])

//Toastify
const timer = 5000

  const notify = (succesMessage: string) => {
    toast.success( succesMessage, {
      position: "top-right",
      autoClose: timer,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    setSuccesMessage(undefined)
  }

  const notifyError = (errorMessage: string) => {
    toast.error(errorMessage, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored"
    });
    setError(undefined);
  }

    
    return (
        <AppContext.Provider value={{succesMessage, setSuccesMessage ,uploadResource, users, setUsers, usersTasks, setUsersTasks, projects, setProjects, sharedTask, setSharedTask, updateTask, deleteTask, deleteProject, updateProject, sharedProject, setSharedProject,createTask, showTaskForm, setShowTaskForm, getUserInfo, user, setUser, createProject, searchTerm, setSearchTerm, showProjectForm, setShowProjectForm, error, setError}}>
            {loading && <Loader/>}
            {children}
        </AppContext.Provider>
    )
}