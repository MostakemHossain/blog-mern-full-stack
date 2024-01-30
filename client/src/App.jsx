import { BrowserRouter, Route, Routes } from "react-router-dom"
import About from "./pages/About"
import DashBoard from "./pages/DashBoard"
import Home from "./pages/Home"
import Projects from "./pages/Projects"
import SignIn from "./pages/SignIn"
import Signup from "./pages/Signup"

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/about" element={<About />}/>
      <Route path="/sign-in" element={<SignIn />}/>
      <Route path="/sign-up" element={<Signup />}/>
      <Route path="/dashboard" element={<DashBoard />}/>
      <Route path="/projects" element={<Projects />}/>
    </Routes>

    </BrowserRouter>
  )
}
