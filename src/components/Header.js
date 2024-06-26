import { onAuthStateChanged, signOut } from 'firebase/auth';
import usericon from '../assets/usericon.jpg'
import { auth } from '../utils/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { addUser , removeUser } from '../utils/userSlice'
import { LOGO, SUPPORTED_LANG } from '../utils/constants';
import { toggleGptSearchView } from '../utils/gptSlice';
import { IoSearch } from "react-icons/io5";
import { changeLanguage } from '../utils/langSlice';
import language from '../utils/language';
//import { IoMdHome } from "react-icons/io";
import webflix from "../assets/webflix.png"
import AIlogo from "../assets/AIlogo.png"


const Header = () => {

  const [showItems, setShowItems] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const myLang = useSelector((store) => store.language.lang);

  const handleSignOut = () => {
    signOut(auth).then(() => {})
    .catch((error) => {
      navigate('/error');
    });
  }

  const handleClick =()=>{
    setShowItems(!showItems);
  }

  const handleGptSearchClick =()=>{
    //Toggle GPT Search 
    dispatch(toggleGptSearchView());
  }

  const handleLanguage =(e)=>{
    dispatch(changeLanguage(e.target.value));
  }

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const {uid, email} = user;
        dispatch(addUser({uid: uid, email: email}))
        if (window.location.pathname === "/") {
          navigate("/browse");
        }
      } else {
        dispatch(removeUser());
        navigate("/")
      }
    });
    
    //unsubscribe the component unmount
    return () => unsubscribe();
  },[])

  return (
    <div className="absolute md:absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex flex-col items-center md:flex-row justify-center md:justify-between">
      <Link to={"/browse"}>
      <img
      className="w-40 mx-auto md:mx-0" 
      src={webflix} alt='logo' />
      </Link>

    {user && (<div className="flex p-2 mx-auto md:mx-0">

      {showGptSearch && (
        <select className='m-2 rounded-sm pl-2 bg-gray-600 text-white bg-opacity-70 hover:bg-white hover:text-black'
        onChange={handleLanguage}>
          {SUPPORTED_LANG.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      )}
    
      {window.location.pathname === "/browse" && (
        <button className='bg-black text-base rounded-full pl-2 pr-4 font-semibold text-white border-white border-2 p-2 m-2 hover:bg-white hover:text-black' 
        onClick={handleGptSearchClick}>
          <span className='flex items-center'>
            {!showGptSearch && <img src={AIlogo} alt="user icon" className="w-6 h-6"/>}
            {showGptSearch && <img src={AIlogo} alt="user icon" className="w-6 h-6"/>}
            {showGptSearch ? language[myLang].home : "GPT Search"}
          </span>
        </button>
      )}
      
      <img className="w-12 h-12 m-2" src={usericon} alt="usericon" onClick={handleClick}/>

      {showItems && <button onClick={handleSignOut} className='bg-red-600 m-2 rounded-sm p-2 text-white'>Sign Out</button>}
      
    </div>)}

    </div>
  )
}

export default Header