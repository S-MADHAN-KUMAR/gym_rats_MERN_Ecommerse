import OrderModel from '../../models/orderModel.js'
import moment from 'moment';


export const get_all_orders = async(req,res)=>{
    try {
        const orders = await OrderModel.find()
        res.status(200).json(orders)
      } catch (error) {
        console.error('Error fetching orders:', error.message)
        res.status(500).send({
          message: 'Error fetching orders',
          error: error.message,
        });
      }
}

export const update_order_status = async (req, res) => {
    const { orderId, status } = req.body;
  
    // Validate input
    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required.",
      });
    }
  
    try {
      // Find the order by ID
      const order = await OrderModel.findById(orderId);
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }
  
      // Update the order's status
      order.status = status;
      await order.save();
  
      return res.status(200).json({
        success: true,
        message: "Order status updated successfully.",
        order,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };


  export const sales_report = async (req, res) => {
    try {
      const { startDate, endDate } = req.query; // Ensure you use query parameters, not body
      
      const start_Date = new Date(startDate);
      const end_Date = new Date(new Date(endDate).setHours(23, 59, 59, 999));
      
      const orders = await OrderModel.aggregate([
        { 
          $match: { 
            date: { 
              $gte: start_Date, 
              $lte: end_Date 
            }, 
            status: 'Delivered' 
          }
        },
        { 
          $sort: { 
            date: -1 
          }
        }
      ]);
  
      const formattedOrders = orders.map((order) => ({
        date: moment(order.date).format('YYYY-MM-DD'),
        orderId: order._id,
        totalAmt: order.totalAmt,
        coupon: order.coupon,
        discount: order.discountAmt,
        paymentMethod: order.paymentMethod,
        products: order.products,
      }));
      
      console.log(formattedOrders);
      
      let salesData = formattedOrders.map((element) => ({
        date: element.date,
        orderId: element.orderId,
        totalAmt: element.totalAmt,
        discount: element.discount,
        coupon: element.coupon,
        payMethod: element.paymentMethod,
        products: element.products,
      }));
      
      let grandTotal = salesData.reduce((sum, element) => sum + element.totalAmt, 0);
      
      console.log(grandTotal);
      
      res.json({
        grandTotal,
        orders: salesData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate sales report' });
    }
  };
  


  
  