import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ForgotEmail from '../../components/user/ForgotPassword/ForgotEmail.jsx';
import { useDispatch } from 'react-redux';
import { LoginFailure, LoginStart, LoginSuccess } from '../../redux/user/userSlice.js';
import { showToast } from '../../helper/toast.js';
import GoogleAuthBtn from '../../components/user/GoogleAuthBtn.jsx';

const Login = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [IsOpenEmailPopup , setIsOpenEmailPopup] = useState(false)

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const validationErrors = {};
    if (!formData.email) {
      validationErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Invalid email format.';
    }
    if (!formData.password) {
      validationErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters.';
    }
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
dispatch(LoginStart)
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      
      const response = await axios.post('http://localhost:3000/user/login', formData);

      if (response.status === 200) {
        showToast('Login successful!','light');
        setFormData({ email: '', password: '' });
        dispatch(LoginSuccess(response?.data?.user))
        navigate('/')
      } else {
        showToast('Unexpected error during login.','light','success');
        dispatch(LoginFailure)
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error logging in. Please try again later.';
      setErrors({ server: errorMessage });
      showToast(errorMessage,'dark','error');
      dispatch(LoginFailure)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="h-[120vh] w-[1366px] flex justify-between bg-black">
        <form onSubmit={handleSubmit} className="flex flex-col mx-auto  w-1/3">
          <h1 className="mt-12 mx-auto mb-20 font-audiowide stroke-orange text-6xl uppercase">Login</h1>

          {/* Email Input */}
          <div className="mb-12">
            <input
              type="email"
              placeholder="EMAIL"
              className="bg-gray-900 w-full p-3 rounded-sm mb-2 placeholder:font-audiowide text-white font-baseline placeholder:text-sm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <input
              type="password"
              placeholder="PASSWORD"
              className="bg-gray-900 w-full p-3 rounded-sm mb-2 placeholder:font-audiowide text-white font-baseline placeholder:text-sm"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
          </div>

          <p onClick={()=>setIsOpenEmailPopup(true)} className='font-extralight cursor-pointer text-sm mb-16 text-center font-audiowide tracking-wider text-white'>Forgot Your Password ?</p>
          {/* Login Button */}
        <div className="flex  justify-between">
        <button
            type="submit"
            disabled={loading}
            className={`border-[#A3E81D] hover:text-black hover:bg-[#A3E81D] w-[200px]  border-2 rounded-md px-6 py-2 font-audiowide tracking-wider text-[#A3E81D] ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
          <GoogleAuthBtn/>
        </div>


          {/* Signup Link */}
          <Link to={'/register'}>
            <p className="font-extralight text-sm mb-2 mt-12 text-center font-audiowide tracking-wider text-white">
              New to this? <span className="text-[#A3E81D] tracking-wider">SIGN UP</span>
            </p>
          </Link>
        </form>

        {/* Right Section */}
        <div className="bg-white w-1/2 p-5">
          {/* Navigation Section */}
          <nav className="font-Roboto w-fit float-right text-black flex gap-x-10 uppercase tracking-widest font-semibold">
            <a href="#home" className="hover:text-orange-500 transition-colors">
              Home
            </a>
            <a href="#about-us" className="hover:text-orange-500 transition-colors">
              About Us
            </a>
            <a href="#products" className="hover:text-orange-500 transition-colors">
              Products
            </a>
            <a href="#contact" className="hover:text-orange-500 transition-colors">
              Contact
            </a>
          </nav>
          <img
          src="https://i.pinimg.com/originals/c0/82/91/c082911f2a616883a1e0652bff686f73.gif"
           className="mt-20 mx-auto"
          />
        </div>
      </div>

      {
        IsOpenEmailPopup ? 
        <ForgotEmail
        setIsOpenEmailPopup={setIsOpenEmailPopup}
        showToast={showToast}
        />
        : ""
      }
    </div>
  );
};

export default Login;
