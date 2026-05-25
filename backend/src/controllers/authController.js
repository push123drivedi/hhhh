import Staff from "../models/Staff.js";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const staffProfile = await Staff.findOne({ user: user._id });
  res.json({
    token: signToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      staffId: staffProfile?._id
    }
  });
}

export async function me(req, res) {
  const staffProfile = await Staff.findOne({ user: req.user._id });
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      staffId: staffProfile?._id
    }
  });
}
