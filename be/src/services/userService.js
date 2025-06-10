import User from "../models/User";

export const getAllUsers = async () => {
    try {
        const users = await User.findAll();
        return users;
    } catch (error) {
        throw new Error('Error fetching users: ' + error.message);
    }
}