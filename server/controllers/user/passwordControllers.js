import UserModel from '../../models/UserModel.js';
import transporter from "../../utils/email.js";

// Forgot password 

const forgot_password = async (req, res) => {
    try {
      const { email } = req.params;
  
      if (!email) {
        return res.status(400).json({ message: "Email is required!" });
      }
  
      const foundEmail = await UserModel.findOne({ email });
  
      if (!foundEmail) {
        return res.status(400).json({ message: "Invalid email, no user exists!" });
      }
  
      const otp = Math.floor(100000 + Math.random() * 900000); 
      const otpExpiry = Date.now() + 60 * 1000; 
  
      foundEmail.otp = otp;
      foundEmail.otpExpiry = otpExpiry;
      await foundEmail.save();
  
      const mailOptions = {
        from: 'mohamedejaz075@gmail.com',
        to: email,
        subject: 'Your Forgot Password OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; max-width: 500px; margin: 0 auto; color: #333;">
            <h4 style="margin-top: 0; color: #4CAF50;">Hi ${foundEmail.name},</h4>
            <h1 style="font-size: 24px; color: #333;">Your OTP code for Forgot Password is: 
              <strong style="color: #ff5722;">${otp}</strong>
            </h1>
            <p style="line-height: 1.6; font-size: 16px;">Please use this code to verify your email address. This OTP is valid for only 60 seconds.</p>
            <p style="margin-top: 20px; line-height: 1.6; font-size: 14px;">Best regards,<br><strong>Your Team</strong></p>
          </div>
        `,
      };
  
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "OTP sent to your email!" });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error!" });
    }
  }
  
// Verify Frogot Password OTP
  
const verify_forgot_password = async (req, res) => {
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
        await UserModel.updateOne({ email },{otp: null, otpExpiry: null}); 
        return res.status(400).json({ message: 'OTP has expired! Try again !.' });
      }
  
      
      await UserModel.updateOne(
        { email },
        { otp: null, otpExpiry: null, isVerified: true }
      );
  
  
      res.status(200).json({ message: 'Please Change your password!' });
    } catch (err) {
      console.error('Error occurred during OTP verification:', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
  
// Resend Frogot Password OTP for user
  
const resend_otp_forgot_password = async (req, res) => {
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
  
// Update Password 
  
const update_password = async (req, res) => {
    try {
      const { password, email } = req.body;
  
      if (!password || !email) {
        return res.status(400).json({ message: "Password and email are required" });
      }
  
      if (password.length < 6) {
        return res.status(400).json({ message: "Password should be at least 6 characters long" });
      }
  
      const foundUser = await UserModel.findOne({ email });
  
      if (!foundUser) {
        return res.status(404).json({ message: "No user found!" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      foundUser.password = hashedPassword;
  
      await foundUser.save();
  
      res.status(200).json({ message: "Password updated successfully!" });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error, please try again later" });
    }
  }

export {
    forgot_password,
    verify_forgot_password,
    resend_otp_forgot_password,
    update_password
}