import mongoose from "mongoose";

const ProductOfferSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductOfferModel = mongoose.model("ProductOffers", ProductOfferSchema);
export default ProductOfferModel;
