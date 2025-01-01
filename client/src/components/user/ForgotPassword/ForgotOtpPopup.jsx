import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import NewPasswordPopup from './NewPasswordPopup';

const ForgotOtpPopup = ({ setIsOpenOtpPopup, showToast ,email }) => {
  const [IsOpenNewPopup,setIsOpenNewPopup] = useState(false)
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [err, setErr] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0); 
  const navigate = useNavigate()



  const handleChange = (element, index) => {
    const value = element.value;
    if (!isNaN(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && element.nextSibling) {
        element.nextSibling.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(''); 
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setErr('Please enter a valid 6-digit OTP');
      return;
    }


    const formdata = {
      email: email,
      otp: otpValue,
    };

    console.log('>>>>>>',formdata);
    

    try {
      const response = await axios.post('http://localhost:3000/user/verifyForgotPassword', formdata);

      if (response.status === 200) {
        showToast('OTP verified successfully!','light', 'success');
        setIsOpenNewPopup(true); 
      }
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to verify OTP');5
     
      setResendDisabled(false);
      setTimer(0);
    }
  };

  const handleResendOtp = async () => {
    setErr('');

    try {
      setResendDisabled(true);
      setTimer(60);
      setOtp(new Array(6).fill(''));
      const response = await axios.post('http://localhost:3000/user/resendOtpForgotPassword', { email });

      if (response.status === 200) {
        showToast('OTP resent successfully!', 'light','success');
      }
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to resend OTP');
      setResendDisabled(false);
    }
  };

  useEffect(() => {
    let interval;
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }

    return () => clearInterval(interval); 
  }, [resendDisabled, timer]);

  return (
    <div className="bg-black/80 z-10 fixed flex justify-center items-center top-0 left-0 right-0 bottom-0">
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col text-center bg-white rounded-md w-2/5 h-2/3"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsOpenOtpPopup(false)}
          className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-800 btn"
        >
          Back
        </button>

        <div className="flex flex-col p-4">
          <h1 className="text-4xl font-audiowide uppercase font-semibold tracking-wider w-full">
            Enter OTP
          </h1>
          <div className="mt-20 flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`bg-gray-900 text-white text-center text-xl font-bold placeholder:text-sm w-16 h-16 rounded-md ${
                  resendDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              />
            ))}
          </div>
          {err && <p className="text-red-600 mt-4 text-sm">{err}</p>}
          <button
            type="submit"
            className="bg-black text-white mt-20 px-6 py-2 font-oswald uppercase tracking-wider"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendDisabled}
            className={`mt-4 text-sm ${
              resendDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 cursor-pointer'
            }`}
          >
            {resendDisabled ? `Resend OTP in ${timer}s` : 'Resend OTP'}
          </button>
        </div>
      </form>
      {
        IsOpenNewPopup ? <NewPasswordPopup setIsOpenNewPopup={setIsOpenNewPopup} email={email} showToast={showToast} /> : ""
      }
    </div>
  );
};

export default ForgotOtpPopup;
