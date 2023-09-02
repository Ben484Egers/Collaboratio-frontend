'use client'
import React, { useContext, useEffect, useState } from 'react'
import SubmitButton from './SubmitButton';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { AuthContext } from '../_contexts/AuthContext';
import { User } from '../_types/User';
import Link from 'next/link';


export default function Loginform() {

    const [newCommer, setNewCommer] = useState(false);
    
    const {loginHandler} = useContext(AuthContext);

    useEffect(() => {
        if (localStorage.getItem("Collab-app") == undefined){
            setNewCommer(true)
        }
    }, [])

//   if(loading) return <>Loading ....</>


  //Formik Logic
  const formik = useFormik({
    initialValues: {
        email: '',
        password: '',
    },

    //Validate form
    validationSchema: Yup.object({
        email: Yup.string().email("Invalid email").required("*Email is Required"),
        password: Yup.string().required("*Please enter your password"),
    }),
    
    onSubmit: async (values) => {
        const payLoad: User = {
            email: values.email,
            password: values.password
        }        

        try {
            const response = await loginHandler(JSON.stringify(payLoad));
        } catch (e) {
            const error = e  as AxiosError;
            alert(error);
        }

    },

    });

    return (
        <div id="login-form" className='form-wrapper login-form'>
            <div className="container">
    
                <div className="heading">
                    {
                        newCommer ? <h3>Welcome, 🖐🖐🖐</h3> : <h3>Welcome Back, 🖐🖐🖐</h3>
                    }
                    
                </div>
                <form className='form' onSubmit={formik.handleSubmit} method='POST'>
                    <div className="form-control">
                        <label htmlFor="email">Email</label>
                        <input id='email' name='email' type="email" autoComplete='email' required className='email-input' onChange={formik.handleChange}
                            value={formik.values.email}
                        />
                        {(formik.touched.email && formik.errors.email) && 
                            <p className='form-error'>
                                {formik.errors.email}
                            </p>
                        }
                    </div>

                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input id='password' name='password' type="password" autoComplete='current-password' required className='password-input'onChange={formik.handleChange}
                            value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password && 
                            <p className='form-error'>
                                {formik.errors.password}
                            </p>
                        }
                    </div>
                    <div className='button-wrapper wrapper-full'>
                        <SubmitButton btnText={"Login"}/>
                        <Link href={'/register'} className='btn-3'>Register?</Link>
                    </div>
                </form>
            </div>
        </div>
  )
}
