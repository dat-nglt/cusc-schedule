
// import User from '../models/User.js';
// import { generateToken } from '../services/authService.js';
// import { APIResponse } from '../utils/APIResponse.js';

// // Handle user login
// export const login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user || !(await user.comparePassword(password))) {
//             return APIResponse(res, 401, 'Invalid credentials');
//         }

//         const token = generateToken(user._id);
//         return APIResponse(res, 200, { token });
//     } catch (error) {
//         return APIResponse(res, 500, 'Server error');
//     }
// };

// // Handle user registration
// export const register = async (req, res) => {
//     const { name, email, password } = req.body;

//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return APIResponse(res, 400, 'User already exists');
//         }

//         const newUser = new User({ name, email, password });
//         await newUser.save();

//         return APIResponse(res, 201, 'User registered successfully');
//     } catch (error) {
//         return APIResponse(res, 500, 'Server error');
//     }
// };

// // Handle user logout
// export const logout = (req, res) => {
//     // Logic for logging out the user (e.g., invalidating the token)
//     return APIResponse(res, 200, 'User logged out successfully');
// };