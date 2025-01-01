import React from 'react';
import {motion} from 'framer-motion'
import RunningTexts from '../../components/RunningTexts';

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen overflow-hidden">

      <div className="relative w-full h-full">
        <RunningTexts 
          setting={{
            quotes: ' 404 404 404 404 ', 
            css: "font-audiowide text-gray-100  text-9xl", 
            runSide: 'right', 
            position: 'absolute top-[320px] '
          }} 
        />

        <RunningTexts 
          setting={{
            quotes: ' 404 404 404 404 ', 
            css: "font-audiowide text-gray-100  text-9xl", 
            runSide: 'left', 
            position: 'absolute top-[200px]'
          }} 
        />

        <RunningTexts 
          setting={{
            quotes: ' 404 404 404 404 ', 
            css: "font-audiowide text-black/10 text-9xl", 
            runSide: 'left', 
            position: 'absolute bottom-[160px] '
          }} 
        />

        <RunningTexts 
          setting={{
            quotes: ' 404 404 404 404 ', 
            css: "font-audiowide text-gray-100 text-9xl", 
            runSide: 'right', 
            position: 'absolute bottom-8 '
          }} 
        />
      </div>

      <motion.h1
        className="font-audiowide text-5xl uppercase font-semibold text-center mb-8"
        animate={{ opacity: [1, 0, 1] }} 
        transition={{
          duration: 1, 
          repeat: Infinity, 
        }}
      >
        404 - Page Not Found 
      </motion.h1>
      
      <p className="font-Roboto text-xl font-semibold text-center mb-4">
        Oops! The page you are looking for does not exist. 😕
      </p>
      
      <a href="/" className="btn">
        Go back to Home 🏠
      </a>
    </div>
  );
};

export default NotFound;
