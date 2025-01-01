import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { IoIosCloseCircle } from "react-icons/io";
import { MdCropFree } from "react-icons/md";
import { showToast } from '../../../helper/toast.js';
import { productValidationSchema } from "../../../validations/productValidation.js";
import Button from "../../../components/Button.jsx";

const AddProduct = () => {

  const [categories,setCategories] = useState([])
  
  const [brands,setBrands]=useState([])

useEffect(()=>{
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/admin/get_all_categories');
      console.log('API Response:', response.data); 

      const listedCategories = response.data.filter(element => element.status === true);
      
      if (listedCategories.length > 0) {
        setCategories(listedCategories); 
      } else {
        console.error('No listed categories found');
        setCategories([]);
      }
      

    } catch (err) {
      console.error(err);
      showToast('Failed to load categories.');
    }
  };
  const fetchBrands = async () => {
    try {
      const response = await axios.get('http://localhost:3000/admin/get_all_brands');
      console.log('API Response:', response.data?.brands); 

      const listedCategories = response.data.filter(element => element.status === true);
      
      if (listedCategories.length > 0) {
        setBrands(listedCategories); 
      } else {
        console.error('No listed categories found');
        setBrands([]);
      }
      

    } catch (err) {
      console.error(err);
      showToast('Failed to load categories.');
    }
  };

  fetchCategories();
  fetchBrands()
},[])

  const cropperRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    status: true,
    brand: "",
    stock:"",
    images: [],
    croppedImages: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [imageIndex, setImageIndex] = useState(null);
  const navigate = useNavigate();

 


  const removeImage = (index) => {
  
    const updatedImages = [...formData.images]; 
  
 
    updatedImages.splice(index, 1);
  
    setFormData({ ...formData, images: updatedImages });
  };
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); 
  };


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    let isValid = true;

    console.log(files);
    
  
    const invalidFiles = files.filter((file) => !validImageTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        images: "Please upload only valid images (jpeg, png, gif).",
      }));
      e.target.value = ''; 
      isValid = false;
    } 
  
    if (files.length > 5) {
      setErrors((prev) => ({
        ...prev,
        images: "You can upload up to 5 images only.",
      }));
      e.target.value = '';
      isValid = false;
    }
  
    if (isValid) {
      setFormData((prevData) => ({
        ...prevData,
        images: files,
      }));
      setErrors((prev) => ({
        ...prev,
        images: "",
      }));
    }
  };
  

  const openCropper = (file, index) => {
    setCurrentImage(file);
    setImageIndex(index); 
    setShowCropper(true);
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      const canvas = cropper.getCroppedCanvas();
      const croppedImageUrl = canvas.toDataURL();
      const updatedCroppedImages = [...formData.croppedImages];
      updatedCroppedImages[imageIndex] = croppedImageUrl; 
      setFormData({
        ...formData,
        croppedImages: updatedCroppedImages,
      });
      setShowCropper(false);
    }
  };


  const validateForm = async () => {
    try {
      await productValidationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = validationErrors.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setErrors(newErrors);
      return false;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Cropped Images: ", formData.croppedImages);
  
    const isValid = await validateForm();
    if (!isValid) return;
  
    setLoading(true);
  
    const uploadData = new FormData();
    uploadData.append("name", formData.name);
    uploadData.append("price", formData.price);
    uploadData.append("description", formData.description);
    uploadData.append("stock", formData.stock);
    uploadData.append("status", formData.status);
    uploadData.append("category", formData.category);
    uploadData.append("brand", formData.brand);
  
    const finalImages = formData.images.map((originalImage, index) => {
      if (formData.croppedImages[index]) {
        const base64 = formData.croppedImages[index];
        const byteString = atob(base64.split(",")[1]);
        const mimeString = base64.match(/:(.*?);/)[1];
        const byteArray = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          byteArray[i] = byteString.charCodeAt(i);
        }
        return new Blob([byteArray], { type: mimeString });
      }
      return originalImage;
    });
  
    finalImages.forEach((file, index) => {
      uploadData.append("images", file, `image-${index}`);
    });
  
    try {
      const response = await axios.post("http://localhost:3000/admin/add_product", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
if(
  response.status === 200 ){
    showToast("Product added successfully!");
    navigate("/dashboard/products");

  }
  
    } catch (error) {
      console.error("Error adding product:", error);
      setErrors({
        general: error.response?.data?.message || "Failed to add product.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <div className=" bg-gray-10 flex flex-wrap items-center justify-center text-black">
    <div className="w-full  bg-white  p-6">
      <h1 className="text-5xl tracking-wider Header">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col justify-center items-center ">
       
   
         {/* Name */}
         <div className=" w-full">
          <label className="block text-gray-700 font-semibold mb-1 u ">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full border rounded-md p-2 focus:outline-none ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
  
  
        {/* Description */}
        <div className="w-full ">
          <label className="block text-gray-700 font-semibold mb-1">Description</label>
          <textarea
          style={{ height: '150px', resize: 'none' }}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full border rounded-md p-2 focus:outline-none    ${
              errors.description ? "border-red-500 h-full" : "border-gray-300 h-full"
            }`}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>


        <div className="flex w-full justify-between">
        {/* Price */}
        <div >
          <label className="block text-gray-700 font-semibold mb-1">Price</label>
          <input
            type="number"
            name="price"
            
            value={formData.price}
            onChange={handleInputChange}
            className={`w-full border rounded-md p-2 focus:outline-none  ${
              errors.price ? "border-red-500  " : "border-gray-300  "
            }`}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>


  
        {/* Stock */}
        <div >
          <label className="block text-gray-700 font-semibold mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            className={`w-full border rounded-md p-2 focus:outline-none ${
              errors.stock ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
          )}
        </div>
  
        {/* Category */}
        <div >
          <label className="block text-gray-700 font-semibold mb-1">Category</label>
          <select
  name="category"
  value={formData.category}
  onChange={handleInputChange}
  className={`w-full border rounded-md p-2 focus:outline-none ${
    errors.category ? "border-red-500" : "border-gray-300"
  }`}
>
  <option value="">Select a category</option>
  {categories.map((cat) => (
    <option key={cat._id} value={cat._id}>
      {cat.name}
    </option>
  ))}
</select>

          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>
  
        {/* Brand */}
        <div >
          <label className="block text-gray-700 font-semibold mb-1">Brand</label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className={`w-full border rounded-md p-2 focus:outline-none ${
              errors.brand ? "border-red-500" : "border-gray-300"
            }`}
            >
            <option value="">Select a brand</option>
            {brands?.length > 0 ? (
  brands.map((brand) => (
    <option key={brand._id} value={brand.name}>
      {brand.name}
    </option>
  ))
) : (
  <option disabled>No brands available</option>
)}

          </select>
          {errors.brand && (
            <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
          )}
        </div>
          </div>
  
        {/* Image Upload */}
        <div className=" flex flex-col gap-y-6 justify-between w-full">
          <label className="block mr-auto text-gray-700 font-medium mb-1">
            Upload Images (Min: 3, Max: 5)
          </label>
      
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/gif"
            className={`w-full border rounded-md p-2 focus:outline-none ${
              errors.images ? "border-red-500" : "border-gray-300"
            }`}
          />
        
  
          <div className="flex gap-x-6">
            {formData.images.map((file, index) => (
              <div

                key={index}
                className="inline-block m-2 cursor-pointer relative"
                
              >
                {/* Show cropped image preview if available */}
                <img
                  src={
                    formData.croppedImages[index] ||
                    URL.createObjectURL(file)
                  }
                  alt={`Preview ${index}`}
                  className="min-w-28 min-h-28 w-28 h-28 object-cover rounded-md"
                />
                <img className="hover:scale-110 w-7 h-7 absolute -top-3 -right-3" src="https://img.icons8.com/?size=100&id=faXHmzlIKEVi&format=png&color=000000" onClick={(e) => {
      e.stopPropagation();
      removeImage(index);
    }} />
             

  <img src="https://img.icons8.com/?size=100&id=pLN47yX6z9KR&format=png&color=000000" onClick={() => openCropper(file, index)} className=" w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 " />
 
              </div>
            ))}
          </div>
          {errors.images && (
            <p className="text-red-500 text-sm mt-1">{errors.images}</p>
          )}
        </div>
  
        {/* Show Cropper */}
        {showCropper && (
          <div className="fixed -top-10 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md shadow-md">
              <Cropper
                ref={cropperRef}
                src={URL.createObjectURL(currentImage)}
                style={{ width: "100%", height: "400px" }}
                aspectRatio={1}
                guides={false}
              />
              <button
                onClick={handleCrop}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Crop Image
              </button>
              <button
                onClick={() => setShowCropper(false)}
                className="mt-2 ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
  
        {/* Submit Button */}
        <div className="flex justify-around w-full gap-x-8  ">
        <Button
            label="Submit Product"
            onClick={handleSubmit}
            isLoading={loading}  // Pass the loading state to Button component
            type="submit"
          />

          <Button navigateTo={'/dashboard/products'} label='Back'  />

         
        </div>
  
        {/* Error Message */}
        {errors.general && (
          <p className="text-red-500 text-sm mt-2">{errors.general}</p>
        )}
      </form>
    </div>
    
  </div>
  
  );
};

export default AddProduct;
