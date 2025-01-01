import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchUserCart } from '../../api/cart.js';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';

const Checkout = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalAmt, setTotalAmt] = useState(null);
    const [addressData, setAddressData] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null); 
    const [paymentMethod, setPaymentMethod] = useState('Cash on delivery'); 
    const [selectedCoupon, setSelectedCoupon] = useState(null); 

    const { currentUser } = useSelector((state) => state.user);

    // Load user's cart
    const loadCart = async () => {
        setLoading(true);
        try {
            if (currentUser) {
                const fetchedCart = await fetchUserCart(currentUser?._id);
                setCart(fetchedCart);
                setTotalAmt(fetchedCart?.totalAmt)
            }
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch the address data
    const fetchAddress = async () => {
        setLoading(true);
        try {
            const id = currentUser?._id;
            if (!id) {
                setError('User ID is missing');
                return;
            }
            const res = await axios.get(`http://localhost:3000/user/get_current_address/${id}`);
            if (res.status === 200) {
                setAddressData(res?.data?.address || []);
            }
        } catch (error) {
            console.log(error.message);
            setError('Failed to fetch address');
        } finally {
            setLoading(false);
        }
    };

    const [couponData, setCouponData] = useState([]);

    // Fetch all coupons
    const fetchCoupons = async () => {
        try {
            const res = await axios.get("http://localhost:3000/admin/get_all_coupons");
            if (res.status === 200) {
                const validCoupons = res.data.filter(coupon => {
                    const currentDate = new Date();
                    const expiryDate = new Date(coupon.endDate); 
                    return expiryDate >= currentDate; 
                });
    
                    setCouponData(validCoupons);
            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
            setCouponData([]);
        }
    };

    useEffect(() => {
        loadCart();
        fetchAddress();
        fetchCoupons();
    }, [currentUser]);

    // Handle coupon selection
    const applyCoupon = (couponId) => {
        setSelectedCoupon(couponId);
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert("Please select an address.");
            return;
        }

        // Check if a coupon is selected
        const appliedCoupon = selectedCoupon ? couponData.find((coupon) => coupon._id === selectedCoupon) : null;
        
        try {
            const payload = {
                userId: currentUser?._id,
                products: cart?.products || [],
                address: selectedAddress,
                totalAmt: cart?.totalAmt || 0,
                coupon: appliedCoupon ? appliedCoupon._id : null,
                paymentMethod,
                couponUsed: appliedCoupon ? true : false, 
                maxDiscountAmount:appliedCoupon ? appliedCoupon.maxDiscountAmount : null,
                minDiscountAmount:appliedCoupon ? appliedCoupon.minDiscountAmount : null,
                discount:appliedCoupon ? appliedCoupon.discount : null
            };

            const res = await axios.post('http://localhost:3000/user/place_order', payload);

            if (res.data.success) {
                if (res.data.session_url) {
                    window.location.href = res.data.session_url; // Redirect to Stripe session
                } else {
                    alert("Order placed successfully.");
                }
            }
        } catch (error) {
            console.error("Order Placement Error:", error);
            alert("Failed to place the order. Please try again.");
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between px-4 py-8 space-y-6 md:space-y-0 md:space-x-6">
            
            {/* Address Section */}
            <div className="w-full md:w-1/3 border p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Your Address</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : addressData?.addresses?.length > 0 ? (
                    <select
                        name="selectedAddress"
                        id="selectedAddress"
                        className="w-full p-3 border rounded-md bg-gray-50"
                        onChange={(e) => {
                            const selectedId = e.target.value;
                            const selected = addressData.addresses.find((add) => add._id === selectedId);
                            setSelectedAddress(selected);
                        }}
                    >
                        <option value="" disabled selected>
                            Select an Address
                        </option>
                        {addressData.addresses.map((add) => (
                            <option key={add._id} value={add._id}>
                                {`${add.addressline1}, ${add.city}, ${add.state}, ${add.pincode}`}
                            </option>
                        ))}
                    </select>
                ) : (
                    <p>No address available</p>
                )}
                <a href="/profile/address" className="text-blue-500 mt-2 inline-block">Add or Edit Address</a>
            </div>

            {/* Coupon Section */}
            <div className="w-full md:w-1/3 border p-6 bg-white rounded-lg shadow-lg">
                {couponData && couponData.length > 0 ? (
                    <div className="space-y-4">
                        <label htmlFor="coupon" className="text-lg font-semibold">Select Coupon</label>
                        <select
                            id="coupon"
                            name="coupon"
                            className="block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => applyCoupon(e.target.value)}
                        >
                            <option value="">Select a coupon</option>
                            {couponData
                                .filter(coupon => 
                                    coupon.minDiscountAmount <= totalAmt && 
                                    !coupon.usedBy.some(c => c.userId === currentUser?._id)
                                )
                                .map((coupon) => (
                                    <option 
                                        key={coupon._id} 
                                        value={coupon._id} 
                                        disabled={new Date(coupon.endDate) < new Date()}
                                    >
                                        {coupon?.name} - {coupon.discount}% off (Valid until {new Date(coupon.endDate).toLocaleDateString()})
                                    </option>
                                ))}
                        </select>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">No coupons available.</div>
                )}
            </div>

            {/* Payment Method Section */}
            <div className="w-full md:w-1/3 border p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <select
                    name="paymentMethod"
                    id="paymentMethod"
                    className="w-full p-3 border rounded-md bg-gray-50"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="Cash on delivery">Cash On Delivery</option>
                    <option value="Stripe">Stripe</option>
                </select>
            </div>

            {/* Cart Section */}
            <div className="w-full md:w-1/3 border p-6 bg-white rounded-lg shadow-lg">
                {cart ? (
                    <div className="flex flex-col gap-y-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold">Your Orders</h2>
                            <p className="text-sm">Total items: {cart?.totalQty}</p>
                        </div>
                        {cart?.products?.map((item, index) => (
                            <div key={index} className="flex justify-between items-center border-b py-4">
                                <img
                                    src={item?.image}
                                    alt={item?.name}
                                    className="w-20 h-20 object-contain border p-1 rounded-md"
                                />
                                <div className="flex flex-col w-full mx-4">
                                    <p className="text-sm font-semibold">{item?.name}</p>
                                    <p className="text-sm">Price: ₹{item?.price}</p>
                                    <p className="text-sm">Quantity: {item?.quantity}</p>
                                </div>
                                <MdDelete className="w-6 h-6 cursor-pointer text-red-500" />
                            </div>
                        ))}
                        <div className="mt-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Subtotal: ₹{cart?.totalAmt}</h3>
                                <p className="text-sm">Delivery Charge: ₹{import.meta.env.VITE_AMT}</p>
                            </div>
                            <button
                                onClick={handlePlaceOrder}
                                className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>No carts found!</p>
                )}
            </div>
        </div>
    );
};

export default Checkout;
