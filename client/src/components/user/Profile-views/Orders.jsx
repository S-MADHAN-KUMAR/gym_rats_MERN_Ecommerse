import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Orders = () => {

  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');  // Error state
  const [loading, setLoading] = useState(true);  // Loading state

  const fetchOrders = async () => {
    try {
      const id = currentUser?._id;
      if (!id) {
        setError('User ID is missing');
        return;
      }

      
      
      const res = await axios.get(`http://localhost:3000/user/get_user_orders/${id}`);
      if (res.status === 200) {
        setOrders(res?.data || []);  // Assigning orders, fallback to empty array if no orders found
      }
    } catch (error) {
      console.log(error.message);
      setError('Failed to fetch orders'); // Displaying error on failure
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, [currentUser]);  // Re-fetch if the user changes

  console.log(orders);

  if (loading) {
    return <div>Loading orders...</div>;  // Show loading message
  }

  if (error) {
    return <div>Error: {error}</div>;  // Show error message
  }

  return (
<div className="max-w-4xl mx-auto p-4">
  {orders.length === 0 ? (
    <p className="text-center text-lg text-gray-500">No orders found.</p>  // Display a message if no orders are found
  ) : (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Orders</h2>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order._id} className="border p-4 rounded-lg shadow-md bg-white flex gap-x-5  items-start">
            <div className="w-32 h-32">
              {order.products?.map((product) => (
                <img
                  key={product._id}
                  src={product.image} // Corrected the image reference
                  alt={product.name}  // Alternative text for accessibility
                  className="object-cover w-full h-full rounded-md" // Optional styling for the image
                />
              ))}
            </div>
            <div className="flex flex-col justify-between flex-grow">
              <p className="text-lg font-medium text-gray-800">Order ID: <span className="text-gray-600">{order._id}</span></p>
              <p className="text-lg font-medium text-gray-800">Total Amount: <span className="text-gray-600">₹{order.totalAmt}</span></p>
              <p className="text-lg font-medium text-gray-800">Status: <span className={`text-${order.status === "Pending" ? "yellow-500" : "green-500"}`}>{order.status}</span></p>
            </div>
            <div onClick={()=>navigate(`/profile/order_details/${order?._id}`)} className="button ">
              <span>View Order</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

  );
};

export default Orders;
