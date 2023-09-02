'use client'
import SubmitButton from './SubmitButton';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { AxiosError } from 'axios';
import { AppContext } from '../_contexts/AppContext';
import {useContext, useState } from 'react'
import {FaTimesCircle } from 'react-icons/fa'
import { Project } from '../_types/Project';
import MiniLoader from './MiniLoader';
import DeleteButton from './DeleteButton';


function Projectform() {
    const {createProject, setShowProjectForm, sharedProject, setSharedProject, updateProject, deleteProject, user} = useContext(AppContext);
    const [miniLoading, setMiniLoading] = useState<boolean>(false);

    let name:string = ''
    let deadline:string = ''
    let details:string = ''
    let userId:number = 0
    let completed

  if(sharedProject !== undefined) {
    name = sharedProject.name,
    deadline = sharedProject.deadline,
    details = sharedProject.description,
    userId = sharedProject.user_id,
    completed = sharedProject.completed
  }
  
    //Formik Logic
  const formik = useFormik({

    initialValues: {
        name: name,
        deadline: deadline,
        details: details,
        user: userId,
        resources: [],
        completed: completed,
    },

    //Validate form
    validationSchema: Yup.object({
        name: Yup.string().min(4, "Name must be a minimum of 4 characters long").required("*Projectname is Required"),
        deadline: Yup.date(),
        // detials: Yup.string().min(10, 'Could you spare some more tea? A minimum of 10 characters.').required("*Please give some details about the project"),
        // completed: Yup.boolean()
    }),
    
    onSubmit: async (values) => {
        setMiniLoading(true);

        let projectCompleted: boolean
        //Check if project is completed
            if(values.completed == undefined) {
                projectCompleted = false;
            } else{
                projectCompleted = true;
            }
            
        //Set user ID, in case of creation
            if(user) {
                userId = user.id;
            }
        let payload: Project = {
            name: values.name,
            deadline: values.deadline,
            description: values.details,
            user_id: userId,
            completed: projectCompleted
        }
        try {
            if(sharedProject !== undefined)  {
                payload = {...payload, id: sharedProject.id}
                const response = await updateProject(payload);
            } else {
                const response = await createProject(JSON.stringify(payload));
            }   
        } catch (e) {
            const error = e  as AxiosError;
            alert(error.message);
        }

        setMiniLoading(false);
    },
});

const deleteHandler = async() =>{
    setMiniLoading(true);
    const result = await deleteProject(sharedProject.id)
    setShowProjectForm(false)
    setMiniLoading(false);

    return result;
}

const hideProjectform =() =>{
    setShowProjectForm(false);
    setSharedProject(undefined);
}


  return (
    <div id="project-form">
        <div className="form-wrapper">
            {miniLoading && <MiniLoader/>}
        <div className="container">
            <div className="cancel" onClick={ hideProjectform}>
                <FaTimesCircle size="2rem" className='cancel-btn'/>
            </div>
            <div className="heading">
                { sharedProject ? 
                    <h3>Edit Project ⚙🛠</h3>
                    :
                    <h3>Create A Project 🦺🔧</h3>
                }
            </div>
            <form className='form' onSubmit={formik.handleSubmit} method='POST'>
                <div className="form-control">
                    <label htmlFor="name">Project Name:</label>
                    <input id='name' name='name' type="text" required className='name-input' onChange={formik.handleChange}
                            value={formik.values.name}/>
                    {(formik.touched.name && formik.errors.name) && 
                        <p className='form-error'>
                            {formik.errors.name}
                        </p>
                    }
                </div>
                <div className="form-control">
                    <label htmlFor="deadline">Deadline:</label>
                    <input id='deadline' name='deadline' type="date" className='deadline-input' onChange={formik.handleChange}
                            value={formik.values.deadline}/>
                    {(formik.touched.deadline && formik.errors.deadline) && 
                        <p className='form-error'>
                            {formik.errors.deadline}
                        </p>
                    }
                </div>

                <div className="form-control">
                    <label htmlFor="details">Details:</label>
                    <textarea name="details" id="details" className='details-input'
                    placeholder='Details/ Beschrijving van project...'
                    onChange={formik.handleChange}
                            value={formik.values.details}/>
                    {(formik.touched.details && formik.errors.details) && 
                        <p className='form-error'>
                            {formik.errors.details}
                        </p>
                    }
                </div>

                {/* <select onChange={formik.handleChange}
                            value={formik.values.completed} id='users'>
                    {users.map((user, index) => {
                        return <option key={index}>
                                    {user}
                                </option>
                    })}
                </select> 
                />
                {(formik.touched.user && formik.errors.user) && 
                    <p className='form-error'>
                        {formik.errors.user}
                    </p>
                }
                */}

                <div className="form-control">
                    <label htmlFor="resources">Resources:</label>
                    <input id='resources' name='resources' type="file" className='resources-input' multiple onChange={formik.handleChange}
                        value={formik.values.resources}/>
                </div>

                <div className="form-control checkbox-control">
                    <label htmlFor="completed" className='checkbox-label'>Completed:</label>
                    <input id='completed' name='completed' type="checkbox" className='checkbox-input' onChange={formik.handleChange}
                            value='checked' />
                    {/* {(formik.touched.completed && formik.errors.completed) && 
                        <p className='form-error'>
                            {formik.errors.completed}
                        </p>
                    } */}
                </div>
                
                { sharedProject ? 
                    <div className='button-wrapper wrapper-full'>
                        <SubmitButton btnText='Edit Project'/>
                        <DeleteButton btnText={'Delete'} onClickHandler={deleteHandler}/>
                    </div>
                    :
                    <div className='button-wrapper'>
                        <SubmitButton btnText={"Create Project"}/>
                    </div>
                }
            </form>
        </div>
        {/*   <ToastContainer /> */}
    </div>
    </div>
        
  )
}

export default Projectform