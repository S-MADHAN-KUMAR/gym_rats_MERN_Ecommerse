import React, { useEffect, useState } from 'react';
import axios from 'axios'
import {useSelector} from 'react-redux'

const Add_address = () => {
  const {currentUser} = useSelector((state)=>state.user)

  const [formData, setFormData] = useState({
    id: currentUser?._id,
    name: '',
    phone: '',
    addressline1: '',
    addressline2: '',
    city: '',
    state: '',
    pincode: '',
  });
  

  const [errors, setErrors] = useState({});

  // Validation Logic
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name must contain only letters and spaces';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.addressline1.trim()) {
      newErrors.addressline1 = 'Edit_address Line 1 is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // No errors
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        console.log(formData)
        const res = await axios.post('http://localhost:3000/user/add_address', formData);
        if (res.status === 200) {
          setFormData({
            name: '',
            phone: '',
            addressline1: '',
            addressline2: '',
            city: '',
            state: '',
            pincode: '',
          });
          alert('Address added successfully');
        } else {
          console.log(res.data.message);
          alert(res.data.message);
        }
      } catch (error) {
        console.log(error.message);
        alert('Failed to add address');
      }
    } else {
      console.log('Form contains errors:', errors);
    }
  };
  

  return (
    <div className="border p-5 flex flex-col justify-center items-center w-full gap-y-12">
      <p className="font-audiowide text-3xl uppercase tracking-wide drop-shadow">
       edit address
      </p>
      {/* Name and Phone */}
      <div className="border w-full h-[72vh] p-5">
        <form className="flex flex-col border justify-between h-full" onSubmit={handleSubmit}>
<div className="flex  justify-between gap-x-10">
             {/* Name */}
           <div className="flex flex-col w-full ">
             <label htmlFor="name" className="font-semibold">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="border  bg-gray-600 p-3 rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
           </div>
          {/* Phone */}
           <div className="flex flex-col w-full">
          <label htmlFor="phone" className="font-semibold">
            Phone
          </label>
          <input
            type="number"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border w-full bg-gray-600 p-3 rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
</div>

{/* address 1 address 2 */}
<div className="flex justify-between gap-x-10">
            {/* Address Line 1 */}
<div className="flex flex-col w-full">
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
          {errors.addressline1 && <p className="text-red-500 text-sm">{errors.addressline1}</p>}
</div>
<div className="flex flex-col w-full">
          {/* Address Line 2 */}
          <label htmlFor="addressline2" className="font-semibold">
            Address Line 2
          </label>
          <input
            type="text"
            id="addressline2"
            value={formData.addressline2}
            onChange={handleChange}
            className="border bg-gray-600 p-3 rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
          </div>
</div>

          <div className="flex justify-between gap-x-10">
            <div className="flex flex-col w-full ">
              {/* City */}
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
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

            </div>
            <div className="flex flex-col w-full ">
          {/* State */}
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
          {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
          </div>
          <div className="flex flex-col w-full ">
          {/* Pincode */}
          <label htmlFor="pincode" className="font-semibold">
            Pincode
          </label>
          <input
            type="number"
            id="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="border bg-gray-600 p-3 rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
          {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
          </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add_address;
