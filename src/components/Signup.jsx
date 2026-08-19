import React, { useState } from 'react'
import { Link, Outlet,useNavigate } from 'react-router-dom'
import axios from 'axios'
import swal from 'sweetalert'

const Signup = () => {
  const [channelName, setChannelName] = useState('')
  const [description, setDescription] = useState('')
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
        channelName,
        description,
        email,
        password,
      };

      const data =await axios.post(
        `${apiUrl}/user/signup`,
        newChannel
      );

      console.log(data);
      swal("Success!", "Account created successfully.", "success");

      navigate("/login");

      // Clear Form
      setChannelName("");
      setDescription("");
      setEmail("");
      setPassword("");
    }
    catch (error) {
      console.log(error)
      swal("Error!", "Failed to create account.", "error");
    }
  }

  return (
    <div className='form-wrapper' >
      <form className='form' onSubmit={SubmitHandler}>
        <p>Create Your Account</p>
        <input className='form-input' onChange={(e) => setChannelName(e.target.value)} type='text' placeholder='channel Name' value={channelName}></input>
        <input className='form-input' onChange={(e) => setDescription(e.target.value)} type='text' placeholder='description' value={description}></input>
        <input className='form-input' onChange={(e) => setEmail(e.target.value)} type='email' placeholder='email' value={email}></input>
        <input className='form-input' onChange={(e) => setPassword(e.target.value)} type='password' placeholder='password' value={password}></input>
        {isLoading ? (<button><span><i class="fa-solid fa-spinner"></i></span> Creating Account....</button>) : (<button>Create Account</button>)}
        <Link to = "/login">Already have an account? Login here</Link>
      </form>
    </div>
  )
}

export default Signup
