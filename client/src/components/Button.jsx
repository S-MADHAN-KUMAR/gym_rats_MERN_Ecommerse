import React from 'react';
import Loader from './Loader';  // Make sure to import the Loader component
import { useNavigate } from 'react-router-dom';

const Button = ({ label, onClick, type = 'button', isLoading = false, navigateTo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isLoading}
      className="button"
    >
      <span>{isLoading ? <Loader /> : label}</span>
    </button>
  );
};

export default Button;
