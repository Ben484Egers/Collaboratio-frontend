'use client'
import './globals.scss'

import AuthProvider from './_contexts/AuthContext';
import Nav from './_components/Nav'
import { ToastContainer} from 'react-toastify';
import Head from 'next/head';


import { Montserrat } from 'next/font/google'
import AppProvider from './_contexts/AppContext';

const montserrat = Montserrat({
  weight: ['400', '700'],
  subsets: ['latin']
})

  
  export default function RootLayout({
    children,
}: {
  children: React.ReactNode
}) {



  return (
    <html lang="en">
      <Head>
      <link rel="shortcut icon" href="/logo.ico" type="image/x-icon" />
      <title>Collaboratio</title>
      </Head>
      <body className={`${montserrat.className}`}>
        <AuthProvider>
          <AppProvider>
            <Nav/>
            {children}
            <ToastContainer />
            {/* <Footer/> */}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

