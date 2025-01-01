import OrderModel from "../../models/orderModel.js";
import Stripe from "stripe";
import ProductModel from "../../models/productsModel.js";
import CouponModel from "../../models/couponMedel.js";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const currency = "inr";
const deliveryCharge = parseInt(process.env.DELIVERY_AMT, 10) || 50;

export const place_order = async (req, res) => {
  try {
    const {
      userId,
      products,
      address,
      totalAmt,
      discountAmt,
      coupon,
      paymentMethod,
      couponUsed,
      maxDiscountAmount,
      minDiscountAmount,
      discount
    } = req.body;

    // Validate required fields
    if (!userId || !products?.length || !address || !totalAmt || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    let newTotalAmt = totalAmt;

    if (couponUsed) {
      // Apply coupon discount logic
      newTotalAmt = totalAmt - (totalAmt * discount / 100);

      if (newTotalAmt > maxDiscountAmount) {
        newTotalAmt = maxDiscountAmount; // Cap the discount if it exceeds maxDiscountAmount
      }
    }

    // Create a new order, to be saved after payment processing
    const order = new OrderModel({
      userId,
      products,
      address: address._id, // Address should be an ObjectId
      totalAmt: newTotalAmt,
      discountAmt:totalAmt-newTotalAmt  || 0,
      coupon: coupon || null,
      paymentMethod,
      couponUsed: couponUsed || false,
      deliveryCharge,
      date: new Date(),
      status: "Pending",
    });

    if (paymentMethod === "Stripe") {
      const { origin } = req.headers;

      // Prepare the Stripe line items based on the products
      const line_items = products.map((product) => ({
        price_data: {
          currency,
          product_data: {
            name: product?.name || "Product",
            images: product?.image ? [product.image] : [], // Add the product image URL
          },
          unit_amount: product?.price * 100, // Convert to smallest currency unit (paise)
        },
        quantity: product?.quantity || 1,
      }));

      // Add the delivery charges as a line item
      line_items.push({
        price_data: {
          currency,
          product_data: {
            name: "Delivery Charges",
            images: [], // No image for delivery charges
          },
          unit_amount: deliveryCharge * 100, // Delivery charge in paise
        },
        quantity: 1,
      });

      try {
        // Save the order to the database
        await order.save();

        // Create a Stripe session for the payment
        const session = await stripe.checkout.sessions.create({
          success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/failure`,
          payment_method_types: ["card"],
          line_items,
          mode: "payment",
        });

        // Update product stock after payment confirmation
        await Promise.all(
          products.map(async (product) => {
            const existProduct = await ProductModel.findById(product?.productId);
            if (existProduct) {
              existProduct.stock -= product.quantity; // Decrease stock based on the quantity ordered
              await existProduct.save();
            }
          })
        );

        return res.json({ success: true, session_url: session.url });
      } catch (error) {
        console.error("Stripe API Error:", error);
        return res.status(500).json({ message: "Stripe payment failed.", error: error.message });
      }
    } else {
      // Handle non-Stripe payments (e.g., cash on delivery)
      await order.save();

      const existCoupon = await CouponModel.findById(coupon)

      if(existCoupon){
        existCoupon.usedBy.push({userId:userId})
        await existCoupon.save()
      }

      // Directly update product stock when the payment method is not Stripe
      await Promise.all(
        products.map(async (product) => {
          const existProduct = await ProductModel.findById(product?.productId); // Make sure productId exists
          if (existProduct) {
            existProduct.stock -= product.quantity; // Decrease stock based on the quantity ordered
            await existProduct.save();
          } else {
            console.log(`Product not found: ${product?.productId}`);
          }
        })
      );

      return res.status(200).json({ success: true, message: "Order placed successfully." });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const get_user_orders = async (req, res) => {
  try {
    const { id } = req.params;  // Corrected to use `req.params`
    
    // Find the orders for the given userId
    const orders = await OrderModel.find({ userId :id});  // Using `find` instead of `findOne` to get multiple orders
    
    if (!orders || orders.length === 0) {
      return res.status(400).json({ message: 'No orders found for this user!' });
    }

    // Send the orders as the response
    return res.status(200).json(orders);

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const get_user_order_detail = async(req,res)=>{
  try {
    const { id } = req.params;
    
    const order = await OrderModel.findById(id); 
    
    if (!order ) {
      return res.status(400).json({ message: 'No orders found for this user!' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export const order_cancel = async(req,res)=>{
  try {
    const { id } = req.params;  

    const order = await OrderModel.findById(id);  
    
    if (!order ) {
      return res.status(400).json({ message: 'No orders found for this user!' });
    }

    order.status = 'Cancelled'

    await Promise.all(
      order?.products.map(async (product) => {
        const existProduct = await ProductModel.findById(product?.productId); // Make sure productId exists
        if (existProduct) {
          existProduct.stock += product.quantity; // Decrease stock based on the quantity ordered
          await existProduct.save();
        } else {
          console.log(`Product not found: ${product?.productId}`);
        }
      })
    );

    await order.save()


    res.status(200).json({message:'Order Canceled successfully !'})

    return res.status(200).json(order);
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
