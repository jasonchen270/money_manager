import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Please provide all required fields" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(200).json({ status: true, message: "User created" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Please provide all required fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid password" });
    }

    // Create and sign token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Attach token to cookie
    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({ status: true, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ status: false, message: "No token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ status: false, message: "User not found" });
    }

    // Attach user to request object
    req.user = user;
    
    // Go to next middleware
    next();
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

export const authorizeUser = (req, res) => {
  // verifyUser is checked first
  return res
    .status(200)
    .json({ status: true, message: "Authorized", user: req.user });
};

export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ status: true, message: "Logout successful" });
};
