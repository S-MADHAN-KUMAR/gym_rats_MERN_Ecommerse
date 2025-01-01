import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { fetchCurrUser } from '../../api/user.js';

const Card = ({ product }) => {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user); 
  const [currUser, setCurrUser] = useState(null);

  const fetchUserData = async () => {
    const fetchedUser = await fetchCurrUser(currentUser?._id);
    setCurrUser(fetchedUser);
  };
  useEffect(() => {
    if (currentUser?._id) {
      fetchUserData();
    }
  }, []);  

  const handleAddToCart = async () => {
    try {
      if (!currentUser) {
        console.error('User not logged in');
        return;
      }

      if (!product) {
        console.error('Product not available');
        return;
      }

      setLoading(true);
      const payload = {
        userId: currentUser?._id,
        productId: product?._id,
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

  const handleAddWishlist = async () => {
    try {
      const payload = {
        userId: currentUser?._id,
        productId: product?._id
      };
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/add_to_wishlist`, payload)

      if (res.status === 200) {
        alert(res?.data?.message);
        fetchUserData()
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error.message);
    } 
  };

  const isHotProduct = (updatedAt, thresholdDays = 2) => {
    const currentDate = new Date();
    const productDate = new Date(updatedAt);
    const timeDifference = (currentDate - productDate) / (1000 * 3600 * 24);
    return timeDifference <= thresholdDays;
  };

  const isInWishlist = currUser?.wishlist.some((item) => item.productId === product?._id);

  return (
    <div className="p-1 border w-[180px] shadow-sm rounded-lg h-[250px] relative">
      <Link to={`/products/${product._id}`}>
        <div className="border rounded-md w-full h-[58%]">
          <img src={product?.imageUrls?.[0]} className="w-full h-full object-contain" alt={product?.name} />
        </div>
      </Link>
      <div className="border">
        <p className="text">
          {product?.name.length > 18 ? `${product?.name.slice(0, 18)}...` : product?.name}
        </p>
        <div className="flex justify-between">
          <p>$ {product?.price}</p>
        </div>
        <div className="flex gap-x-2 items-center border">
          <div className="flex gap-x-1">
            {Array(4).fill(0).map((_, index) => (
              <img
                key={index}
                src="https://img.icons8.com/?size=100&id=YQgRDEtIIIKP&format=png&color=000000"
                alt="star"
                className="w-3 h-fit"
              />
            ))}
          </div>
          <p>4.5</p>
        </div>
        {isHotProduct(product.updatedAt) && (
          <div className="cursor-pointer hover:scale-105 absolute -top-6 sm:-top-2 -right-3 bg-[#A3E81D] px-3 py-1 rounded-sm w-fit">
            <p className="font-Roboto font-semibold text-xs">HOT</p>
          </div>
        )}
        {added ? (
          <button
            onClick={() => navigate('/cart')}
            className="bg-green-600 rounded-lg text-white font-Roboto text-xs px-2 py-2 sm:text-sm tracking-widest sm:px-3 sm:py-2 flex items-center sm:gap-x-2 hover:scale-105 float-right"
          >
            Go to cart
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="bg-black rounded-lg text-white font-Roboto text-xs px-2 py-2 sm:text-sm tracking-widest sm:px-3 sm:py-2 flex items-center sm:gap-x-2 hover:scale-105 float-right"
          >
            {loading ? 'Adding...' : 'Add to cart'}
          </button>
        )}
        <button
          onClick={handleAddWishlist}
          className={isInWishlist ?"w-6 h-6 cursor-not-allowed":"w-6 h-6 " }
        >
          <img
            src={
              isInWishlist
                ? 'https://img.icons8.com/?size=100&id=BdjA3Y8bTxW8&format=png&color=000000'
                : 'https://img.icons8.com/?size=100&id=16076&format=png&color=000000' 
            }
            alt="wishlist-icon"
          />
        </button>
      </div>
    </div>
  );
};

export default Card;
