import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/public/protein.png",
  "/public/protein2.png",
  "/public/protein3.png",
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const fallVariants = {
    initial: { opacity: 0, y: -300 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 300,
      transition: { duration: 1 },
    },
  };

  return (
    <div className="relative max-w-[100vw] h-[100vh] flex justify-center items-center overflow-hidden bg-[#d06d568b]">
      {/* Hero - Banner */}
      <AnimatePresence>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          className="absolute w-[500px] z-10 animate-shake1"
          alt="Hero Banner"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fallVariants}
        />
      </AnimatePresence>

      <h1 className="h1 text-4xl font-bold text-white">PROTEINS</h1>

      {/* Side Images - Falling Animation with Shaking */}
      <motion.img
        src="/public/cc.png"
        className="absolute w-[300px] blur-sm rotate-2 -top-40 animate-shake1"
        alt="Decorative Element 1"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fallVariants}
      />
      <motion.img
        src="/public/cc.png"
        className="absolute w-[400px] rotate-45 bottom-90 -left-48 animate-shake2"
        alt="Decorative Element 2"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fallVariants}
      />
      <motion.img
        src="/public/cc.png"
        className="absolute w-[240px] -rotate-12 left-40 bottom-0 animate-shake3"
        alt="Decorative Element 3"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fallVariants}
      />
      <motion.img
        src="/public/cc.png"
        className="absolute w-[400px] blur-[3px] rotate-45 top-0 -right-60 animate-shake4"
        alt="Decorative Element 4"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fallVariants}
      />
      <motion.img
        src="/public/cc.png"
        className="absolute w-[200px] rotate-45 right-40 top-16 animate-shake5"
        alt="Decorative Element 5"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fallVariants}
      />
      <motion.img
        src="/public/cc.png"
        className="absolute w-[200px] blur-[2px] -top-0 left-28 animate-shake6"
        alt="Decorative Element 2"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fallVariants}
      />
      <motion.img
        src="/public/cc.png"
        className="absolute w-[150px] -rotate-12 right-36 bottom-0 animate-shake6"
        alt="Decorative Element 3"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fallVariants}
      />

      {/* Navigation Arrows */}
      <button
        onClick={prevImage}
        className="absolute left-8 bg-black text-white p-4 rounded-full z-20"
      >
        &#8592;
      </button>
      <button
        onClick={nextImage}
        className="absolute right-8 bg-black text-white p-4 rounded-full z-20"
      >
        &#8594;
      </button>
    </div>
  );
};

export default Hero;
