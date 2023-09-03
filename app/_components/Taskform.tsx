'use client'
import React, {useState, useContext, useEffect} from 'react';
import SubmitButton from './SubmitButton';
import { useFormik } from 'formik';
import * as Yup from "yup";
import  { AxiosError } from 'axios';
import {FaTimesCircle } from 'react-icons/fa'
import { AppContext } from '../_contexts/AppContext';
import { Task } from '../_types/Task';
import MiniLoader from './MiniLoader';
import DeleteButton from './DeleteButton';
import { User } from '../_types/User';


function Taskform({projectId}: {projectId?:number}) {
    const {users, createTask, user, setShowTaskForm, deleteTask, setSharedTask, sharedTask, updateTask} = useContext(AppContext);
    const [miniLoading, setMiniLoading] = useState<boolean>(false);
    const [taskTakerId, setTaskTakerId] = useState<number>();
    const [taskTakerName, setTaskTakerName] = useState<string>();

    //Get id & name of task taker when component mounts (when updating)
    //If sharedTask is defined.
    useEffect(() => {
        if(sharedTask){
            let name = getNameOfTaskTaker(sharedTask.user_id);
            setTaskTakerName(name);
            setTaskTakerId(sharedTask.user_id);
        }
    }, [sharedTask])


      //Change in user/tasktaker
    const onOptionChangeHandler = (event) => {
        const taskTakerName = event.target.value;
        setTaskTakerName(taskTakerName);
        const taskTaker: User = getUserId(taskTakerName);
        setTaskTakerId(taskTaker.id);
    }

    //Gets a users Id, by name passed in.
    const getUserId = (name: string): User => {
        return users.find(user => user.name == name);
    }

    //Gets name of a user, by id passed in.
    const getNameOfTaskTaker = (id: number): string => {
        let taskTaker = users.find(user => user.id == id);
        return taskTaker.name;
    }
    
    //Initializing properties.
      let name:string = ''
      let deadline:string = ''
      let details:string = ''
      let pm_id:number
      let completed
  
    //If its updating, set properties of task to the ones of the sharedTask
    if(sharedTask !== undefined) {
      name = sharedTask.name,
      deadline = sharedTask.deadline,
      details = sharedTask.description,
      pm_id = sharedTask.assigned_by_id,
      completed = sharedTask.completed
    }
    
      //Formik Logic
    const formik = useFormik({
        initialValues: {
            name: name,
            deadline: deadline,
            details: details,
            taskTaker: taskTakerId,
            completed: completed,
        },
    
        //Validate form
        validationSchema: Yup.object({
            name: Yup.string().min(4, "Name must be a minimum of 4 characters long").required("*Projectname is Required"),
        }),
        
        onSubmit: async (values) => {
            setMiniLoading(true);
            let taskCompleted: boolean;
        //Check if project is completed
            if(values.completed == undefined) {
                taskCompleted = false;
            } else{
                taskCompleted = true;
            } 

        let payload: Task = {
            name: values.name,
            //projectId wil be passed in when creating, if undefined (when updating), use the one of the sharedTask.
            project_id: projectId ? projectId : sharedTask.project_id,
            description: values.details,
            deadline: values.deadline,
            //User responsible
            user_id: taskTakerId,
            //Logged in user
            assigned_by_id: user && user.id,
            completed: taskCompleted,
        }

        //When updating
        if(sharedTask !== undefined)  {
            payload = {...payload, id: sharedTask.id}
            const response = await updateTask(payload);
        } else {
            //When creating
            const response = await createTask(payload);
        }
        
        setTimeout(() => {
            setShowTaskForm(false);
            setMiniLoading(false);
            setSharedTask(undefined);
        }, 1500);
          
    },
    });


    const deleteHandler = async() =>{
        setMiniLoading(true);
        const result = await deleteTask(sharedTask.id)

        setTimeout(() => {
            setShowTaskForm(false);
            setMiniLoading(false);
            setSharedTask(undefined);
        }, 1500);

        return result;

    }

    const hideTaskForm = () => {
        setShowTaskForm(false);
        setSharedTask(undefined);
    }

  return (
    <div id="task-form">
        <div className='form-wrapper'>
        {miniLoading && <MiniLoader/>}
        <div className="container">
            <div className="cancel" onClick={hideTaskForm}>
                <FaTimesCircle size="2rem" className='cancel-btn'/>
            </div>
            <div className="heading">
                { sharedTask ? 
                    <h3>Edit Task ⚙🛠</h3>
                    :
                    <h3>Create A Task 🚧📈</h3>
                }
                
            </div>
            <form className='form' onSubmit={formik.handleSubmit} method='POST'>
                <div className="form-control">
                    <label htmlFor="name">Task:</label>
                    <input id='name' name='name' type="text" required className='task-input' onChange={formik.handleChange}
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
                    placeholder='Details/ Beschrijving van project...'onChange={formik.handleChange}
                    value={formik.values.details}/>
            {(formik.touched.details && formik.errors.details) && 
                <p className='form-error'>
                    {formik.errors.details}
                </p>
            }
                </div>
                <div className="form-control">
                    <label htmlFor="taskTaker">Task Taker:</label>
                <select onChange={onOptionChangeHandler} id='users'>
                    {users && users.map((entity, index) => {
                        return <option selected={entity.name == taskTakerName} key={index}>
                                    {entity.name}
                                </option>
                    })}
                </select> 
                </div>
                {/* {(formik.touched.user && formik.errors.user) && 
                    <p className='form-error'>
                        {formik.errors.user}
                    </p>
                } */}
               
                <div className="form-control checkbox-control">
                    <label htmlFor="completed" className='checkbox-label'>Completed:</label>
                    <input id='completed' name='completed' type="checkbox" className='checkbox-input' onChange={formik.handleChange}
                            value={formik.values.completed}/>
                </div>
                { sharedTask ? 
                    <div className='button-wrapper wrapper-full'>
                        <SubmitButton btnText='Edit Task'/>
                        <DeleteButton btnText={'Delete'} onClickHandler={deleteHandler}/>
                    </div>
                    :
                    <div className='button-wrapper'>
                        <SubmitButton btnText={"Create Task"}/>
                    </div>
                }
            </form>
        </div>
        </div>
        {/*   <ToastContainer /> */}
    </div>

  )
}

export default Taskform