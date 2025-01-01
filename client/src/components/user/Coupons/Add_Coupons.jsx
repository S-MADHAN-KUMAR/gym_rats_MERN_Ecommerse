import axios from "axios";
import React, { useState } from "react";

const AddCoupons = () => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discount: "",
    minDiscountAmount: "",
    maxDiscountAmount: "",
    startDate: "",
    endDate: "",
    status: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validate fields based on schema
  const validateFields = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Coupon name is required.";
    if (!formData.code.trim()) errors.code = "Coupon code is required.";
    if (!formData.discount) {
      errors.discount = "Discount is required.";
    } else if (isNaN(formData.discount) || formData.discount <= 0) {
      errors.discount = "Discount must be a positive number.";
    }
    if (!formData.minDiscountAmount) {
      errors.minDiscountAmount = "Minimum discount amount is required.";
    } else if (isNaN(formData.minDiscountAmount) || formData.minDiscountAmount <= 0) {
      errors.minDiscountAmount = "Minimum discount amount must be a positive number.";
    }
    if (!formData.maxDiscountAmount) {
      errors.maxDiscountAmount = "Maximum discount amount is required.";
    } else if (
      isNaN(formData.maxDiscountAmount) ||
      formData.maxDiscountAmount < formData.minDiscountAmount
    ) {
      errors.maxDiscountAmount =
        "Maximum discount amount must be greater than or equal to the minimum discount amount.";
    }
    if (!formData.startDate) {
      errors.startDate = "Start date is required.";
    } else if (new Date(formData.startDate) < new Date()) {
      errors.startDate = "Start date cannot be in the past.";
    }
    if (!formData.endDate) {
      errors.endDate = "End date is required.";
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      errors.endDate = "End date must be after the start date.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate fields
    const fieldErrors = validateFields();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
  
    setLoading(true);
    try {
      const payload = { ...formData };
      const res = await axios.post("http://localhost:3000/admin/add_coupon", payload);
  
      if (res.status === 201) {
        alert("Coupon added successfully!");
        setFormData({
          name: "",
          code: "",
          discount: "",
          minDiscountAmount: "",
          maxDiscountAmount: "",
          startDate: "",
          endDate: "",
          status: true,
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Error submitting coupon:", error);
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Coupon</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">Coupon Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Coupon Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className= "text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}
          </div>

          <div>
            <label className="block text-gray-600 font-medium">
              Minimum Discount Amount
            </label>
            <input
              type="number"
              name="minDiscountAmount"
              value={formData.minDiscountAmount}
              onChange={handleChange}
              className="mt-1 text-black block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.minDiscountAmount && (
              <p className="text-red-500 text-sm">{errors.minDiscountAmount}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 font-medium">
              Maximum Discount Amount
            </label>
            <input
              type="number"
              name="maxDiscountAmount"
              value={formData.maxDiscountAmount}
              onChange={handleChange}
              className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.maxDiscountAmount && (
              <p className="text-red-500 text-sm">{errors.maxDiscountAmount}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
          </div>

          <div>
            <label className="block text-gray-600 font-medium">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
              className="text-black h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label className="ml-2 text-gray-600">Active Status</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Add Coupon"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCoupons;
