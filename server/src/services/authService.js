const User = require('../models/User');
const jwt = require('../utils/jwt');

exports.registerUser = async (username, email, password) => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error('Username or email already exists');
  }
  const user = new User({ username, email, password });
  await user.save();
  return user;
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid email or password');
  }
  const token = jwt.generateToken(user._id);
  return { user, token };
};
