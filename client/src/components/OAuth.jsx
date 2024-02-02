import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { app } from "../firebase";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInFailure, signInSuccess, } from "../redux/user/user.Slice";


export default function OAuth() {

    const auth=getAuth(app);
    const dispatch= useDispatch();
    const navigate= useNavigate();
    const handleGoogleClick=async()=>{
        const provider= new GoogleAuthProvider()
        provider.setCustomParameters({
            prompt:"select_account"
        })
        try{
            const result= await signInWithPopup(auth,provider)
           const res= await fetch('/api/auth/google',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name:result.user.displayName,
                email:result.user.email,
                imageUrl:result.user.photoURL
            })

           })
           const data= await res.json();
           if(res.ok){
            dispatch(signInSuccess(data))
            navigate(
                '/'
            )
           }

        }catch(error){
            dispatch(signInFailure(error.message))
        }

    }
  return (
    <Button onClick={handleGoogleClick} type="button" gradientDuoTone={'pinkToOrange'} outline>
        <AiFillGoogleCircle className="w-6 h-6 mr-2"/>
        <span>Continue with Google</span>
    </Button>
  )
}
