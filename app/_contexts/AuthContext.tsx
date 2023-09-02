import {Dispatch, MouseEventHandler, SetStateAction, createContext, useEffect, useState } from 'react';

import { Router } from 'next/router';
import {useRouter} from 'next/navigation'
import axios from 'axios'
import { User } from '../_types/User';
import { Project } from '../_types/Project';
import { Task } from '../_types/Task';

export interface AuthContextInterface {
  token: string,
  loading: boolean,
  loggedIn: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setLoggedIn: Dispatch<SetStateAction<boolean>>,
  setMiddleware: Dispatch<SetStateAction<string>>,
  setCheckAuth: Dispatch<SetStateAction<boolean>>,
  loginHandler: Function,
  registerHandler: Function,
  logoutHandler: MouseEventHandler<HTMLAnchorElement>
}


export const AuthContext = createContext<Partial<AuthContextInterface>>({});

export default function AuthProvider({children}) {
  
    const [token, setToken] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [checkAuth, setCheckAuth] = useState<boolean>(false);
    const [middleware, setMiddleware] = useState<string | null>(null);
    const [authCheckDone, setAuthCheckDone] = useState<boolean>(false);
    
    const router = useRouter();

    // const csrf = () => axios.get(`${process.env.API_URL}sanctum/csrf-cookie`);
  
    //Wil start up on loading screen, to do checks
    //Look for token, if found, setToken,
    //If there is no token, stop loading en confirm that user is logged out 
    useEffect(() => {
      const tokenFromLocalStorage = localStorage.getItem("Collab-app");
      //If token is found, start authentication check.
      if (tokenFromLocalStorage !== 'undefined' && tokenFromLocalStorage !== null) {
        setToken(tokenFromLocalStorage);
        setCheckAuth(true);      
      }
  
      //If token is not found, confirm user is logged out, finished checking authentication en stop loadingscreen.
      if (tokenFromLocalStorage === null || tokenFromLocalStorage == "undefined" || tokenFromLocalStorage == undefined || tokenFromLocalStorage == '') {
          setLoggedIn(false);
          setAuthCheckDone(true);
          setLoading(false);
      }
    }, []);
      
      //Check if current token (from localStorage) is valid (to backend)
      //Check if the user has authorization for the current page
      //The middleware is set on pageload.
      //When a user logs in or signs up, check for redirection.
      useEffect(() => {
        isLoggedIn().then(() => middlewareCheck(middleware));
      }, [checkAuth, middleware, loggedIn]);

        //Check if token from localstorage is valid
        const isLoggedIn = async () => {
          if(checkAuth) {
            const tk = localStorage.getItem("Collab-app");
            let headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${tk}`
            };
          await axios.get(`${process.env.API_URL}api/users/check`, {
              headers: headers
            }).then((response) => {
              setLoggedIn(true);
              setAuthCheckDone(true);
            }).catch( error => {
              setLoggedIn(false);
              setAuthCheckDone(true);
              setLoading(false);
            })
          }
        }

    const middlewareCheck = (middleware: string) => {
      //if Authorization check is not completed yet, return.
      if(middleware == null || !authCheckDone) {
        return;
      }
      //If user has the right credentials for current page
      if(middleware == 'guest' && !loggedIn || middleware == 'auth' && loggedIn) {
          setLoading(false);
          return;
      }
      //If user is logged in and on a guest route, redirect to dashboard
      if(middleware == 'guest' && loggedIn) {
        router.push('/dashboard');
        Router.events.on("routeChangeComplete", (url) => {
          setLoading(false);
        })
        return;
      } 
      //If user is not logged in and on a authorized route, redirect to login page
      if(middleware == 'auth' && !loggedIn ){
        router.push('/login');
        Router.events.on("routeChangeComplete", (url) => {
          setLoading(false);
        })
        return;
      }
    }
  
  
    //Register function
    const registerHandler = async (payLoad: User) => {
      setLoading(true);
      let headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-type': 'application/json',
      }
      // await csrf()
      axios.post(`${process.env.API_URL}api/users/register`, payLoad, {
      headers: headers
      }).then((response) => {
          setToken(response.data.token)
          localStorage.setItem("Collab-app", response.data.token);
          setLoggedIn(true)
      }).catch( error => {    
          // if(error.response.status != 422) throw error
          return (error.message);
      })
    }
  
    //Login function
    const loginHandler = async (payLoad: User) => {
      let headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-type': 'application/json',
      };
        setLoading(true);
    // await csrf()
        await axios.post(`${process.env.API_URL}api/users/authenticate`, payLoad , {
            headers: headers
        }).then((response) => {
        setToken(response.data.token);
        setLoggedIn(true);
        localStorage.setItem("Collab-app", response.data.token);
      }).catch( error => {
        console.log(error.data.message);
        setLoading(false);
      })
    }
      
    //Logout function
    const logoutHandler = async() => {
      setLoading(true);
      setAuthCheckDone(false);
      const tk = localStorage.getItem("Collab-app");
      let headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-type': 'application/json',
      'Authorization': `Bearer ${token}`
      };
    // await csrf()
    await axios.post(`${process.env.API_URL}api/logout`, null , {
      headers: headers}).then((response) => {
        setToken('undefined');
        // localStorage.setItem("Collab-app", 'undefined');
        setLoggedIn(false);
      }).catch(error => {
        console.log(error.message);
      })
      setAuthCheckDone(true);
    }
  
    return (
        <AuthContext.Provider value={{registerHandler, logoutHandler, loginHandler, setMiddleware ,token, loading, setLoading, loggedIn, setLoggedIn, setCheckAuth}}>
            {children}
        </AuthContext.Provider>
    )
}