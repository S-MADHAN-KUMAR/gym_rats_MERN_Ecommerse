import React, { useState } from "react";
import axios from "axios";

const NewPasswordPopup = ({ setIsOpenNewPopup, showToast, email }) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { password: "", confirmPassword: "" };

    // Check if password is empty or less than 8 characters
    if (!formData.password) {
      newErrors.password = "Password cannot be empty.";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      isValid = false;
    }

    // Check if confirm password is empty or does not match
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password cannot be empty.";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Send the password and email to the backend for updating
        const res = await axios.post("http://localhost:3000/user/updatePassword", {
          password: formData.password,
          email: email,
        });

        if (res.status === 200) {
          showToast("Password updated successfully!");
          setFormData({ password: "", confirmPassword: "" }); // Clear the form after success
          setIsOpenNewPopup(false); // Close the popup
        }
      } catch (error) {
        console.error("Error updating password:", error);
        showToast("Failed to update password.");
      }
    }
  };

  return (
    <div className="bg-black/80 z-10 fixed flex justify-center items-center top-0 left-0 right-0 bottom-0 font-Roboto">
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col text-center bg-white rounded-md w-2/5 h-2/3"
      >
        <div className="flex flex-col p-4">
          <h1 className="text-3xl font-audiowide uppercase font-semibold tracking-wider w-full mb-12">
            Enter Your New Password
          </h1>

          <input
            type="password"
            placeholder="New Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="bg-gray-800 mb-2 p-4 rounded-md text-white w-11/12 mx-auto"
          />
          {errors.password && (
            <p className="text-red-500 text-sm w-11/12 mx-auto">
              {errors.password}
            </p>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="bg-gray-800 mb-2 p-4 rounded-md text-white w-11/12 mx-auto"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm w-11/12 mx-auto">
              {errors.confirmPassword}
            </p>
          )}

          <div className="flex justify-between w-full mt-12">
            <button
              type="submit"
              className="bg-black text-white p-3 font-semibold w-1/3 rounded-md"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsOpenNewPopup(false)}
              className="bg-black text-white p-3 font-semibold w-1/3 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewPasswordPopup;
