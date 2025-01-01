import CouponModel from "../../models/couponMedel.js";


export const get_all_coupons = async(req,res)=>{
    try {
        const coupons = await CouponModel.find()
        res.status(200).json(coupons)
      } catch (error) {
        console.error('Error fetching coupons:', error.message)
        res.status(500).send({
          message: 'Error fetching coupons',
          error: error.message,
        });
      }
}