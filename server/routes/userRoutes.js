import express from 'express'
import { get_current_user, handle_google_auth } from '../controllers/admin/usersControllers.js';
import { get_all_products, get_related_products, new_arrivals, products_details } from '../controllers/user/productsControllers.js';
import { add_to_cart, get_user_cart, remove_cart_product, update_cart_qty } from '../controllers/user/cartControllers.js';
import { update_profile } from '../controllers/user/profileControllers.js';
import { add_address, get_current_address, get_edit_address, update_address } from '../controllers/user/addressControllers.js';
import { forgotPassword, loginUser, registerUser, resendOtp, resendOtpForgotPassword, updatePassword, verifyForgotPassword, verifyOTP } from '../controllers/user/usersControllers.js';
import { get_all_coupons } from '../controllers/user/couponsControllers.js';
import { get_user_order_detail, get_user_orders, order_cancel, place_order } from '../controllers/user/orderControllers.js';
import { add_to_wishlist, get_user_wishlist, remove_wishlist_product } from '../controllers/user/wishlistsControllers.js';

const router = express.Router()


router.get('get_all_coupons',get_all_coupons)

router.get('/get_user_orders/:id',get_user_orders)
router.get('/get_user_order_detail/:id',get_user_order_detail)

router.get('/order_cancel/:id',order_cancel)


router.post('/remove_cart_product',remove_cart_product)

router.post('/remove_wishlist_product',remove_wishlist_product)

router.post('/add_to_wishlist',add_to_wishlist)

router.get('/get_user_wishlist/:id',get_user_wishlist)


router.post('/update_cart_qty',update_cart_qty)
// // Post

// Get

router.post('/place_order',place_order)

router.get('/get_user_cart/:id', get_user_cart)

// Post

router.post('/add_to_cart', add_to_cart);



router.post('/register', registerUser)

router.post('/login',loginUser)

router.post('/verify', verifyOTP)

router.post('/resendOtp', resendOtp)



router.get('/forgotPassword/:email',forgotPassword)


router.post('/verifyForgotPassword', verifyForgotPassword); 

router.post('/resendOtpForgotPassword', resendOtpForgotPassword)

router.post('/updatePassword',updatePassword)


//=================User========================//

router.get('/get_current_address/:id', get_current_address)

router.put('/update_profile', update_profile);


router.put('/update_address', update_address);
// // Get

// router.get('/get_current_user/:id',get_current_user)

router.get('/get_current_user/:id',get_current_user)

router.post('/get_edit_address',get_edit_address)


// router.get('/forgot_password/:email',forgot_password)

// // Post

// router.post('/register_users', register_users)

// router.post('/login_users',login_users)

// router.post('/verify_otp', verify_otp )

// router.post('/resend_otp', resend_otp)

router.post('/handle_google_auth',handle_google_auth)

// // forgot password

// router.post('/verify_forgot_password', verify_forgot_password); 

// router.post('/resend_otp_forgot_password', resend_otp_forgot_password);

// router.post('/update_password',update_password)

// // Put



// //===================Products========================//

// // Get

router.get('/get_all_products',get_all_products)

router.get('/products_details/:id',products_details);

router.get('/get_related_products/:id', get_related_products)

router.get('/new_arrivals',new_arrivals)

// //=========================Address==================================//

// // Get

// router.get('/get_all_address/:id', get_all_address)


// // Post

router.post('/add_address',add_address)


// //=========================Cart==================================//

// // Get

// //=========================Cart==================================//

// router.post('/update_cart_qty',update_cart_qty)

// //=================BreadCrumb========================//

// router.get('/breadCrumb/:productId',breadCrumb );

//===================================================//

export default router;









