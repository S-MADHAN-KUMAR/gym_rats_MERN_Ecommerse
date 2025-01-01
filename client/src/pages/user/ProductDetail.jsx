import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { MdStar } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { SiTicktick } from 'react-icons/si';
import { BiSolidMessageDetail } from 'react-icons/bi';
import { fetchProductDetail, fetchRelatedProducts } from '../../api/product.js';
import RelatedProducts from '../../components/user/RelatedProducts';
import { useSelector } from 'react-redux';


const ProductDetailsPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});

  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const { currentUser } = useSelector((state) => state.user); 
  const [currUser, setCurrUser] = useState(null);
  
  const imgRef = useRef(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null); // Reset error state
      fetchProductDetail(setProduct, setMainImage, setImages, id).finally(() => setLoading(false));
      fetchRelatedProducts(setRelatedProducts, setError, id);
    }
    window.scrollTo(0, 0); // Scroll to top on load
  }, [id]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleMouseMove = (e) => {
    if (imgRef.current) {
      const { width, height, top, left } = imgRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const xPercent = (x / width) * 100;
      const yPercent = (y / height) * 100;
      setZoomStyle({ backgroundPosition: `${xPercent}% ${yPercent}%` });
    }
  };

  const handleImageClick = (image) => setMainImage(image);

  const handleAddToCart = async () => {
    try {
      if (!currentUser) {
        console.error('User not logged in');
        return;
      }

      if (!product) {
        console.error('Product not available');
        return;
      }

      setLoading(true);
      const payload = {
        userId: currentUser?._id,
        productId: product?._id,
      };

      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/add_to_cart`, payload);

      if (res.status === 200) {
        setAdded(true);
      } else {
        console.error('Failed to add product to cart:', res.data.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWishlist = async () => {
    try {
      const payload = {
        userId: currentUser?._id,
        productId: product?._id
      };
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/add_to_wishlist`, payload)

      if (res.status === 200) {
        alert(res?.data?.message);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error.message);
    } 
  };

  const isInWishlist = currUser?.wishlist.some((item) => item.productId === product?._id);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Display error message if any
  }

  if (!product) {
    return <div>Product not found</div>; // Display if product is not found
  }

  return (
    <div className='overflow-hidden'>
      <div className="sticky top-0 p-2 flex justify-between items-center bg-white z-20 shadow">
        {/* Logo Section */}
        <p className="text-3xl cursor-pointer items-center font-semibold text-black font-audiowide uppercase hidden sm:block">
          gym <span className="font-audiowide text-transparent stroke-orange">RATS</span>
        </p>

        {/* Search */}
        <div className='flex items-center w-full sm:w-6/12 border rounded-md sm:ms-20 overflow-hidden'>
          <input type="text" placeholder='Search for items...' className='focus:outline-none px-6 py-2 w-full' />
          <div>
            {/* <IoIosSearch className='w-10 h-10 text-gray-500 p-1'/> */}
          </div>
        </div>

        {/* Profile Section */}
        <div className='hidden sm:block'>
          <h1 className="font-oswald tracking-widest text-transparent font-bold text-3xl stroke-black">
            PROFILE
          </h1>
        </div>
      </div>

      {/* Breadcrumb
      <div className="w-full border-black bg-gray-100">
        <Breadcrumb />
      </div> */}

      <div>
        <div className='flex md:flex-row flex-col justify-between p-1 sm:p-5 md:h-[85vh] w-full'>
          {/* Image Section */}
          <div
            className="md:w-7/12 p-5 overflow-hidden cursor-crosshair relative h-full shadow-sm"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <img
              src={mainImage}
              alt="Zoomable"
              ref={imgRef}
              className="w-full h-full object-contain"
              style={{
                transition: 'transform 0.3s ease', 
                transform: isHovered ? 'scale(1.5)' : 'scale(1)', 
                transformOrigin: 'center center', 
              }}
            />
            {isHovered && (
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  backgroundImage: `url(${mainImage})`,
                  backgroundSize: '200%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: zoomStyle.backgroundPosition,
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>

          <div className="flex flex-col md:flex-row w-full justify-between h-full">
            {/* Description Section */}
            <div className='md:w-9/12 font-Roboto flex p-1 flex-col h-full md:p-3 justify-between'>
              <h1 className='text-lg md:text-3xl leading-snug font-medium mb-2 md:mb-0'>{product.name}</h1>

              {/* Rating and Reviews */}
              <div className="flex justify-between md:gap-x-5 mb-1 md:mb-0">
                <div className="flex items-center">
                  {Array(5).fill(null).map((_, index) => (
                    <MdStar key={index} className='md:w-5 md:h-5 text-yellow-400' />
                  ))}
                  <p className='text-yellow-400 font-Roboto ms-2 font-medium text-sm md:text-base'>9.6</p>
                </div>

                <div className="flex items-center text-[#a5a8ad] text-sm md:text-base">
                  <p>reviews</p>
                  <BiSolidMessageDetail className='md:w-6 md:h-6 ms-2'/>
                </div>
              </div>

              {/* Stock */}
              <p className={product.stock > 0 ? "text-green-500 font-medium text-sm md:text-base mb-4" : "text-red-500 font-medium text-sm md:text-base mb-4"}>
                {product.stock > 0 ? (
                  <div className='flex items-center gap-x-2'>
                    <SiTicktick className='md:w-5 md:h-5'/> <p>In stock</p>
                  </div>
                ) : (
                  <div className='flex items-center gap-x-4'>
                    <IoClose className='w-5 h-5'/> <p>out of stock</p>
                  </div>
                )}
              </p>

              {/* Mini Images */}
              <div className='flex gap-x-4 mb-5 md:mb-0'>
                {images.map((image, index) => (
                  <div key={index} className="md:w-20 w-12 md:h-20 hover:border-black hover:border cursor-pointer">
                    <img
                      src={image}
                      alt={`image-${index}`}
                      className={`w-full h-full object-cover ${mainImage === image ? 'border-black border-2' : ''}`}
                      onClick={() => handleImageClick(image)}
                    />
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="hidden md:block">
                <p className='font-medium text-sm mb-2'>About this item</p>
                <p className='text-xs leading-relaxed'>{product.description}</p>
              </div>
            </div>

            {/* Purchase Section */}
            <div className="flex flex-col justify-between md:mx-auto w-full md:w-3/12 p-2 rounded-md bg-sky-50">
              <p className='text-3xl md:text-5xl text-green-500 font-semibold font-Roboto md:mb-2 mb-1'>₹ {product.price}</p>
              <p className='text-gray-400 font-Roboto line-through font-medium'>₹ {product.price + 700}</p>
              <small className='text-gray-400 font-Roboto mt-4'>Brand</small>
              <p className='text-red-400 font-Roboto md:mb-0 mb-6'>{product.brand}</p>

              {/* Buttons */}
              <div className="flex flex-col mb-4 gap-y-4">
              {added ? (
          <button
            onClick={() => navigate('/cart')}
            className="bg-green-600 rounded-lg text-white font-Roboto text-xs px-2 py-2 sm:text-sm tracking-widest sm:px-3 sm:py-2 flex items-center sm:gap-x-2 hover:scale-105 float-right"
          >
            Go to cart
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="bg-black rounded-lg text-white font-Roboto text-xs px-2 py-2 sm:text-sm tracking-widest sm:px-3 sm:py-2 flex items-center sm:gap-x-2 hover:scale-105 float-right"
          >
            {loading ? 'Adding...' : 'Add to cart'}
          </button>
        )}


<button
          onClick={handleAddWishlist}
          className={isInWishlist ?"w-6 h-6 cursor-not-allowed":"w-6 h-6 " }
        >
          <img
            src={
              isInWishlist
                ? 'https://img.icons8.com/?size=100&id=BdjA3Y8bTxW8&format=png&color=000000'
                : 'https://img.icons8.com/?size=100&id=16076&format=png&color=000000' 
            }
            alt="wishlist-icon"
          />
        </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
        

      </div>
    </div>
  );
};

export default ProductDetailsPage;
