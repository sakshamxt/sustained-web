import jwt from 'jsonwebtoken';


const generateToken = (userId) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in .env file.');
    throw new Error('Server configuration error: JWT_SECRET is missing.');
  }

  try {
    return jwt.sign({ id: userId }, jwtSecret, {
      expiresIn: '1d', // Token expires in 1 day
    });
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Could not generate authentication token.');
  }
};

export default generateToken;