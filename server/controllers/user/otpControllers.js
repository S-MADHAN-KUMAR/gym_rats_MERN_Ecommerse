import UserModel from '../../models/UserModel.js';

// Verify User with email OTP

const verify_otp = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
    
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
  
     
      if (user.otp !== Number(otp)) {
        return res.status(400).json({ message: 'Invalid OTP! Try again.' });
      }
  
    
      if (user.otpExpiry < Date.now()) {
        await UserModel.deleteOne({ email }); 
        return res.status(400).json({ message: 'OTP has expired! User has been deleted.' });
      }
  
      
      await UserModel.updateOne(
        { email },
        { otp: null, otpExpiry: null, isVerified: true }
      );
  
  
      res.status(200).json({ message: 'User verified successfully!' });
    } catch (err) {
      console.error('Error occurred during OTP verification:', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  };
  
// Resend email OTP for user
  
const resend_otp = async (req, res) => {
    try {
      const { email } = req.body;
  
      
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
  
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpiry = Date.now() + 60 * 1000;
  
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
  
      const mailOptions = {
        from: process.env.SENDER_EMAIL ,
        to: email,
        subject: 'Your New OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; max-width: 500px; margin: 0 auto; color: #333;">
            <h4 style="margin-top: 0; color: #4CAF50;">Hi ${user?.name},</h4>
            <h1 style="font-size: 24px; color: #333;">Your New OTP code for registration is: 
              <strong style="color: #ff5722;">${otp}</strong>
            </h1>
            <p style="line-height: 1.6; font-size: 16px;">Please use this code to verify your email address. This OTP is valid for only 60 seconds.</p>
            <p style="margin-top: 20px; line-height: 1.6; font-size: 14px;">Best regards,<br><strong>Your Team</strong></p>
          </div>
        `,
      };
  
      // Send email
      await transporter.sendMail(mailOptions);
  
       // Schedule deletion if OTP expires
       setTimeout(async () => {
        const foundUser = await UserModel.findOne({ email });
        if (foundUser && !foundUser.isVerified && foundUser.otpExpiry < Date.now()) {
          await UserModel.deleteOne({ email });
          console.log(`User with email ${email} deleted due to expired OTP.`);
        }
      }, 60000); // 60 seconds timeout
  
      res.status(200).json({ message: 'OTP resent successfully!' });
    } catch (err) {
      console.error('Error during OTP resend:', err);
      res.status(500).json({ message: 'Failed to resend OTP', error: err.message });
    }
  }

export{
  verify_otp,
  resend_otp,
}