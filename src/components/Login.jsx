import React, { useState } from 'react'
import { Link, Outlet,useNavigate } from 'react-router-dom'
import axios from 'axios'
import swal from 'sweetalert'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const [isLoading, setLoading] = useState(false)
  const apiUrl = import.meta.env.VITE_API_URL

  const SubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const newChannel = {
        email,
        password,
      };

      const data =await axios.post(
        `${apiUrl}/user/login`,
        newChannel
      );

      console.log(data);
      swal("Success!", "logged in successfully.", "success");

      navigate("/home");

      // Clear Form
      setEmail("");
      setPassword("");
    }
    catch (error) {
      console.log(error)
      swal("Error!", "Failed to login.", "error");
    }
  }

  return (
    <div className='form-wrapper' >
      <form className='form' onSubmit={SubmitHandler}>
        <p>Login to Your Account</p>
        <input className='form-input' onChange={(e) => setEmail(e.target.value)} type='email' placeholder='email' value={email}></input>
        <input className='form-input' onChange={(e) => setPassword(e.target.value)} type='password' placeholder='password' value={password}></input>
        {isLoading ? (<button><span><i class="fa-solid fa-spinner"></i></span> Logging in....</button>) : (<button>Login</button>)}
        <Link to = "/signup">Don't have an account? Signup here</Link>
      </form>
    </div>
  )
}

export default Login
