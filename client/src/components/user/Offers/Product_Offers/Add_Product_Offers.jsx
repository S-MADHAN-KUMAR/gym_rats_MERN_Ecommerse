import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Add_Product_Offers() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(''); // Only a single product selected
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Error state for better error handling

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/admin/get_all_products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle product selection change (only one product)
  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);  // Set the selected product ID
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Basic validation for discount
    if (!discount || isNaN(discount) || discount <= 0) {
      alert("Please enter a valid discount.");
      return;
    }
  
    const offerData = {
      productId: selectedProduct,  // Use the selected product ID (single product)
      discount,
      startDate,
      endDate,
      status,
    };
  
    console.log(offerData); // Log the offerData to ensure the selected product is correct
  
    try {
      const response = await axios.post('http://localhost:3000/admin/add_product_offer', offerData);
  
      if (response.status === 200) {
        alert("Product offer added successfully!");
      } else if (response.status === 400 && response.data.msg) {
        // If the offer already exists
        alert(response.data.message);  // Show the error message returned from the server
      }
    } catch (error) {
 
        alert(error.response.data.message); // Show the server error message

    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white text-black p-5">
      <div>
        <label htmlFor="products" className="block text-sm font-medium text-gray-700">Products</label>
        <select
          id="products"
          value={selectedProduct}
          onChange={handleProductChange} // Handle product selection
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id} className="flex items-center py-2 px-4 hover:bg-gray-200">
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount</label>
        <input
          id="discount"
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value === 'true')}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded-lg"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Add Product Offer'}
      </button>
    </form>
  );
}

export default Add_Product_Offers;
