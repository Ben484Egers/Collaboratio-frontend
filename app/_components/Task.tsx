import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'

import Link from 'next/link';
import Pulse from './Pulse';
import { User } from '../_types/User';
import { Project } from '../_types/Project';
import { AppContext } from '../_contexts/AppContext';
import { FaEdit } from 'react-icons/fa';

export default function Task(task) {
    const {users, setError, user, setShowTaskForm, setSharedTask} = useContext(AppContext);

    const [AssignedBy, setAssignedBy] = useState<User>();
    const [project, setProject] = useState<Project>();

    const {id, name, deadline, user_id ,assigned_by_id, project_id, completed} = task.task;

    useEffect(() => {
    const tk = localStorage.getItem("Collab-app");
    let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-type': 'application/json',
    'Authorization': `Bearer ${tk}`
    };
        axios.get(`${process.env.API_URL}api/projects/${project_id}`, {
            headers: headers
          }).then((response) => {
            setProject(response.data);
            // console.log(response.data)
        }).catch(error => {
          console.log(error)
            setError(error.message);
        })

    }, [])

  //Gets user by given id.
  const getUserById = (id: number) => {
    const ProjManager: User = users.find(user => user.id == id);
    setAssignedBy(ProjManager);
  }
  //Filter out project manager when users are fetched.
  useEffect(() => {
    if(users) {
      getUserById(assigned_by_id);
    }
  }, [users])

    const editHandler = () => {
      setSharedTask(task.task);
      setShowTaskForm(true);
    }

  return (
    <div className='card-body'>
        {(user && assigned_by_id == user.id) && <FaEdit size="2.5rem" className="edit-icon" onClick={editHandler}/>}
        <div className="container">
            <div className="title task-info">
                <h5 className='heading'>Task: </h5>
                <h5 className='info'>{name}</h5>
            </div>
            <div className="title task-info">
                <h5 className='heading'>Project: </h5>
                <h5 className='info'>{project ? project.name : <Pulse/>}</h5>
            </div>
            <div className="title task-info">
                <h5 className='heading'>Deadline: </h5>
                <h5 className='info'>{deadline}</h5>
            </div>
            <div className="title task-info">
                <h5 className='heading'>Assigned by: </h5>
                <h5 className='info'>{AssignedBy ? AssignedBy.name : <Pulse/>}</h5>
            </div>
            <div className="title task-info">
                <h5 className='heading'>Completed: </h5>
                <h5 className='info'>{completed == 0 ? "No" : "Yes"}</h5>
            </div>
        </div>
        <div className="button-wrapper">
          <Link href={`/task/${id}`} className='main-btn'>View Details
          </Link>

        </div>
    </div>
  )
}
