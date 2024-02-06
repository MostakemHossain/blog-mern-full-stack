/* eslint-disable no-unused-vars */
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { Alert, Button, TextInput } from "flowbite-react"
import { useEffect, useRef, useState } from "react"
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useDispatch, useSelector } from "react-redux"
import { app } from "../firebase"
import { updateFailure, updateStart, updateSuccess } from "../redux/user/user.Slice"


export default function DashProfile() {

    const dispatch= useDispatch()
    const {currentUser}= useSelector((state)=>state.user)
    const [imageFile,setImageFile]= useState(null)

    const [imageFileUrl,setImageFileUrl]= useState(null)
    const [imageFileUploadingProgress,setImageFileUploadingProgress]= useState(null)
    const [imageFileUploadingError,setImageFileUploadingError]= useState(null)
    const [imageFileUploading,setImageFileUploading]= useState(false)
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [fromData,setFromData]= useState({});

 
    const filePickerRef= useRef();
    
    const handleImageChange= (e)=>{
        const file=e.target.files[0]
        if(file){
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }

    useEffect(()=>{
        if(imageFile){
            uploadImage();
        }

    },[imageFile])

    const uploadImage = async () => {
        setImageFileUploading(true)
        setImageFileUploadingError(null)
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
    
        uploadTask.on("state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadingProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadingError('Could not upload Image (File must be less than 2MB)');
                setImageFileUploadingProgress(null)
                setImageFile(null)
                setImageFileUrl(null)
                setImageFileUploading(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFromData({...fromData,profilePicture:downloadURL})
                    setImageFileUploading(false)
                });
            }
        );
    };
    


    const handleChange=(e)=>{
        setFromData({
            ...fromData,[e.target.id]:e.target.value
        });
    };

 

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null)
        if(Object.keys(fromData).length===0){
            setUpdateUserError("No Changes made")
            return;
        }

        if(imageFileUploading){
            setUpdateUserError("Please wait for image to upload")
            return
        }

        try{
            dispatch(updateStart())

            const res= await fetch(`/api/user/update/${currentUser._id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(fromData)
            });
            const data= await res.json();

            if(!res.ok){
                dispatch(updateFailure(data.message))
                setUpdateUserError(data.message)
            }else{
                dispatch(updateSuccess(data))
                setUpdateUserSuccess("User's Profile updated successfully")
            }

        }catch(err){

            dispatch(updateFailure(err.message))
            setUpdateUserError(err.message)
        }
    }
   
    
  return (
    <div
    className="max-w-lg mx-auto p-3 w-full"
    >
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
        >
            <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />
            <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={()=>filePickerRef.current.click()}>
                {
                    imageFileUploadingProgress && ( 
                        <CircularProgressbar value={imageFileUploadingProgress || 0}
                        text={`${imageFileUploadingProgress}%`}
                        strokeWidth={5}
                        styles={{
                            root:{
                                width:'100%',
                                height:'100%',
                                position:'absolute',
                                top:0,
                                left:0
                            },
                            path:{
                                stroke:`rgba(62,152,199, ${imageFileUploadingProgress/100})`
                            }
                        }}
                        />
                    )
                }
                <img src={ imageFileUrl || currentUser.profilePicture} alt="user"
                className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${ imageFileUploadingProgress&&imageFileUploadingProgress<100 && 'opacity-60'} `}
                />



            </div>
            {
                imageFileUploadingError && <Alert color='failure'> {imageFileUploadingError} </Alert>
            }
            

           
            <TextInput type='text' id="username" placeholder="username" defaultValue={currentUser.username}
            onChange={handleChange}
            />
            <TextInput type='email' id="email" placeholder="email" defaultValue={currentUser.email}
            onChange={handleChange}
            />
            <TextInput type='password' id="password" placeholder="password"
             onChange={handleChange}/>
            <Button type="submit" gradientDuoTone='purpleToBlue' outline>
                Update
            </Button>


        </form>
        <div className="text-red-500 flex justify-between mt-4">
            <span className="cursor-pointer">Delete</span>
            <span className="cursor-pointer">sign out</span>

        </div>
        {
            updateUserSuccess && (
                <Alert color='success' className="mt-5">
                    {updateUserSuccess}
                </Alert>
            )
        }
        {
            updateUserError && (
                <Alert color='failure' className="mt-5">
                    {updateUserError}
                </Alert>
            )
        }
    </div>
  )
}
