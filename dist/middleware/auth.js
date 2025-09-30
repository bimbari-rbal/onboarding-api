"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        const token = authHeader.substring(7);
        const decoded = (0, jwt_1.verifyToken)(token);
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map