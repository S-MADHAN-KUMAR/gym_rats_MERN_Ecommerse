import React, { useState } from "react";
import axios from "axios";
import ForgotOtpPopup from './ForgotOtpPopup'


const ForgotEmail = ({ setIsOpenEmailPopup, showToast }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [IsOpenOtpPopup, setIsOpenOtpPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    console.log(email);
    

    if (!email) {
      setError("Email field cannot be empty.");
    } else if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
    } else {
      setError(""); // Reset error message
      try {
        const res = await axios.get(`http://localhost:3000/user/forgotPassword/${email}`);
        
        if (res.status === 200) {
          console.log(res.data.message);
          showToast(res.data.message, 'light', 'success');
          setIsOpenOtpPopup(true);
        } else {
          console.log(res.data.message);
          showToast(res.data.message, 'dark', 'error');
        }
      } catch (error) {
        if (error.response && error.response.data) {
          showToast(error.response.data.message,'dark','error');
        } else {
          setError("An error occurred, please try again later.");
        }
      }
    }
  };

  return (
    <div className="bg-black/80 z-10 fixed flex justify-center items-center top-0 left-0 right-0 bottom-0 font-Roboto">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="relative flex flex-col text-center bg-white rounded-md w-2/5 h-2/3"
      >
        <div className="flex flex-col p-4 font-Roboto">
          <h1 className="text-3xl font-audiowide uppercase font-semibold tracking-wider w-full mb-6">
            Enter Your Email
          </h1>

          <div className="flex flex-col h-[300px] justify-between">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mx-auto mt-12 bg-gray-700 p-3 w-3/4 placeholder:font-audiowide placeholder:uppercase text-white"
              placeholder="Enter your Email"
            />

            {error && (
              <span className="text-red-600 text-sm mt-2">{error}</span>
            )}

            <button type="submit" className="btn w-1/3 ms-auto mt-6">
              Next
            </button>
          </div>
        </div>
      </form>

      {IsOpenOtpPopup ? (
        <ForgotOtpPopup
        setIsOpenOtpPopup={setIsOpenOtpPopup}
        showToast={showToast} email={email} />
      ):""}
    </div>
  );
};

export default ForgotEmail;
