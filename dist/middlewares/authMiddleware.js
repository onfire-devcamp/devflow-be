import jwt from "jsonwebtoken";
export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // 1. Check if header exists and format is correct
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No access, token not found!" });
        return;
    }
    // 2. Extract token
    const token = authHeader.split(" ")[1];
    // 3. Verify token
    try {
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey)
            throw new Error("JWT_SECRET is missing");
        req.user = jwt.verify(token, secretKey);
        return next();
    }
    catch (error) {
        res.status(401).json({ message: "No access, invalid or expired token!" });
        return;
    }
};
