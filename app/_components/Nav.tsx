'use client'

import React, {useContext, useState} from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaBars, FaTimesCircle} from 'react-icons/fa'

import { AuthContext } from '../_contexts/AuthContext'


export default function Nav() {
  const [showMenu, setShowMenu] = useState(false);
  const {logoutHandler, loggedIn} = useContext(AuthContext);
  
  return (
    <div className='nav'>
      <div className="branding">
        <h2>Collaboratio</h2>

      </div>

      <div className= {`list ${!showMenu ? 'hide': ""}`}
        onClick={() => setShowMenu(false)}>
            <ul className= {`${!loggedIn && 'hidden'}`}>
            <li><Link href="/dashboard" scroll={true} className={usePathname().match('/dashboard') ? 'active' : " "}>Dashboard</Link></li>
            <li><Link href="/calendar" scroll={true} className={usePathname().match('/calendar') ? 'active' : " "}>Calendar</Link></li>
            <li><Link href="/login" onClick={logoutHandler}>Logout</Link></li>
          </ul>        
      </div>
      {/* Toggle hamburger and X menu icon*/}
      {
      showMenu && <FaTimesCircle size="2.5rem" className={`${!loggedIn && 'hide'}  menuI`} 
        onClick={() => setShowMenu(!showMenu)}/>
      }
      {
      !showMenu && <FaBars size="2.5rem" className={`${!loggedIn && 'hide'} menuI`}
          onClick={() => setShowMenu(!showMenu)}/>
      }
      
      {/* BG with opacity on navbar */}
      <div className='nav-box'></div>
    </div>
  )
}
