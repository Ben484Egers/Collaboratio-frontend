'use client'
import React, { useContext, useState, useEffect } from 'react'
import Loginform from '../_components/Loginform'
import { AuthContext } from '../_contexts/AuthContext'
import SkeletonSection from '../_components/SkeletonSection';
export default function login() {
  const {setMiddleware, loading} = useContext(AuthContext);

  useEffect(() => {
    setMiddleware('guest');
  }, []);

  if(loading) return <SkeletonSection/>

  return (
    <div className='wrapp'>
        <Loginform/>
    </div>
  )
}
