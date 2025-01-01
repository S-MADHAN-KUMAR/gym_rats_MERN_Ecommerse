import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchCurrUser } from '../../api/user.js';
import { Link, Outlet } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user); 
  const [currUser, setCurrUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?._id) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const fetchedUser = await fetchCurrUser(currentUser?._id);
          setCurrUser(fetchedUser);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [currentUser?._id]);

  const profilePicture = currUser?.profilePicture || 'https://via.placeholder.com/150';  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full flex">
      <div className="text-white h1 tracking-widest bg-black text-xl flex flex-col items-center justify-evenly w-[15vw] h-[100vh] overflow-y-hidden">
          <img src={profilePicture} alt="Profile" />
        <div className="flex flex-col gap-10">
          <Link to="/profile/general">General</Link>
          <Link to="/profile/address">Address</Link>
          <Link to="/profile/orders">Orders</Link>
          <Link to="/profile/wallet">Wallet</Link>
        </div>
        <button className='button'>
          <span>Logout</span>
        </button>
      </div>
      <div className="border w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
