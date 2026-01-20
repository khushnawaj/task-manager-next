import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || "7d";

import Organization from "../models/Organization.js";

function signAccess(user) {
  return jwt.sign({ sub: user._id }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}
function signRefresh(user) {
  return jwt.sign({ sub: user._id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: "Missing fields" });
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email taken" });
    
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    // Create Default Organization
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
    
    const org = await Organization.create({
      name: `${name}'s Workspace`,
      slug,
      ownerId: user._id,
      members: [{ userId: user._id, role: 'admin' }]
    });
    
    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);
    
    user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
    await user.save();
    
    // Set refresh token as httpOnly secure cookie
    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "lax", maxAge: 7*24*3600*1000 });
    
    res.json({ 
      user: { id: user._id, name: user.name, email: user.email }, 
      accessToken,
      organizations: [org]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    
    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);
    
    user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
    await user.save();
    
    // Fetch Organizations
    const organizations = await Organization.find({ "members.userId": user._id });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "lax" });
    res.json({ 
      user: { id: user._id, name: user.name, email: user.email }, 
      accessToken,
      organizations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "Missing refresh token" });
    const payload = jwt.verify(token, REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: "User not found" });
    // simple revocation: check token exists
    if (!user.refreshTokens.some(r => r.token === token)) return res.status(401).json({ error: "Refresh token revoked" });
    const accessToken = jwt.sign({ sub: user._id }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
    res.json({ accessToken, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token && req.body.revoke !== false) {
      // remove token from user refreshTokens
      const payload = jwt.verify(token, REFRESH_SECRET);
      const user = await User.findById(payload.sub);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(r => r.token !== token);
        await user.save();
      }
    }
    res.clearCookie("refreshToken");
    res.json({ ok: true });
  } catch (err) {
    res.clearCookie("refreshToken");
    res.json({ ok: true });
  }
};
