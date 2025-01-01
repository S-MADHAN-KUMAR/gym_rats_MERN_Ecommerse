import React from 'react';
import { RotatingLines } from 'react-loader-spinner';

const Loader = () => {
  return (
    <RotatingLines
      strokeColor="#fff"
      strokeWidth="4"
      animationDuration="1.2"
      width="28"
      visible={true}
    />
  );
};

export default Loader;
