import UserModel from '../../models/UserModel.js';
import transporter from '../../utils/email.js'
import bcrypt  from 'bcryptjs'


// Register for user with email OTP


export  const registerUser = async (req, res, next) => {
    try {
      const { name, email, phone, password, status } = req.body;
  
  
      const userExist = await UserModel.findOne({ $or: [{ email }, { phone }] });
      if (userExist) {
        return res.status(400).json({ message: 'User already exists with this email or phone!' });
      }
  
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpiry = Date.now() + 60 * 1000; 
  
   const hashedPassword = await bcrypt.hash(password, 10);

      const user = new UserModel({
        name,
        email,
        phone,
        password:hashedPassword,
        status,
      });
  
  
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
  
  
      const mailOptions = {
        from: 'mohamedejaz075@gmail.com', 
        to: email,
        subject: 'Your OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; max-width: 500px; margin: 0 auto; color: #333;">
            <h4 style="margin-top: 0; color: #4CAF50;">Hi ${name},</h4>
            <h1 style="font-size: 24px; color: #333;">Your OTP code for registration is: 
              <strong style="color: #ff5722;">${otp}</strong>
            </h1>
            <p style="line-height: 1.6; font-size: 16px;">Please use this code to verify your email address. This OTP is valid for only 60 seconds.</p>
            <p style="margin-top: 20px; line-height: 1.6; font-size: 14px;">Best regards,<br><strong>Your Team</strong></p>
          </div>
        `,
      };
  
      await transporter.sendMail(mailOptions);
  
  
       setTimeout(async () => {
        const foundUser = await UserModel.findOne({ email });
        if (foundUser && !foundUser.isVerified && foundUser.otpExpiry < Date.now()) {
          await UserModel.deleteOne({ email });
          console.log(`User with email ${email} deleted due to expired OTP.`);
        }
      }, 60000)
  
  
      res.status(200).json({ message: 'OTP sent successfully!' ,user });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          message: 'Duplicate email or phone detected!',
          error: err.message,
        });
      }
      console.error('Error occurred:', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  };
  
  // Verify User with email OTP
  
export  const verifyOTP = async (req, res) => {
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
  
export  const resendOtp = async (req, res) => {
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
  };

// Login user with email and password

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password presence
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required!' });
  }

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    // Compare the input password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    // Successful login
    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user._id,
        email: user.email,
        name: user.name, // Include other necessary fields if needed
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error, please try again later!' });
  }
};


// Handle GOOGLE register and login 

const handle_google_auth = async (req, res) => {
    try {
      const { credential } = req.body;
      const { name, email, picture } = credential;
  
      
  
      let user = await UserModel.findOne({ email });
      let isNew = false;
  
      if (!user) {
        isNew = true;
        user = new UserModel({
          name,
          email,
          profilePicture: picture,
          isVerified: true,
        });
        await user.save();
      } else {
        if (user.status) {
  
          user.name = name || user.name;
          user.profilePicture = picture || user.profilePicture;
          await user.save();
        } else {
          return res.status(403).json({
            message: 'Access denied: User is blocked or inactive',
          });
        }
      }
  
      return res.status(200).json({
        message: isNew ? 'Sign-Up successful' : 'Login successful',
        user,
      });
    } catch (error) {
      console.error('Error in Google Authentication:', error);
      return res.status(500).json({ message: 'Internal server error', error });
    }
  }

// Get current user for header , other use cases
  
const get_current_user = async (req, res) => {
    try {
      const { id } = req.params;
  
      if(!id) console.log('errorr no id')
  
      const currUser = await UserModel.findById(id);
  
      if (!currUser) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.status(200).json({
        message: 'User retrieved successfully.',
        currentUser: currUser,
      });
    } catch (error) {
      console.error('Error in getCurrentUser:', error.message);
      res.status(500).json({
        message: 'An error occurred while retrieving user details.',
        error: error.message,
      });
    }
  }

// Forgot password 

 export const forgotPassword = async (req, res) => {
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
};


// Verify Frogot Password OTP

export const verifyForgotPassword = async (req, res) => {
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
};

// Resend Frogot Password OTP for user

export const resendOtpForgotPassword = async (req, res) => {
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
};


// Update Password 

export const updatePassword = async (req, res) => {
  try {
    const { password, email } = req.body;

    // Validate presence of password and email
    if (!password || !email) {
      return res.status(400).json({ message: "Password and email are required" });
    }

    // Optional: Password strength validation (e.g., minimum length)
    if (password.length < 6) {
      return res.status(400).json({ message: "Password should be at least 6 characters long" });
    }

    // Find the user by email
    const foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      return res.status(404).json({ message: "No user found!" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the password in the database
    foundUser.password = hashedPassword;

    // Save the updated user object
    await foundUser.save();

    // Respond with a success message
    res.status(200).json({ message: "Password updated successfully!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
}

export {
    handle_google_auth,
    get_current_user
}