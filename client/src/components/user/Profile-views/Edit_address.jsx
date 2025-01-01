import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const Edit_address = () => {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    addressline1: "",
    addressline2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [address, setAddress] = useState([]);

  const fetchCurrentAddress = async () => {
    try {
      const data = {
        addressId: id,
        userId: currentUser?._id,
      };
      const res = await axios.post(
        `http://localhost:3000/user/get_edit_address`,
        data
      );
      if (res.status === 200) {
        setAddress(res.data);
        setFormData(res.data); // Populate formData with fetched address
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching address:", error.message);
    }
  };

  useEffect(() => {
    fetchCurrentAddress();
  }, [id]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Name must contain only letters and spaces";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.addressline1.trim()) {
      newErrors.addressline1 = "Address Line 1 is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        // Identify fields that have changed
        const updatedFields = {};
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== address[key]) {
            updatedFields[key] = formData[key];
          }
        });
  
        if (Object.keys(updatedFields).length === 0) {
          alert("No changes detected.");
          return;
        }
  
        const res = await axios.put(
          `http://localhost:3000/user/update_address`,
          { userId: currentUser?._id, addressId:id, newAddress: updatedFields }
        );
  
        if (res.status === 200) {
          alert("Address updated successfully");
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        console.error("Error updating address:", error.message);
      }
    } else {
      console.log("Form contains errors:", errors);
    }
  };
  

  return (
    <div className="border p-5 flex flex-col justify-center items-center w-full gap-y-12">
      <p className="font-audiowide text-3xl uppercase tracking-wide drop-shadow">
        Edit Address
      </p>
      <div className="border w-full h-[72vh] p-5">
        <form
          className="flex flex-col border justify-between h-full"
          onSubmit={handleSubmit}
        >
          {/* Form Fields */}
          <div className="flex justify-between gap-x-10">
            <div className="flex flex-col w-full">
              <label htmlFor="name" className="font-semibold">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="border bg-gray-600 p-3 rounded focus:outline-none focus:ring focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="phone" className="font-semibold">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border bg-gray-600 p-3 rounded focus:outline-none focus:ring focus:ring-blue-500"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="addressline1" className="font-semibold">
              Address Line 1
            </label>
            <input
              type="text"
              id="addressline1"
              value={formData.addressline1}
              onChange={handleChange}
              className="border bg-gray-600 p-3 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
            {errors.addressline1 && (
              <p className="text-red-500 text-sm">{errors.addressline1}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="addressline2" className="font-semibold">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              id="addressline2"
              value={formData.addressline2}
              onChange={handleChange}
              className="border bg-gray-600 p-3 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between gap-x-10">
            <div className="flex flex-col w-full">
              <label htmlFor="city" className="font-semibold">
                City
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={handleChange}
                className="border bg-gray-600 p-3 rounded focus:outline-none focus:ring focus:ring-blue-500"
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city}</p>
              )}
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="state" className="font-semibold">
                State
              </label>
              <input
                type="text"
                id="state"
                value={formData.state}
                onChange={handleChange}
                className="border bg-gray-600 p-3 rounded focus:outline-none focus:ring focus:ring-blue-500"
              />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="pincode" className="font-semibold">
              Pincode
            </label>
            <input
              type="text"
              id="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="border bg-gray-600 p-3 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm">{errors.pincode}</p>
            )}
          </div>

          <div className="flex justify-center gap-x-5 py-5">
            <button
              type="submit"
              className="bg-green-500 p-3 rounded font-semibold hover:bg-green-600 transition-all"
            >
              Update Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit_address;
