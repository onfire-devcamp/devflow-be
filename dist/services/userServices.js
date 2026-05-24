// src/services/userServices.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { env } from "../config/environment.js";
import { AuthenticationError, BadRequestError } from "../utils/customErrors.js";
export const createUserService = async (input) => {
    const { email, password, username, avatarUrl, skills } = input;
    const passwordHash = await bcrypt.hash(password, env.SALT_ROUNDS);
    try {
        const user = await User.create({
            email,
            passwordHash,
            username,
            avatarUrl,
            skills,
        });
        return { id: user._id, username: user.username, email: user.email };
    }
    catch (error) {
        // error code 11000
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
    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
        throw new AuthenticationError("Invalid email or password!");
    }
    const secretKey = env.JWT_SECRET;
    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {
        expiresIn: env.JWT_EXPIRES_IN,
    });
    return {
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    };
};
