import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';

const stripePromise = loadStripe('pk_test_51QXxK6JHdjiLDQivSb2ntjOMKg6J4TSTrUrMdn2GdAL54lXKiICyZVF88k7bjaqudQ99X7STkDW48xa5kjV1fiTv0001XwMFaI');

const Wallet = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [wallet, setWallet] = useState({});
  const [amount, setAmount] = useState('');

  // Fetch wallet details
  const fetchWallet = async () => {
    try {
      const res = await axios.post('http://localhost:3000/user/get_user_wallet', { userId: currentUser?._id });
      if (res.status === 200) {
        setWallet(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle adding amount to wallet
  const handleAddAmount = async () => {
    if (!amount || amount <= 0) {
      alert('Enter a valid amount.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/user/add_wallet_amount', {
        userId: currentUser?._id,
        amount: parseFloat(amount),
      });

      if (res.status === 200) {
        const stripe = await stripePromise;
        const { sessionId } = res.data;
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error adding amount:', error);
    }
  };

  // Fetch wallet on component mount
  useEffect(() => {
    if (currentUser?._id) {
      fetchWallet();
    }
  }, [currentUser]);

  return (
    <div className="p-12 flex justify-between">
      <div>
        <h1 className="h1 tracking-wider text-5xl mb-10">My Wallet</h1>
        <div className="flex items-start gap-x-6 bg-black py-6 px-10 rounded-lg w-fit">
          <h1 className="h1 text-white text-2xl tracking-widest">Current Balance :</h1>
          <h1 className="h1 text-3xl text-green-600">₹ {wallet?.balance || 0}</h1>
        </div>

        <input
          type="number"
          placeholder="Enter Amount..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input mt-4"
        />
        <button onClick={handleAddAmount} className="button mt-10">
          <span> + Add Amount</span>
        </button>
      </div>

      <div className="border w-1/2 p-4 border-2 border-black rounded-lg">
        <h1 className="h1 tracking-wider text-4xl mb-10">Wallet History</h1>
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 text-lg">
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {wallet.history?.length > 0 ? (
              wallet.history.map((entry, index) => (
                <tr key={index} className="text-md">
                  <td className="border px-4 py-2">{new Date(entry.date).toLocaleString()}</td>
                  <td className="border px-4 py-2">₹ {entry.amount}</td>
                  <td className={`border px-4 py-2 ${entry.status === 'completed' ? 'text-green-500' : entry.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                    {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border px-4 py-2" colSpan="3">
                  No history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wallet;
