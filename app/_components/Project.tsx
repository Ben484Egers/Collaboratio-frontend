import Link from 'next/link';
import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios'
import Image from 'next/image';
import Pulse from './Pulse';
import { AppContext } from '../_contexts/AppContext';
import { User } from '../_types/User';
import { FaEdit } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Project } from '../_types/Project';


export default function Project({project}) {
  const {setError, user, setSharedProject, setShowProjectForm} = useContext(AppContext);
  const [projectManager, setProjectManager] = useState<User>();
  const [isOwner, setIsOwner] = useState<boolean>(false);

  // console.log(project)
  const {id, name, deadline, user_id, description, completed} = project;
  
  useEffect(() => {
    const tk = localStorage.getItem("Collab-app");
    let headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-type': 'application/json',
      'Authorization': `Bearer ${tk}`
    };
  
    //Get projectmanager/user of project
    axios.get(`${process.env.API_URL}api/users/${user_id}`, {
      headers: headers
    }).then((response) => {
      setProjectManager(response.data);
    }).catch(error => {
      console.log(error)
      setError(error.message);
    })

    if(user) {
      user_id == user.id && setIsOwner(true);
    }
  }, [])

  const editHandler = () => {
    setSharedProject(project);
    setShowProjectForm(true);
  }
  
  return (
    <div className='card-body project-body'>
      {isOwner && <FaEdit size="2.5rem" className="edit-icon" onClick={editHandler}/>}
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
