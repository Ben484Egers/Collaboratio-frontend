import Link from 'next/link';
import React, {useEffect, useState, useContext} from 'react'
import Image from 'next/image';
import Pulse from './Pulse';
import { AppContext } from '../_contexts/AppContext';
import { User } from '../_types/User';
import { FaEdit } from 'react-icons/fa';
import { Project } from '../_types/Project';


export default function Project({project}) {
  const {user, users, setSharedProject, setShowProjectForm} = useContext(AppContext);
  const [projectManager, setProjectManager] = useState<User>();

  const {id, name, deadline, user_id, description, completed} = project;
  
  //Gets user by given id.
  const getUserById = (id: number) => {
    const ProjManager: User = users.find(user => user.id == id);
    setProjectManager(ProjManager);
  }

  //Filter out project manager when users are fetched.
  useEffect(() => {
    if(users) {
      getUserById(user_id);
    }
  }, [users])

  const editHandler = () => {
    setSharedProject(project);
    setShowProjectForm(true);
  }
  
  return (
    <div className='card-body project-body'>
      {(user && user_id == user.id) && <FaEdit size="2.5rem" className="edit-icon" onClick={editHandler}/>}
        <div className="img">
        <Image src={`/project${Math.floor(Math.random() * 3) + 1}.jpg`} 
          width='1000'
          height='1000'
          alt={`project image`} placeholder="blur"
          blurDataURL={'/logo.png'}
          priority={true}
        />
        </div>
        <div className="details">
            <div className="container">
                <div className="title project-info">
                <h5 className='heading'>Project Name: </h5>
                <h5 className='info'>{name}</h5>
            </div>
            <div className="title project-info">
                <h5 className='heading'>Project Manager: </h5>
                <h5 className='info'>{projectManager ? projectManager.name : <Pulse/>}</h5>
            </div>
            <div className="title project-info">
                <h5 className='heading'>Deadline: </h5>
                <h5 className='info'>{deadline}</h5>
            </div>
            <div className="title project-info">
                <h5 className='heading'>Completed: </h5>
                <h5 className='info'>{completed == 0 ? "No" : "Yes"}</h5>
            </div>
            {/* <div className="title project-info">
                <h5 className='heading'>Progress: </h5>
                <h5 className='info progress'>
                  Progress
                </h5>
            </div> */}
        </div>
        <div className="button-wrapper">
        <Link href={`project/${id}`} className='main-btn'>View Details
        </Link>

        </div>
      </div>
    </div>
  )
}
