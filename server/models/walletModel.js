import mongoose  from 'mongoose'

const WalletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    required: true
  },
  history: [{
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

const WalletModel = mongoose.model('Wallet', WalletSchema);

export default WalletModel
