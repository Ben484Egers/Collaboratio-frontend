'use client'
import React, { useContext ,useEffect } from 'react'
import Registerform from '@/app/_components/Registerform'
import { AuthContext } from '../_contexts/AuthContext';
import SkeletonSection from '../_components/SkeletonSection';


export default function page() {
  const {loading, setMiddleware} = useContext(AuthContext);
  useEffect(() => {
    setMiddleware('guest');
  }, []);

  if(loading) return <SkeletonSection/>
  
  return (
    <div>
        <Registerform/>
    </div>
  )
}
