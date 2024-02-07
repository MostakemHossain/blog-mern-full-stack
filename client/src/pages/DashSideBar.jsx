import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmRight, HiDocumentText, HiUser } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/user/user.Slice";


export default function DashSideBar() {
    const location= useLocation();
    const dispatch=useDispatch();
    const {currentUser}= useSelector((state) => state.user)
    const [tab,setTab]=useState('');
    useEffect(()=>{
      const useParams= new URLSearchParams(location.search)
      const tabFromUrl= useParams.get('tab');
      if(tabFromUrl){
        setTab(tabFromUrl);
      }
    },[location.search])
    console.log(currentUser.isAdmin)

    const handleSignOut= async() => {
      try{
          const res= await fetch('/api/user/signout',{
              method:'POST'
          });

          const data= await res.json();

          if(!res.ok){
              console.log(data.message)
          }else{
              dispatch(signOutSuccess(data.message))
          }

      }catch(err){
          console.log(err.message)
      }


  }
  return (
    <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
            <Sidebar.ItemGroup className="flex flex-col gap-1">
                <Link to='/dashboard?tab=profile'> 
                <Sidebar.Item active={tab==='profile'} icon={HiUser} label={currentUser.isAdmin? 'Admin':'user'} labelColor='dark' as='div'>
                    Profile
                </Sidebar.Item>
                </Link>

                {
                    currentUser.isAdmin && (
                        <Link to='/dashboard?tab=posts'> 
                        <Sidebar.Item active={tab==='posts'} icon={HiDocumentText}  labelColor='dark' as='div'>
                            Posts
                        </Sidebar.Item>
                        </Link>
                    )
                }
                <Sidebar.Item    icon={HiArrowSmRight}   >
                    <div className='cursor-pointer' onClick={handleSignOut}>
                    Sign Out
                    </div>
                </Sidebar.Item>
            </Sidebar.ItemGroup>

        </Sidebar.Items>
    </Sidebar>
  )
}
