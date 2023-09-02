'use client'
import './globals.scss'

import AuthProvider from './_contexts/AuthContext';
import Nav from './_components/Nav'
import Footer from './_components/Footer'

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
      <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
      <title>Collaboratio</title>
      <body className={`${montserrat.className}`}>
        <AuthProvider>
          <AppProvider>
            <Nav/>
            {children}
            {/* <Footer/> */}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

