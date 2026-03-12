import { User } from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone, city } = req.body;

    // ✅ Step 1: Validate required fields
    if (!username || !email || !password || !phone || !city) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Step 2: Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists." });
    }

    // ✅ Step 3: Hash the password
    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    // ✅ Step 4: Create and save new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      city
    });

    await newUser.save();

    const token = jwt.sign(
      { _id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✅ User registered: ${username} (${email}) from ${city}`);
    return res.status(200).json({ message: "User saved", user: newUser, token });

  } catch (err) {
    console.error("Error: ", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const checkLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const isMatch = await bcrypt.compare(password.toString(), user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✅ User logged in: ${user.username} from ${user.city}`);
    return res.status(200).json({
      message: "Welcome user",
      username: user.username,
      _id: user._id.toString(),
      city: user.city,
      token
    });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

