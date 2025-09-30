"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already registered' });
            return;
        }
        const hashedPassword = await (0, password_1.hashPassword)(password);
        const user = await User_1.User.create({
            email,
            password: hashedPassword,
            name
        });
        const token = (0, jwt_1.generateToken)({
            userId: String(user._id),
            email: user.email
        });
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const isPasswordValid = await (0, password_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const token = (0, jwt_1.generateToken)({
            userId: String(user._id),
            email: user.email
        });
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User_1.User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt
            }
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
};
exports.getProfile = getProfile;
//# sourceMappingURL=authController.js.map