import mongoose from 'mongoose';

const CategoryOfferSchema = new mongoose.Schema({
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', // Assuming you have a Category model 
    required: true 
  },
  discount: { 
    type: Number, 
    required: true
  },
  startDate: { 
    type: Date, 
    default: Date.now 
  },
  endDate: { 
    type: Date 
  },
  status: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

const CategoryOfferModel = mongoose.model('CategoryOffers', CategoryOfferSchema);
export default CategoryOfferModel;
