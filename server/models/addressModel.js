import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId },
    addresses: [
      {
        name: { type: String },
        phone: { type: Number },
        addressline1: { type: String, require: true },
        addressline2: { type: String, require: true },
        city: { type: String, require: true },
        state: { type: String, require: true },
        pincode: { type: Number, require: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AddressModel = mongoose.model("Addresses", AddressSchema);
export default AddressModel;
