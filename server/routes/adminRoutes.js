import express from 'express';
import {  add_product, block_product, delete_product, get_all_products, get_edit_product, update_product } from '../controllers/admin/productsControllers.js';
import { get_all_categories } from '../controllers/admin/categoriesControllers.js';
import { get_all_brands } from '../controllers/admin/brandsControllers.js';
import { get_all_coupons } from '../controllers/admin/couponControllers.js';
import { block_user, get_all_users, handle_google_auth } from '../controllers/admin/usersControllers.js';
import upload from '../middlewares/multer.js'
import { add_coupon, toggle_coupon_status } from '../controllers/user/couponsControllers.js';
import { add_categories_offer, add_product_offer, block_categories_offer, block_product_offer, get_all_categories_offer, get_all_product_offer } from '../controllers/admin/offerControllers.js';
import { get_all_orders, sales_report, update_order_status } from '../controllers/admin/ordersControllers.js';


const router = express.Router();


router.post('/add_product_offer',add_product_offer)

router.get('/get_all_product_offer',get_all_product_offer)

router.put('/block_product_offer',block_product_offer)

router.post('/add_categories_offer',add_categories_offer)

router.get('/get_all_categories_offer',get_all_categories_offer)

router.put('/block_categories_offer',block_categories_offer)



router.get('/get_all_orders',get_all_orders)

router.post('/update_order_status',update_order_status)


router.post('/sales_report',sales_report)


router.post('/add_product',upload.array('images', 5),add_product);

router.get('/get_edit_product/:id', get_edit_product);

router.put('/update_product/:id',upload.array('images', 5),update_product)

router.delete('/delete_product/:id',delete_product)

router.get('/get_all_users',get_all_users)

router.put('/block_user',block_user)

router.get('/get_all_products',get_all_products)

router.put('/block_product',block_product)

router.post('/handle_google_auth',handle_google_auth)

router.get('/get_all_categories', get_all_categories);

router.get('/get_all_coupons',get_all_coupons)

router.post('/add_coupon',add_coupon)

router.put("/toggle_coupon_status/:id", toggle_coupon_status);

router.get('/get_all_brands', get_all_brands)



export default router;
