// import React, { useState } from 'react'
// import { Link, Outlet,useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import swal from 'sweetalert'

// const Signup = () => {
//   const [channelName, setChannelName] = useState('')
//   const [description, setDescription] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   const navigate = useNavigate()

//   const [isLoading, setLoading] = useState(false)
//   const apiUrl = import.meta.env.VITE_API_URL

//   const SubmitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);
//       const newChannel = {
//         channelName,
//         description,
//         email,
//         password,
//       };

//       const data =await axios.post(
//         `${apiUrl}/user/signup`,
//         newChannel
//       );

//       console.log(data.data);
//       setLoading(false);

//       navigate("");

//       // Clear Form
//       setChannelName("");
//       setDescription("");
//       setEmail("");
//       setPassword("");
//     }
//     catch (error) {
//       console.log(error)
//       setLoading(false)
//       swal("Error!", "Failed to create account.", "error");
//     }
//   }

//   return (
//     <div className='form-wrapper' >
//       <form className='form' onSubmit={SubmitHandler}>
//         <p>Create Your Account</p>
//         <input className='form-input' onChange={(e) => setChannelName(e.target.value)} type='text' placeholder='channel Name' value={channelName}></input>
//         <input className='form-input' onChange={(e) => setDescription(e.target.value)} type='text' placeholder='description' value={description}></input>
//         <input className='form-input' onChange={(e) => setEmail(e.target.value)} type='email' placeholder='email' value={email}></input>
//         <input className='form-input' onChange={(e) => setPassword(e.target.value)} type='password' placeholder='password' value={password}></input>
//         {isLoading ? (<button><span><i className="fa-solid fa-spinner"></i></span> Creating Account....</button>) : (<button>Create Account</button>)}
//         <Link to = "/login">Already have an account? Login here</Link>
//       </form>
//     </div>
//   )
// }

// export default Signup


import React, { useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import axios from 'axios'
import swal from 'sweetalert'

const Signup = () => {

  const [channelName, setChannelName] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [isLoading, setLoading] = useState(false)

  const navigate = useNavigate()

  // NavBar se setLoginState lena
  const { setLoginState } = useOutletContext()

  const apiUrl = import.meta.env.VITE_API_URL

  const SubmitHandler = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const newChannel = {
        channelName,
        description,
        email,
        password
      }

      const response = await axios.post(
        `${apiUrl}/user/signup`,
        newChannel
      )

      console.log(response.data)

      // Backend se token aur user data
      const { token, newUser } = response.data

      // LocalStorage me save
      localStorage.setItem('token', token)
      localStorage.setItem('isLogin', true)
      localStorage.setItem('channelName', newUser.channelName)
      localStorage.setItem('userId', newUser._id)

      // Navbar ko login state batao
      setLoginState(true)

      setLoading(false)

      // Login ke baad wala page
      navigate('/')

    } catch (error) {

      console.log(error)

      setLoading(false)

      swal(
        "Error!",
        error.response?.data?.error || "Failed to create account.",
        "error"
      )
    }
  }

  return (
    <div className='form-wrapper'>

      <form className='form' onSubmit={SubmitHandler}>

        <p>Create Your Account</p>

        <input
          className='form-input'
          onChange={(e) => setChannelName(e.target.value)}
          type='text'
          placeholder='Channel Name'
          value={channelName}
          required
        />

        <input
          className='form-input'
          onChange={(e) => setDescription(e.target.value)}
          type='text'
          placeholder='Description'
          value={description}
          required
        />

        <input
          className='form-input'
          onChange={(e) => setEmail(e.target.value)}
          type='email'
          placeholder='Email'
          value={email}
          required
        />

        <input
          className='form-input'
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          placeholder='Password'
          value={password}
          required
        />

        {isLoading ? (
          <button type="submit" disabled>
            <span><i className="fa-solid fa-spinner fa-spin"></i></span>
            {" "}Creating Account....
          </button>
        ) : (
          <button type="submit">
            Create Account
          </button>
        )}

        <Link to="/login">
          Already have an account? Login here
        </Link>

      </form>

    </div>
  )
}

export default Signup