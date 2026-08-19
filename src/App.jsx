import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from "./components/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Video from "./components/Video"
import ChannelVideo from "./components/ChannelVideo"
import Profile from "./components/Profile"
import NavBar from './components/NavBar'
import Addvideo from './components/Addvideo'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<NavBar />}>
          <Route path='home' element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route path='video' element={<Video />} />
          <Route path='channel' element={<ChannelVideo />} />
          <Route path='profile' element={<Profile />} />
          <Route path='add-video' element={<Addvideo />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App