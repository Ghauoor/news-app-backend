import jwt from "jsonwebtoken";

const authMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
            if (error) {
                return res.status(403).json({ message: "Forbidden Error" });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}


export default authMiddleWare;