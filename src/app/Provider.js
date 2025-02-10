"use client"



import { ToastContainer } from 'react-toastify';
import {SessionProvider} from 'next-auth/react'
import { ThemeProvider } from 'next-themes';
import 'react-toastify/dist/ReactToastify.css';
export function Providers({children,session}){
    return (
        <SessionProvider session={session}>
            <ToastContainer position='top-right' autoClose={3000}/>
            <ThemeProvider>
                {children}
            </ThemeProvider>

        </SessionProvider>
    )
}