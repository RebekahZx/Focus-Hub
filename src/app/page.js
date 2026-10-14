"use client"
import Loader from "@/components/Loader";
import Header from "@/components/Header.jsx";
import MeetingAction from "@/components/MeetingAction";
import MeetingFeature from "@/components/MeetinFeature";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const [isLoading,setIsLoading] = useState(true);
  const {data:session,status}= useSession();
   

  useEffect(() =>{
    if(status === 'authenticated'){
      setIsLoading(false);
      const hasShownWelcome = localStorage.getItem('hasShownWelcome');
      if(!hasShownWelcome){
        toast.success(`Welcome back! ${session?.user?.name}!`)
        localStorage.setItem('hasShownWelcome','true');
      }
    }else if(status === 'unauthenticated'){
      setIsLoading(false);
    }
  },[status,session])

  if(isLoading){
    return <Loader/>
  }
  return (
     <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
          <Header/>
          <main className="flex-grow p-8 pt-32">
           <div className="max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 mb-8 md:mb-0 ">
                    <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                    Video calls and meetings for everyone
                    </h1>
                    <p className="text-3xl text-gray-600 dark:text-gray-300 mb-12">
                    Start a call in one click and share the link with anyone
                    </p>
                      <MeetingAction/>
                </div>
                <div className="md:w-1/2 ">
                  <MeetingFeature/>
                </div>
             </div>
           </div>
          </main>
     </div>
  );
}