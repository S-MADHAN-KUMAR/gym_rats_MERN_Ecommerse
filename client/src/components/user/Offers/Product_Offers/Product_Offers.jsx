import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showBlockConfirmation } from '../../../../helper/Sweat';

const Product_Offers = () => {
  const [productOffers, setProductOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product offers
  const fetchProductOffers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/admin/get_all_product_offer');
      setProductOffers(response.data);
    } catch (err) {
      setError('Failed to fetch product offers. Please try again later.');
      console.error('Error fetching product offers:', err);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  // Call the fetch function when the component is mounted
  useEffect(() => {
    fetchProductOffers();
  }, []);

  const handleBlock = async (id, currentStatus) => {
    const newStatus = currentStatus ? false : true; // Toggle between true and false
    const title = `Do you want to ${newStatus ? 'Activate' : 'Block'} the Offer?`;

    showBlockConfirmation(title, newStatus, async () => {
      try {
        await axios.put('http://localhost:3000/admin/block_product_offer', { id, status: newStatus });
        fetchProductOffers(); // Corrected the function name here
        alert(`Offer has been ${newStatus ? 'listed' : 'unlisted'}`);
      } catch (error) {
        console.error('Error blocking product:', error);
        alert('Failed to update product status');
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-4xl tracking-wider h1">Products Offers List</h1>
        <a href="/dashboard/add_products_offers" className="button">
          <span> + Add product offer </span>
        </a>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-center text-sm">
          {/* Table Head */}
          <thead className="th pop uppercase tracking-wider">
            <tr>
              <th className="p-4">Product Image</th>
              <th className="p-4">Product Name</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Expiry Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {productOffers && productOffers.length > 0 ? (
              productOffers.map((offer, index) => (
                <tr key={index} className="tb border-y-4 border-black">
                  <td className="p-4">
                    <img src={offer.productImage} className="w-40" alt={offer.productName} />
                  </td>
                  <td className="p-4">{offer.productName}</td>
                  <td className="p-4">{offer.discount}%</td>
                  <td className="p-4">{new Date(offer.endDate).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span
                      className={`px-8 py-2 font-semibold uppercase ${
                        offer.status === true ? 'text-white bg-green-600' : 'text-white bg-red-600'
                      }`}
                    >
                      {offer.status === true ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleBlock(offer._id, offer.status)} // Corrected the reference here
                      className={`px-8 py-2 font-semibold uppercase ${
                        offer.status ? 'text-white bg-red-600' : 'text-white bg-green-600'
                      }`}
                    >
                      {offer.status ? 'Block' : 'Unblock'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No product offers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product_Offers;
