import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MdDelete } from "react-icons/md";
import axios from 'axios'; // Import axios to make the HTTP request
import { fetchUserCart } from '../../api/cart.js';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useSelector((state) => state.user);

    const loadCart = async () => {
        try {
            if (currentUser) {
                const fetchedCart = await fetchUserCart(currentUser?._id);
                setCart(fetchedCart);
            }
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, [currentUser]);

    const handleUpdateQty = async (productId, type) => {
        if (!cart) return;
        const cartId = cart._id;

        try {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/update_cart_qty`, {
                cartId,
                productId,
                type
            });

            if (res.status === 200) {
                loadCart();
                if (res?.data?.msg) {
                    alert(res?.data?.message);
                }
            } 
        } catch (error) {
            console.log(error.message || 'An error occurred.');
        }
    };

    const handleRemoveProduct = async (productId) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/remove_cart_product/`, {
                productId,
                userId: currentUser?._id
            });

            if (res.status === 200) {
                loadCart();
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return <div>Loading your cart...</div>;
    }

    return (
        <div>
            {cart ? (
                <div className="overflow-x-hidden flex w-[100vw] h-[100vh] justify-center items-start p-12 flex-row gap-x-10">
                    <div className="w-2/4">
                        <div className="mb-4 flex justify-between">
                            <h1>Your Orders</h1>
                            <p>{cart?.totalQty}</p>
                        </div>
                        {cart?.products?.map((item, index) => (
                            <div key={index} className="border-b flex p-4 gap-x-4 items-center">
                                <img
                                    src={item?.image}
                                    alt={item?.name}
                                    className="w-[80px] h-[80px] object-contain border p-1"
                                />
                                <div className="flex flex-col">
                                    <p>{item?.name}</p>
                                    <p>Price: ₹{item?.price}</p>
                                    <p>Quantity: {item?.quantity}</p>
                                </div>
                                <div className="flex items-center border h-fit rounded-lg ms-auto">
                                    <button
                                        className="px-4 py-0"
                                        onClick={() => handleUpdateQty(item?.productId, 'decrement')}
                                    >
                                        -
                                    </button>
                                    <p className="px-4">{item?.quantity}</p>
                                    <button
                                        className="px-4 py-0"
                                        onClick={() => handleUpdateQty(item?.productId, 'increment')}
                                    >
                                        +
                                    </button>
                                </div>
                                <MdDelete
                                    onClick={() => handleRemoveProduct(item._id)} // Fix this line
                                    className="w-6 h-6 cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="border w-1/4 p-4">
                        <h1>Subtotal: ₹{cart?.totalAmt}</h1>
                        <h1 className="mb-4">Delivery Charge: ₹{import.meta.env.VITE_AMT}</h1>
                        <a href="/checkout" className="button"><span>Go Checkout</span></a>
                    </div>
                </div>
            ) : (
                <p>No carts found!</p>
            )}
        </div>
    );
};

export default Cart;
