import mongoose from 'mongoose'

const BrandsSchema = new mongoose.Schema({
    name:{type:String, requird:true},
    imageUrl:{type:String,required:true},
    status:{type : Boolean , default:true }
},{
    timestamps:true
})

const BrandModel =  mongoose.model('Brands',BrandsSchema)
export default BrandModel