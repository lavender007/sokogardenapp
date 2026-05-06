import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Signup = () => {
  // Initialise the hooks they help manage the state of an application
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tel, setPhonenumber] = useState("");



  return (
    <div className='row justify-content-center mt-4'>
      <div className="card col-md-6 shadow pd-4">
         <h1 className='text-primary'>Sign Up</h1>

         <form>
          <input type="text"
          placeholder='Enter the Username'
          className='form-control'
          value ={username}
          onChange={(e) => setUsername(e.target.value)}
          required/> <br />

          {/* {username} */}

          <input type="email"
          placeholder='Enter the Email Address'
          className='form-control'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required/> <br />
          {/* {email} */}

          <input type="password"
          placeholder='Enter the Password'
          className='form-control'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required/>
           <br />
          {/* {password} */}

          <input type="tel"
          placeholder="Enter the Phone Number" 
          className='form-control'
          value={tel}
          onChange={(e) => setPhonenumber(e.target.value)}
          required/> <br />
          {/* {tel} */}

          <input type="button" value= 'SignUp' className='btn btn-primary' /> <br/> <br />

          Already have an account? <Link to={'/signin'} >Sign In</Link>

         </form>
      </div>
    </div>
  )
}

export default Signup;