import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';  
import { fetchCurrUser } from '../../api/user.js';

const ProtectRoute = ({ children, isProtectedForLoggedIn = false }) => {
  const { currentUser } = useSelector((state) => state.user); 
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    if (currentUser?._id) {
      const fetchUserData = async () => {
        const fetchedUser = await fetchCurrUser(currentUser?._id);
        setCurrUser(fetchedUser);
      };
      fetchUserData();
    }
  }, [currentUser]);  

  if (isProtectedForLoggedIn) {
    if (currUser?.isVerified) {
      return <Navigate to="/" />;
    }
  } else {
    if (!currUser?.isVerified ) {
      return <Navigate to="/login" />;
    }
  }

  return children;
};

export default ProtectRoute;
