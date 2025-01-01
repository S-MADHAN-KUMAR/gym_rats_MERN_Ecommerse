import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const Order_Details = () => {
  const { id } = useParams()

  const [order, setOrders] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchOrderDetail = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/user/get_user_order_detail/${id}`)
      if (res.status === 200) {
        setOrders(res?.data)
      }
    } catch (error) {
      console.log(error.message)
      setError('Failed to fetch order details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderDetail()
  }, [id])

  const handleOrderCancel = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/user/order_cancel/${id}`)
      if (res.status === 200) {
        alert(res?.data?.message)
        fetchOrderDetail()  // Refresh the order details after cancellation
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) return <div className="text-center text-gray-500">Loading...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Order Details</h2>

      {order ? (
        <div className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white flex flex-col md:flex-row gap-6">
          {/* Product Images Section */}
          <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
            <h3 className="text-xl font-medium text-gray-800">Products</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {order.products?.map((product) => (
                <div key={product._id} className="w-32 h-32 overflow-hidden rounded-lg shadow-md">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Order Details Section */}
          <div className="w-full md:w-2/3 space-y-4">
            <p className="text-lg font-medium text-gray-800">Order ID: <span className="font-normal text-gray-600">{order._id}</span></p>
            <p className="text-lg font-medium text-gray-800">Total Amount: ₹<span className="font-normal text-gray-600">{order.totalAmt}</span></p>
            <p className={`text-lg font-medium ${order.status === 'Pending' ? 'text-yellow-500' : 'text-green-500'}`}>
              Status: {order.status}
            </p>
            
            {/* Cancel Order Button (only show if status is not 'Cancelled') */}
            {order.status !== 'Cancelled' && (
              <button 
                onClick={handleOrderCancel} 
                className="w-full md:w-48 px-6 py-3 mt-6 bg-red-600 text-white font-medium rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No order details found</p>
      )}
    </div>
  )
}

export default Order_Details
