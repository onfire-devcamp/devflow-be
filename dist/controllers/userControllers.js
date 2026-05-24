import User from "../models/userModel.js";
import { loginUserService, createUserService, googleAuthService, } from "../services/userServices.js";
import { AuthenticationError, BadRequestError } from "../utils/customErrors.js";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const serverError = (res, context, error) => {
    console.error(`[${context}]`, error);
    res.status(500).json({ message: "Internal server error" });
};
// GET /users
export const getUser = async (_req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (error) {
        serverError(res, "getUser", error);
    }
};
// POST /users (Register)
export const createUser = async (req, res) => {
    try {
        const { email, password, username, avatarUrl, skills } = req.body;
        if (!email?.trim() || !password?.trim() || !username?.trim()) {
            res.status(400).json({ message: "Email, password, and username are required." });
            return;
        }
        if (!EMAIL_RE.test(email)) {
            res.status(400).json({ message: "Invalid email format." });
            return;
        }
        const result = await createUserService({ email, password, username, avatarUrl, skills });
        res.status(201).json({ message: "Account created!", ...result });
    }
    catch (error) {
        if (error instanceof BadRequestError) {
            res.status(error.statusCode).json({ message: error.message });
            return;
        }
        serverError(res, "createUser", error);
    }
};
// PUT /users/profile
export const updateProfile = async (req, res) => {
    try {
        const authenticatedUser = req.user;
        const id = authenticatedUser?.userId;
        const user = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json(user);
    }
    catch (error) {
        serverError(res, "updateProfile", error);
    }
};
// DELETE /users/profile
export const deleteProfile = async (req, res) => {
    try {
        const authenticatedUser = req.user;
        const id = authenticatedUser?.userId;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "Your account has been successfully deleted." });
    }
    catch (error) {
        serverError(res, "deleteProfile", error);
    }
};
// POST /users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email?.trim() || !password?.trim()) {
            res.status(400).json({ message: "Please provide both email and password." });
            return;
        }
        const result = await loginUserService({ email, password });
        res.status(200).json({ message: "Login successful!", ...result });
    }
    catch (error) {
        if (error instanceof AuthenticationError) {
            res.status(error.statusCode).json({ message: error.message });
            return;
        }
        serverError(res, "loginUser", error);
    }
};
// POST /users/google-auth
export const googleAuth = async (req, res) => {
    try {
        const { accessToken } = req.body;
        if (!accessToken?.trim()) {
            res.status(400).json({ message: "Access token is required." });
            return;
        }
        const result = await googleAuthService(accessToken);
        res.status(200).json({ message: "Google authentication successful!", ...result });
    }
    catch (error) {
        if (error instanceof AuthenticationError || error instanceof BadRequestError) {
            res.status(error.statusCode).json({ message: error.message });
            return;
        }
        serverError(res, "googleAuth", error);
    }
};
