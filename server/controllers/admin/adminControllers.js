// Login

const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required!',
      });
    }
  
    if (email === process.env.ADMIM_EMAIL && password === process.env.ADMIN_PASSWORD) {
      return res.status(200).json({
        success: true,
        message: 'Login successful!',
        admin: { email },
      });
    }
  
    return res.status(400).json({
      success: false,
      message: 'Incorrect credentials!',
    });
}


export {
    login
}