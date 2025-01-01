import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId , required:true},
  products:[
    {
        productId:{type:mongoose.Schema.Types.ObjectId , required:true , unique:true},
        name:{type : String},
        price:{type:Number},
        description: { type: String},
        image:{type:String}
    }
  ]
},{
    timestamps:true
})

const WishlistModel = mongoose.model('Wishlists',WishlistSchema)
export default WishlistModel