import mongoose from "mongoose";

const CartShema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        image: { type: String }
      },
    ],
    totalQty: {
      type: Number,
    },
    totalAmt: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const CartModel = mongoose.model("Carts", CartShema);
export default CartModel;
