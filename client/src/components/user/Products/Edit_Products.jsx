import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { IoIosCloseCircle } from 'react-icons/io';
import { MdCropFree } from 'react-icons/md';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; // Cropper CSS
import { showToast } from '../../../helper/toast';
import Loader from '../../Loader';

const Edit_Products = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cropperRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const fetchBrands = async () => {
    try {
      const response = await axios.get('http://localhost:3000/admin/get_all_brands');
      const listedBrands = response.data.filter(element => element.status === true);
      setBrands(listedBrands.length > 0 ? listedBrands : []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load brands.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/admin/get_all_categories');
      const listedCategories = response.data.filter(element => element.status === true);
      setCategories(listedCategories.length > 0 ? listedCategories : []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load categories.');
    }
  };

  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    status: false,
    category: '',
    brand: '',
    images: [],
    croppedImages: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingbtn, setLoadingbtn] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [imageIndex, setImageIndex] = useState(null);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/admin/get_edit_product/${id}`);
      const productData = response.data.product;
      setProduct(productData);
      setFormData({
        ...formData,
        name: productData?.name || '',
        description: productData?.description || '',
        price: productData?.price || '',
        stock: productData?.stock || '',
        status: productData?.status ,
        category: productData?.category || '',
        brand: productData?.brand || '',
        images: productData?.imageUrls || [],
        croppedImages: productData?.imageUrls || [],
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
    fetchBrands();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const fieldErrors = {};
    if (!formData.name) fieldErrors.name = "Name cannot be empty.";
    if (!/^[a-zA-Z\s]+$/.test(formData.name)) fieldErrors.name = "Name must contain only letters.";
    if (formData.name.length < 3) fieldErrors.name = "Name must be at least 3 characters.";

    if (!formData.price) fieldErrors.price = "Price cannot be empty.";
    if (!/^\d+$/.test(formData.price)) fieldErrors.price = "Price must contain only numbers.";

    if (!formData.description) fieldErrors.description = "Description cannot be empty.";
    if (formData.description.length < 10) fieldErrors.description = "Description must be at least 10 characters.";

    if (!formData.stock) fieldErrors.stock = "Stock cannot be empty.";
    if (!/^\d+$/.test(formData.stock)) fieldErrors.stock = "Stock must contain only numbers.";

    if (!formData.category) fieldErrors.category = "Category is required.";
    if (!formData.brand) fieldErrors.brand = "Brand is required.";

    if (formData.images.length < 3) fieldErrors.images = "You must upload at least 3 images.";
    return fieldErrors;
  };

  const openCropper = (image, index) => {
    setCurrentImage(image);
    setImageIndex(index);
    setShowCropper(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    let isValid = true;

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

  const [isCropped, setIsCropped] = useState(false);

  const handleCrop = (event) => {
    if (event) event.preventDefault();

    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      const canvas = cropper.getCroppedCanvas();
      const croppedImageUrl = canvas.toDataURL();

      setFormData((prev) => {
        const updatedImages = [...prev.images];
        const updatedCroppedImages = [...prev.croppedImages];
        updatedCroppedImages[imageIndex] = croppedImageUrl;
        updatedImages[imageIndex] = croppedImageUrl;
        return {
          ...prev,
          croppedImages: updatedCroppedImages,
          images: updatedImages,
        };
      });

      setShowCropper(false);
      setIsCropped(true);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);

    const updatedCroppedImages = [...formData.croppedImages];
    updatedCroppedImages.splice(index, 1);

    setFormData({
      ...formData,
      images: updatedImages,
      croppedImages: updatedCroppedImages,
    });
  };

  const convertToBlob = async (file, index) => {
    if (typeof file === "string" && file.startsWith("data:image/")) {
      const [metadata, base64Data] = file.split(",");
      const mimeType = metadata.match(/data:(image\/[a-zA-Z]+);base64/)[1];
      const binaryData = atob(base64Data);
      const arrayBuffer = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        arrayBuffer[i] = binaryData.charCodeAt(i);
      }
      return new Blob([arrayBuffer], { type: mimeType });
    } else if (typeof file === "string" && file.startsWith("http")) {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`Failed to fetch image from URL: ${file}`);
      }
      return await response.blob();
    } else if (file instanceof File || file instanceof Blob) {
      return file;
    } else {
      throw new Error(`Unsupported file format: ${file}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Cropped Images: ", formData.croppedImages);
    console.log("Normal Images: ", formData.images);
  
    const fieldErrors = validateFields();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
  
    setLoadingbtn(true);
  
    const uploadData = new FormData();
    uploadData.append("name", formData.name);
    uploadData.append("price", formData.price);
    uploadData.append("description", formData.description);
    uploadData.append("stock", formData.stock);
    uploadData.append("status", formData.status );
    uploadData.append("category", formData.category);
    uploadData.append("brand", formData.brand);    
  
    try {
      
      const blobImages = await Promise.all(
        formData.images.map((file, index) => convertToBlob(file, index))
      );
  
      blobImages.forEach((blob, index) => {
        uploadData.append("images", blob, `image-${index}`);
      });
    
      const response = await axios.put(
        `http://localhost:3000/admin/update_product/${id}`,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if(response.status === 200){

        showToast("Product updated successfully!",'light','success');
        navigate("/dashboard/products");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setErrors({
        general: error.response?.data?.message || "Failed to update product.",
      });
    } finally {
      setLoadingbtn(false);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-gray-600">Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-gray-600">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>
          <div>
            <label className="block text-gray-600">Stock</label>
            <input
              type="text"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
            {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
          </div>
          <div>
            <label className="block text-gray-600">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-gray-600">Brand</label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
          </div>
          <div>
            <label className="block text-gray-600">Images (at least 3)</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              accept="image/*"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
            {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
            <div className="mt-3 flex space-x-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <IoIosCloseCircle
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 text-red-500 cursor-pointer"
                  />
                  <MdCropFree
                    onClick={() => openCropper(image, index)}
                    className="absolute bottom-0 left-0 text-blue-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
          {showCropper && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
              <div className="bg-white p-4 rounded">
                <Cropper
                  ref={cropperRef}
                  src={currentImage}
                  style={{ width: '400px', height: '400px' }}
                  aspectRatio={16 / 9}
                  guides={false}
                />
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => setShowCropper(false)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCrop}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="mt-4">
            <button
              type="submit"
              disabled={loadingbtn}
              className={`w-full px-4 py-2 bg-blue-500 text-white rounded ${loadingbtn ? 'opacity-50' : ''}`}
            >
              {loadingbtn ? <Loader/> : 'Update Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Edit_Products;
