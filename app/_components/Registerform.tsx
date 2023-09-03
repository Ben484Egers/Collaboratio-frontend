'use client'
import React, { useContext ,useEffect, useState } from 'react'
import SubmitButton from './SubmitButton';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { AuthContext } from '../_contexts/AuthContext';
import { User } from '../_types/User';
import Link from 'next/link';
import { AppContext } from '../_contexts/AppContext';


export default function Registerform() {
    const {registerHandler, setLoading} = useContext(AuthContext);
    const {setError} = useContext(AppContext);

//Formik Logic
const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        },
        
    //Validate form
    validationSchema: Yup.object({
        name: Yup.string().min(4, "Name must be a minimum of 4 characters long").required("*Fullname is Required"),
        email: Yup.string().email("Invalid email").required("*Email is Required"),
        password: Yup.string().required("*Please enter your password").min(8, 'Password should be at least 8 characters long.'),
        password_confirmation: Yup.string().required("*Please retype your password").oneOf([Yup.ref('password')], 'Passwords do not match.')
    }),
    
    onSubmit: async (values) => {
        
        const payLoad: User = {
            name: values.name,
            email: values.email,
            password: values.password,
            password_confirmation: values.password_confirmation
        }

        const response = registerHandler(payLoad).catch( (error) => {
            setError("Something went wrong.., Please try again")
            setLoading(false);

        })
    }

    });
    
    return (
        <div id="register-form" className='form-wrapper register-form'>
            <div className="container">
                <div className="heading">
                    <h3>Make Your Account 💼🤝</h3>
                </div>
                <form className='form' onSubmit={formik.handleSubmit} method='POST'>
                    <div className="form-control">
                        <label htmlFor="full-name">Full name:</label>
                        <input id='name' name='name' type="text" autoComplete='given-name' required className='name-input'
                            onChange={formik.handleChange}
                            value={formik.values.name}
                        />
                        {(formik.touched.name && formik.errors.name) && 
                            <p className='form-error'>
                                {formik.errors.name}
                            </p>
                        }
                    </div>
                    <div className="form-control">
                        <label htmlFor="email">Email</label>
                        <input id='email' name='email' type="email" autoComplete='email' required className='email-input'
                            onChange={formik.handleChange}
                            value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email && 
                            <p className='form-error'>
                                {formik.errors.email}
                            </p>
                        }
                    </div>

                    <div className="form-control">
                        <label htmlFor="password">Password:</label>
                        <input id='password' name='password' type="password" autoComplete='current-password' required className='password-input'
                            onChange={formik.handleChange}
                            value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password && 
                            <p className='form-error'>
                                {formik.errors.password}
                            </p>
                        }
                    </div>
                    <div className="form-control">
                        <label htmlFor="password_confirmation">Password Confirmation:</label>
                        <input id='password_confirmation' name='password_confirmation' type="password" autoComplete='of' required className='password-input'
                            onChange={formik.handleChange}
                            value={formik.values.password_confirmation}
                        />
                        {formik.touched.password_confirmation && formik.errors.password_confirmation && 
                            <p className='form-error'>
                                {formik.errors.password_confirmation}
                            </p>
                        }
                    </div>
                    <div className='button-wrapper wrapper-full'>
                        <SubmitButton btnText={"Register"}/>
                        <Link href={'/login'} className='btn-3'>Login?</Link>

                    </div>
                </form>
            </div>
        </div>
    )
}