import React from 'react'
import { useState } from "react"
import { Link, Outlet } from 'react-router-dom'

const NavBar = () => {
    const [isLogin, setLogin] = useState(localStorage.getItem('isLogin'))

    const setLoginState = (state) => {
        setLogin(state)
        localStorage.setItem('isLogin', state)
    }

    const logout = () => {
        localStorage.clear()
        setLogin(false)
    }

    return (
        <div>
            <div className='navbar'>
                <div className='logo'>
                    <span><i className="fa-solid fa-play"></i></span> Streamly
                </div>
                <div className='links'>
                    <Link className='link-item' to="/">Home</Link>
                    {!(localStorage.getItem('isLogin')) && <Link className="link-item" to="/login">Login</Link>}
                    {localStorage.getItem('isLogin') && <Link className="link-item" to='/add-video'>Upload Video</Link>}
                    {localStorage.getItem('isLogin') && <Link className="link-item" to="/profile">{localStorage.getItem('channelName')}</Link>}
                    {localStorage.getItem('isLogin') && <span onClick={logout} className="logout"><i className="fa-solid fa-right-from-bracket"></i> Logout</span>}
                </div>
            </div>
            <div>
                <Outlet context={{ setLoginState }} />
            </div>
        </div>
    )
}

export default NavBar