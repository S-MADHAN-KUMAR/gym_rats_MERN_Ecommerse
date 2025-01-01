import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { showToast } from '../../../src/helper/toast.js';
import jwt_decode from "jwt-decode";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RegisterFailure, RegisterStart, RegisterSuccess } from '../../redux/user/userSlice.js';

const GoogleAuthBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse) => {
    dispatch(RegisterStart());
    try {
      const credentialResponseData = jwt_decode(credentialResponse.credential); // Decoding JWT
      const data = { credential: credentialResponseData };

      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/handle_google_auth`, data)
      console.log(response.data);
      dispatch(RegisterSuccess(response?.data?.user));
      showToast(response.data.message, 'light', 'success');
      navigate('/');
    } catch (error) {
      dispatch(RegisterFailure());
      if (error.response && error.response.status === 403) {
        showToast('Access denied: User is blocked or inactive', 'dark', 'error');
      } else {
        showToast('Google authentication failed', 'dark', 'error');
      }
      console.error('Google login failed', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => handleGoogleLogin(credentialResponse)}
      onError={() => console.log('Login Failed')}
      shape="rectangular"
      text="continue_with"
      width="200"
    />
  );
};

export default GoogleAuthBtn;
