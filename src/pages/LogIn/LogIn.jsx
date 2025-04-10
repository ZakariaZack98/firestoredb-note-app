import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import {auth, db} from '../../firebase'
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { doc, setDoc } from "firebase/firestore";
// import { uploadFile } from '../../../lib/uploadFile';

const Login = () => {
  const [loading, setLoading] = useState(false);
  // const [avatar, setAvatar] = useState(
  //   {
  //   file: null,
  //   imgUrl: ''
  //   }
  // )

  // const handleAvatar = e => {
  //   if(e.target.files[0]) {
  //     setAvatar(
  //       {
  //         file: e.target.files[0],
  //         imgUrl: URL.createObjectURL(e.target.files[0])
  //       })
  //   }
  // }

  const handleLogin = e => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target.closest('form'));
    const {email, password} = Object.fromEntries(formData);

    try {
      console.log(email, password);
      signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target.closest('form'));
    const {username, email, password} = Object.fromEntries(formData);
    
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      // const fileUrl = await uploadFile(avatar.file);
      // console.log(fileUrl);
      
      // Adding new user data to DB
      await setDoc(doc(db, 'users', response.user.uid), {
        username,
        email,
        // avatar: fileUrl,
        id: response.user.uid,
      });

      toast.success('Account created successfully')

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }

  }

  return (
    <div className='p-10 flex h-full w-full'>
      <div className="loginSec w-[50%] flex flex-col justify-center items-center gap-y-4 border-e-1 border-white">
        <h1 className='text-2xl font-bold'>Welcome Back!</h1>
        <form className='flex flex-col gap-y-5' onSubmit={handleLogin}>
          <input type="email" name='email' className='border-2 border-white rounded-md py-3 px-6' placeholder='Your email'/>
          <input type="password" name='password' className='border-2 border-white rounded-md py-3 px-6' placeholder='Enter password'/>
          <button className='py-3 font-bold bg-blue-900 rounded-md w-[270px] cursor-pointer' disabled={loading}>{loading ? 'Loading...' : 'Log In'}</button>
        </form>
      </div>

      <div className="signUpSec w-[50%] flex flex-col justify-center items-center gap-y-4">
        <h1 className='text-2xl font-bold'>Create an account</h1>
        <form className='flex flex-col gap-y-5'>
          {/* <div className="picUpload flex items-center justify-center gap-x-4">
            <img src={avatar.imgUrl || './avatar.png'} alt="" className='w-10 h-10 rounded-md'/>
            <label htmlFor="file" className='underline'>Upload your avatar</label>
            <input type="file" id='file' style={{display: 'none'}} onChange={handleAvatar}/>
          </div> */}
          <input type="text" name='username' className='border-2 border-white rounded-md py-3 px-6' placeholder='Username'/>
          <input type="email" name='email' className='border-2 border-white rounded-md py-3 px-6' placeholder='Your email'/>
          <input type="password" name='password' className='border-2 border-white rounded-md py-3 px-6' placeholder='Enter password'/>
          <button className='loginBtn py-3 font-bold bg-blue-900 rounded-md w-[270px] cursor-pointer' disabled={loading} onClick={handleSignup}>{loading ? 'Loading...' : 'Sign Up'}</button>
        </form>
        </div>
    </div>
  )
}

export default Login