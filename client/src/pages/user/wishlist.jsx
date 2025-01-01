import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Add this import

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const loadWishlist = async () => {
    if (!currentUser) {
      setError('Please log in to view your wishlist.');
      setLoading(false);
      return;
    }

    try {
      const id = currentUser._id;
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/get_user_wishlist/${id}`);
      if (res.status === 200) {
        setWishlist(res?.data?.wishlist || []);
      } else {
        setError('Failed to load wishlist. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching your wishlist.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      if (!currentUser) {
        console.error('User not logged in');
        return;
      }

      if (!productId) {
        console.error('Product not available');
        return;
      }

      setLoading(true);
      const payload = {
        userId: currentUser?._id,
        productId: productId,
      };

      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/add_to_cart`, payload);

      if (res.status === 200) {
        setAdded(true);
      } else {
        console.error('Failed to add product to cart:', res.data.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [currentUser]);

  const handleRemoveProduct = async (productId) => {
    try {
      const payload = {
        userId: currentUser?._id,
        productId,
      };
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/user/remove_wishlist_product`,
        payload
      );
      if (res.status === 200) {
        alert(res?.data?.message);
        loadWishlist();
      }
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
    }
  };

  if (loading) {
    return <div>Loading your wishlist...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        {error}
        <button onClick={loadWishlist} className="ml-2 text-blue-500 underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Your Wishlist</h1>
      {wishlist.products?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wishlist.products.map((item) => (
            <div key={item._id} className="p-4 border rounded-md shadow-sm relative">
              <img
                src={item.image}
                alt={`Product image for ${item.name}`}
                className="w-full h-40 object-cover mb-2"
              />
              <h2 className="text-lg font-medium">{item.name}</h2>
              <p className="text-gray-700">Price: ${item.price}</p>
              <img
                onClick={() => handleRemoveProduct(item.productId)}
                src="https://img.icons8.com/?size=100&id=faXHmzlIKEVi&format=png&color=000000"
                className="absolute w-10 top-2 right-2 hover:scale-105 cursor-pointer"
                alt="Remove from wishlist"
              />
              {added ? (
                <button
                  onClick={() => navigate('/cart')}
                  className="bg-green-600 rounded-lg text-white font-Roboto text-xs px-2 py-2 sm:text-sm tracking-widest sm:px-3 sm:py-2 flex items-center sm:gap-x-2 hover:scale-105 float-right"
                >
                  Go to cart
                </button>
              ) : (
                <button
                  onClick={() => handleAddToCart(item.productId)} // Pass the item._id here
                  disabled={loading}
                  className="bg-black rounded-lg text-white font-Roboto text-xs px-2 py-2 sm:text-sm tracking-widest sm:px-3 sm:py-2 flex items-center sm:gap-x-2 hover:scale-105 float-right"
                >
                  {loading ? 'Adding...' : 'Add to cart'}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-600">Your wishlist is empty. Start adding some products!</div>
      )}
    </div>
  );
};

export default Wishlist;
