import React, { useEffect, useState } from "react";
import axios from 'axios';
import { showToast } from '../../helper/toast.js';
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/admin/get_all_orders');
      if (response.status === 200) {
        setOrders(response.data);
      } else {
        showToast(response.data.message);
      }
    } catch (error) {
      console.error(error.message);
      alert('Failed to fetch orders: ' + error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusOptions = [
    "Pending",
    "Payment Failed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned",
  ];

  const handleStatusChange = (orderId, status) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [orderId]: status,
    }));
  };

  const handleChangeStatus = async (orderId) => {
    const newStatus = selectedStatus[orderId];
    if (!newStatus) {
      toast.error("Please select a status before saving.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/admin/update_order_status', {
        orderId,
        status: newStatus,
      });

      if (response.status === 200) {
        toast.success("Order status updated successfully.");
        fetchOrders(); // Refresh orders after update
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status.');
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-5xl tracking-wider Header">Orders List</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-center text-sm">
          <thead className="bg-[#292929] uppercase pop tracking-wider">
            <tr>
              <th className="p-4">Order Id</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment Method</th>
              <th className="p-4">Change Order Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={index} className="border-y-4 border-black bg-[#2423238d]">
                  <td className="p-4">{order._id}</td>
                  <td className="p-4">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className="px-8 py-2 font-semibold uppercase">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">{order.paymentMethod || 'N/A'}</td>
                  <td className="p-4">
                    <select
                      className="p-2 bg-black rounded-md"
                      value={selectedStatus[order._id] || order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option className="bg-[#141414]" value="" disabled>
                        Select Status
                      </option>
                      {statusOptions.map((status, idx) => (
                        <option key={idx} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleChangeStatus(order._id)}
                      className="px-8 py-2 text-white bg-blue-600 rounded-sm hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
