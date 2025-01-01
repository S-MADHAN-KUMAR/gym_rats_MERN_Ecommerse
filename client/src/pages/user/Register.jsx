// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { RegisterStart, RegisterSuccess, RegisterFailure } from '../../redux/user/userSlice.js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { showToast } from '../../helper/toast.js';
import { useFormik } from 'formik'; // Import formik
import { validationSchema } from '../../validations/userValidation.js';
import GoogleAuthBtn from '../../components/user/GoogleAuthBtn.jsx';
import OtpPopup from '../../components/user/OtpPopup.jsx';

const RegisterPage = () => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const dispatch = useDispatch();

  // Initialize formik with validation schema
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      dispatch(RegisterStart());

      try {
        const response = await axios.post('http://localhost:3000/user/register', values);
        if (response.status === 200) {
          showToast('OTP sent to your email. Please check and verify!', 'success');
          dispatch(RegisterSuccess(response.data));
          setIsOpenPopup(true);
        }
      } catch (error) {
        console.error('Error during registration:', error);
        const errorMessage =
          error.response?.data?.message || 'An unexpected error occurred!';
        dispatch(RegisterFailure({ message: errorMessage }));
        showToast(errorMessage, 'error');
      }
    },
  });

  return (
    <div className="overflow-hidden">
      <div className="h-[120vh] w-[1366px] flex justify-between bg-black">
        <form className="flex flex-col mx-auto" onSubmit={formik.handleSubmit}>
          <div className="flex mb-12 mt-4 gap-x-3">
            <h1 className="font-audiowide text-white/80 items-center text-2xl uppercase">
              create account in
            </h1>
            <p className="text-2xl items-center font-bold text-white font-Roboto uppercase">
              gym <span className="font-audiowide text-transparent stroke-orange">RATS</span>
            </p>
          </div>

          {['name', 'email', 'phone', 'password', 'confirmPassword'].map((field) => (
            <div className="input-group" key={field}>
              <input
                type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                name={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={field.toUpperCase().replace('_', ' ')}
                className="bg-gray-900 w-full p-3 rounded-sm mb-1 placeholder:font-audiowide font-baseline placeholder:text-sm"
              />
              {formik.touched[field] && formik.errors[field] && (
                <p className="text-red-600 text-sm">{formik.errors[field]}</p>
              )}
            </div>
          ))}

          <div className="flex justify-between mt-2 gap-x-5">
            <button
              type="submit"
              className="border-[#A3E81D] w-1/2 border-2 rounded-md px-6 py-1 font-audiowide tracking-wider text-[#A3E81D]"
            >
              SIGN UP
            </button>
            <div className="">
              <GoogleAuthBtn />
            </div>
          </div>

          <p className="font-extralight text-sm mb-2 mt-10 text-center font-audiowide tracking-wider text-white">
            Already have an account?{' '}
            <Link to={'/login'}>
              <span className="text-[#A3E81D] tracking-wider">LOGIN</span>
            </Link>
          </p>
        </form>

        <div className="bg-white w-1/2 p-5">
          <nav className="font-oswald w-fit float-right text-black flex gap-x-10 uppercase tracking-widest font-semibold">
            <a href="/" className="hover:text-orange-500 transition-colors">Home</a>
            <a href="#about-us" className="hover:text-orange-500 transition-colors">About Us</a>
            <a href="#products" className="hover:text-orange-500 transition-colors">Products</a>
            <a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a>
          </nav>
          <img
            src="https://i.pinimg.com/originals/0d/fa/22/0dfa222a62b6002b7d53bd487e4e4421.gif"
            className="mt-20 mx-auto"
          />
        </div>
      </div>

     {isOpenPopup && (
        <OtpPopup
          setIsOpenPopup={setIsOpenPopup}
          showToast={showToast}
        />
      )}
    </div>
  );
};

export default RegisterPage;
