import Stripe from 'stripe';
import WalletModel from '../../models/walletModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  
export const get_user_wallet = async (req, res) => {
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    try {
      // Try to find the wallet by userId
      let wallet = await WalletModel.findOne({ userId });
  
      if (!wallet) {
        // If no wallet is found, create a new wallet entry with a balance of 0
        wallet = new WalletModel({
          userId,
          balance: 0,  // Set initial balance to 0
          history: []  // Empty history for new users
        });
  
        // Save the new wallet to the database
        await wallet.save();
      }
  
      // Return the wallet details (balance and history)
      res.json({
        balance: wallet.balance,
        history: wallet.history
      });
    } catch (error) {
      console.error('Error fetching wallet:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

// export const add_wallet_amount = async (req, res) => {
//     try {
//       const { userId, amount } = req.body;
  
//       // Create a payment session
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         line_items: [
//           {
//             price_data: {
//               currency: 'inr',
//               product_data: {
//                 name: 'Wallet Amount',
//               },
//               unit_amount: amount * 100, // amount should be in the smallest unit (e.g., paise for INR)
//             },
//             quantity: 1,
//           },
//         ],
//         mode: 'payment',
//         success_url: 'http://localhost:5173/profile/success?session_id={CHECKOUT_SESSION_ID}',
//         cancel_url: 'http://localhost:5175/dashboard/cancel',
//         client_reference_id: userId, // Pass userId to track it in the session
//       });
  
//       // Return the session ID in the response
//       res.json({ sessionId: session.id });
  
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Server error');
//     }
//   };
  
//   export const handle_successful_payment = async (req, res) => {
//     try {
//       const { id } = req.params;  // Get session ID from query parameters
//       const session = await stripe.checkout.sessions.retrieve(id);  // Retrieve the session
  
//       if (session.payment_status === 'paid') {
//         const userId = session.client_reference_id;  // Get the userId from the session
//         const amount = session.amount_total / 100;  // Convert from paise to INR
  
//         // Assuming you have a Wallet model to update the wallet balance
//         const user = await WalletModel.findOne({ userId });
//         if (user) {
//           user.balance += amount;  // Add the payment amount to the wallet
//           await user.save();  // Save the updated user object
//         }
  
//         // Send a success response or redirect
//         res.redirect('http://localhost:5173/profile');  // Redirect to profile page or show success page
//       } else {
//         res.status(400).send('Payment failed');
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Server error');
//     }
//   };
  




export const add_wallet_amount = async (req, res) => {
    try {
      const { userId, amount } = req.body;
  
      // Create a payment session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: 'Wallet Amount',
              },
              unit_amount: amount * 100, // amount should be in the smallest unit (e.g., paise for INR)
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:5173/profile/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:5175/dashboard/cancel',
        client_reference_id: userId, // Pass userId to track it in the session
      });
  
      // Return the session ID in the response
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  
  export const handle_successful_payment = async (req, res) => {
    try {
      const { id } = req.params;
      const session = await stripe.checkout.sessions.retrieve(id);
  
      if (session.payment_status === 'paid') {
        const userId = session.client_reference_id; 
        const amount = session.amount_total / 100; 
  
        const user = await WalletModel.findOne({ userId });
  
        if (user) {
          user.balance += amount;
  
          user.history.push({
            amount: amount,
            status: 'completed',  
            date: new Date(),     
          });
  
          await user.save();
  
          res.status(200).send('Payment successful and wallet updated');
        } else {
          res.status(404).send('User not found');
        }
      } else {
        res.status(400).send('Payment failed');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };