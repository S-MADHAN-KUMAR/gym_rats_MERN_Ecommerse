import mongoose from 'mongoose'

const BrandShema = new mongoose.Schema({
    name:{
        type:String,
        imageUrl:String
    }
})

const BrandModel = mongoose.Model(('Brands',BrandShema))
export default BrandModel