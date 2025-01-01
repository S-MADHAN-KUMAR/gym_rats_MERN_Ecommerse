import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        image: { type: String },
      },
    ],

    address: {
      type: String,
      required: true,
    },

    totalAmt: {
      type: Number,
      required: true,
    },

    discountAmt: {
      type: Number,
    },

    coupon: {
      type: String,
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    couponUsed: {
      type: Boolean,
      default: false,
    },

    deliveryCharge: {
      type: Number,
      default: 50,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Payment Failed",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("Orders", OrderSchema);
export default OrderModel;
