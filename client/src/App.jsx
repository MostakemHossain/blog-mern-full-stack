import { BrowserRouter, Route, Routes } from "react-router-dom"
import Footer from "./components/Footer"
import Header from "./components/Header"
import OnlyAdminPrivateRoutes from "./components/OnlyAdminPrivateRoute"
import PrivateRoutes from "./components/PrivateRoutes"
import ScrollToTop from "./components/ScroolToTop"
import About from "./pages/About"
import CreatePost from "./pages/CreatePost"
import DashBoard from "./pages/DashBoard"
import Home from "./pages/Home"
import PostPage from "./pages/PostPage"
import Projects from "./pages/Projects"
import SignIn from "./pages/SignIn"
import Signup from "./pages/Signup"
import UpdatePost from "./pages/updatePost"

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/about" element={<About />}/>
      <Route path="/sign-in" element={<SignIn />}/>
      <Route path="/sign-up" element={<Signup />}/>
      <Route element={<PrivateRoutes/>}>
      <Route path="/dashboard" element={<DashBoard />}/>
      </Route>
      <Route element={<OnlyAdminPrivateRoutes/>}>
      <Route path="/create-post" element={<CreatePost />}/>
      <Route path='/update-post/:postId' element={<UpdatePost />} />
      </Route>
      
      <Route path="/projects" element={<Projects />}/>
      <Route path="/post/:postSlug" element={<PostPage />}/>
    </Routes>
    <Footer/>

    </BrowserRouter>
  )
}
