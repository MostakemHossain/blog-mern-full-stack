/* eslint-disable react/no-unescaped-entities */
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { FaMoon, FaSearch, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/user.Slice";

export default function Header() {
    const path=useLocation().pathname;
    const dispatch=useDispatch();
    const {currentUser}= useSelector((state)=>state.user )
    const {theme}= useSelector((state)=>state.theme)


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
    <Navbar className="border-b-2">
        <Link to='/' className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">Mostakem's</span>
            <span>Blog</span>
        </Link>
        <form >
            <TextInput
            type="text"
            placeholder="Search articles..."
            rightIcon={FaSearch}
            className="hidden lg:inline"

            />
        </form>
        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
            <FaSearch/>
        </Button>
        <div className="flex items-center gap-2 md:order-2">
            <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={()=>dispatch(toggleTheme())}>
                {
                    theme==='light'?<FaSun/> : <FaMoon/>
                }
            </Button>
            {
                currentUser ? (
                    <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar
                        alt="user"
                        img={currentUser.profilePicture}
                        rounded
                        />

                    }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">@{currentUser.username}</span>
                            <span className="block text-sm font-medium truncate">{currentUser.email}</span>
                        </Dropdown.Header>
                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>
                                Profile
                            </Dropdown.Item>
                            <Dropdown.Divider/>
                            <Dropdown.Item onClick={handleSignOut}>
                                Sign Out
                            </Dropdown.Item>
                        </Link>

                    </Dropdown>
                ):(
                    <Link to="/sign-in">
                <Button gradientDuoTone='purpleToBlue' outline>
                    Sign In
                </Button>
            </Link>
                )
            }
            <Navbar.Toggle/>
           
        </div>
        <Navbar.Collapse>
                <Navbar.Link active={path==='/'} as='div'>
                    <Link to='/'>
                    Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path==='/about'} as='div'>
                    <Link to='/about'>
                    About
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path==='/projects'} as='div'>
                    <Link to='/projects'>
                    Projects
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
    </Navbar>
  )
}
