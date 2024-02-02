import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "./DashProfile";
import DashSideBar from "./DashSideBar";

export default function DashBoard() {
  const location= useLocation();
  const [tab,setTab]=useState('');
  useEffect(()=>{
    const useParams= new URLSearchParams(location.search)
    const tabFromUrl= useParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  },[location.search])
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* sidebar  */}
        <DashSideBar/>
      </div>
      {/* profile */}
     {
      tab==='profile' && <DashProfile/>
     }
    </div>
  )
}
