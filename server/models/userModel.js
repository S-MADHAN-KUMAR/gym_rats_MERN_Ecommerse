import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  phone: { type: Number, unique: true }, 
  status: { type : Boolean , default:true },
  profilePicture: { type: String },
  otp: { type: Number }, 
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
  wishlist:[{
    productId:{type:mongoose.Schema.Types.ObjectId}
  }]
}, {
  timestamps: true,
});

const UserModel = mongoose.model('Users', UserSchema);
export default UserModel;
