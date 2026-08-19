import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const NavBar = () => {

    return (
        <div>
            <div className='navbar'>
                <div className='logo'>
                    <span><i className="fa-solid fa-play"></i></span> Streamly
                </div>
                <div className='links'>
                    <Link className='link-item' to="/home">Home</Link>
                    <Link className='link-item' to="/login">Login</Link>
                    <Link className='link-item' to="/add-video">Upload Video</Link>
                    <Link className='link-item' to="/profile">Hello, Ritesh</Link>
                </div>
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default NavBar