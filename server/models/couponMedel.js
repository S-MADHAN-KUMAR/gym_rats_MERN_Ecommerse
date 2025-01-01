import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
  {
    name: {
      type: String,unique:true
    },
    code: {
      type: String,unique:true
    },
    discount: {
      type: Number,
    },
    minDiscountAmount: {
      type: Number,
    },
    maxDiscountAmount: {
      type: Number,
    },
    status: {
        type : Boolean , default:true
    },
    usedBy: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId },
      },
    ],
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const CouponModel = mongoose.model("Coupons", CouponSchema);
export default CouponModel;
