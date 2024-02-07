import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [fromData, setFromData] = useState({});
  const [publishError,setPublishError]=useState(null)
  const navigate=useNavigate();

 

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an Image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);

      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image Upload Failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFromData({ ...fromData, image: downloadURL });
          });
        }
      );
    } catch (err) {
      setImageUploadError("Image upload Failed");
      setImageUploadProgress(null);
    }
  };

  const handleSubmit= async (e)=>{
    e.preventDefault();
    try{
      const res= await fetch(`/api/post/create`,{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(fromData)
      });
      const data= await res.json();
      if(!res.ok){
        setPublishError(data.message)
        return;
      }
     
      if(res.ok){
        setPublishError(null)
        navigate(`/post/${data.slug}`)
      }

    }catch(err){
      setPublishError('Something went Wrong');
    }
  }
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TextInput
            type="text"
            required
            placeholder="Title"
            className="flex-1"
            id="title"
            onChange={(e)=>{
              setFromData({...fromData,title:e.target.value})
            }}

          />
          <Select
          onChange={(e)=>{
            setFromData({...fromData,category:e.target.value})
          }}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 p-3 border-dotted">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            onClick={handleUploadImage}
            type="button"
            gradientDuoTone={"purpleToBlue"}
            size="sm"
            outline
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {fromData.image && (
          <img
            src={fromData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="write something..."
          className="h-72 mb-12"
          required
          onChange={(value)=>{
            setFromData({...fromData,content:value})
          }}
        />
        <Button type="submit" gradientDuoTone={"purpleToPink"}>
          Publish
        </Button>
        {
          publishError && <Alert className="mt-5" color='failure'>{publishError}</Alert>
        }
      </form>
    </div>
  );
}
