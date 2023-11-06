import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess, signInFailuer, signInStart } from "../../redux/user/userSlice";
import OAuth from "../../components/OAuth/OAuth";

const SignIn = () => {
    
    // state to keep truck of all input changes
    const [formData, setFormData] = useState({
        // userName: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();   //new line

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    };
    console.log(formData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          dispatch(signInStart()) //this is added new
          const response = await axios.post('/server/signIn', formData);
          if (response.status >= 200 && response.status < 300) {
            console.log('User registered successfully:', response.data);
            dispatch(signInSuccess(response))
            navigate('/')
          } else {
            console.error('Error registering new user:', response.data);
          }
        } catch (error) {
          console.error('There was an error sending the request:', error);
        }
        
        setFormData({
            // userName: '',
            email: '',
            password: ''
        })
        
      };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="email" placeholder="email"
                className="border p-3 rounded-lg" 
                id="email"
                name='email'
                value={formData.email}
                onChange={handleChange}/>

                <input type="password" placeholder="password"
                className="border p-3 rounded-lg" 
                id="password"
                name='password'
                value={formData.password}
                onChange={handleChange}/>

                <button className="bg-slate-500 text-white font-semibold border rounded-lg p-3 uppercase hover:bg-opacity-80 disabled:opacity-80">Sign In</button>
                <OAuth/>
            </form>
            <div className='flex gap-2 mt-5'>
                <p>Dont have an account?</p>
                <Link to={'/signUp'}>
                    <span className='text-blue-700'>Sign Up</span>
                </Link>
            </div>
        </div>
    )
};

export default SignIn;
