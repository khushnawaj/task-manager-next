import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import { AppError, UnauthorizedError } from "../utils/errors.js";

dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || "7d";

function signAccess(user) {
  return jwt.sign({ sub: user._id }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}
function signRefresh(user) {
  return jwt.sign({ sub: user._id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return next(new AppError("Email already in use", 400));

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
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 3600 * 1000 });

    // Signup response
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      organizations: [org]
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(new AppError("Invalid credentials", 401));

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return next(new AppError("Invalid credentials", 401));

    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);

    user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
    await user.save();

    // Fetch Organizations
    const organizations = await Organization.find({ "members.userId": user._id });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      organizations
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return next(new UnauthorizedError("Missing refresh token"));

    const payload = jwt.verify(token, REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return next(new UnauthorizedError("User not found"));

    // simple revocation: check token exists
    if (!user.refreshTokens.some(r => r.token === token)) {
      return next(new UnauthorizedError("Refresh token revoked"));
    }

    const accessToken = signAccess(user);
    res.json({ accessToken, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    return next(new UnauthorizedError("Invalid refresh token"));
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token && req.body.revoke !== false) {
      // remove token from user refreshTokens
      try {
        const payload = jwt.verify(token, REFRESH_SECRET, { ignoreExpiration: true });
        const user = await User.findById(payload.sub);
        if (user) {
          user.refreshTokens = user.refreshTokens.filter(r => r.token !== token);
          await user.save();
        }
      } catch (verifyErr) {
        // Safe to ignore verify errors on logout (e.g. token already expired)
      }
    }
    res.clearCookie("refreshToken");
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
