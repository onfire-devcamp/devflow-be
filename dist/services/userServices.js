// src/services/userServices.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { env } from "../config/environment.js";
import { AuthenticationError, BadRequestError } from "../utils/customErrors.js";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 72;
const signToken = (userId, email) => jwt.sign({ userId, email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
});
const validateEmailFormat = (email) => {
    if (!EMAIL_RE.test(email)) {
        throw new BadRequestError("Invalid email format.");
    }
};
const validatePasswordStrength = (password) => {
    if (password.length < PASSWORD_MIN) {
        throw new BadRequestError("Password must be at least 8 characters.");
    }
    if (password.length > PASSWORD_MAX) {
        throw new BadRequestError("Password must be at most 72 characters.");
    }
};
export const createUserService = async (input) => {
    const { email, password, username, avatarUrl, skills } = input;
    validateEmailFormat(email);
    validatePasswordStrength(password);
    const passwordHash = await bcrypt.hash(password, env.SALT_ROUNDS);
    try {
        const user = await User.create({
            email,
            passwordHash,
            username,
            avatarUrl,
            skills,
            provider: "local",
        });
        const token = signToken(user._id, user.email);
        return { token, user: { id: user._id, username: user.username, email: user.email } };
    }
    catch (error) {
        if (error.code === 11000) {
            throw new BadRequestError("Email is already in use.");
        }
        throw error;
    }
};
export const loginUserService = async (input) => {
    const { email, password } = input;
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
        throw new AuthenticationError("Invalid email or password!");
    }
    if (!user.passwordHash) {
        throw new AuthenticationError("This account uses Google Sign-In. Please continue with Google.");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
        throw new AuthenticationError("Invalid email or password!");
    }
    const token = signToken(user._id, user.email);
    return {
        token,
        user: { id: user._id, username: user.username, email: user.email },
    };
};
export const googleAuthService = async (accessToken) => {
    const googleRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!googleRes.ok) {
        throw new AuthenticationError("Invalid Google token.");
    }
    const googleUser = (await googleRes.json());
    if (!googleUser.email) {
        throw new AuthenticationError("Could not retrieve email from Google.");
    }
    if (googleUser.verified_email === false) {
        throw new AuthenticationError("Google account email is not verified.");
    }
    let user = await User.findOne({ email: googleUser.email });
    if (user) {
        if (user.provider !== "google") {
            throw new BadRequestError("An account with this email already exists. Please sign in with your password.");
        }
        user.lastLogin = new Date();
        await user.save();
    }
    else {
        user = await User.create({
            email: googleUser.email,
            username: googleUser.name,
            avatarUrl: googleUser.picture ?? "",
            provider: "google",
            providerId: googleUser.id,
        });
    }
    const token = signToken(user._id, user.email);
    return {
        token,
        user: { id: user._id, username: user.username, email: user.email },
    };
};
