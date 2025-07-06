import User from "../models/userModel.js";
import Log from "../models/logModels.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
export const createUser = async (firstName, lastName, email, department, title, githubUsername) => {
    try {
        // Check if user already exists by email
        const exists = await existByEmail(email);
        if (exists) {
            throw new Error("User already exists with this email.");
        }
        const plainPassword = generateRandomPassword();
        const hashedPassword = bcrypt.hashSync(plainPassword, 10);
        const user = new User({
            firstName, 
            lastName, 
            email, 
            password: hashedPassword, 
            department, 
            title, 
            githubUsername
        });
        await user.save();
        //return user with plain password for further use (e.g., sending to user)
        const userObject = user.toObject();
        delete userObject.password; // Remove password from the returned object
        return {user: userObject, plainPassword}; // Return user object without password and with plain password
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const existByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user ? true : false;         
  }
  catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
}

export const generateRandomPassword = (length = 12) => {
const lower = 'abcdefghjkmnpqrstuvwxyz';
  const upper = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  const numbers = '23456789';
  const symbols = '!@#$%&*';
  const all = lower + upper + numbers + symbols;

  const bytes = crypto.randomBytes(length);
  const password = Array.from(bytes).map(b => all[b % all.length]).join('');
  return password;
};

export const logEntry = async (email, step, status) => {
    try {
        const log = new Log({
            email,
            step,
            status,
            timestamp: new Date()
        });
        await log.save();
        // console.log("Log entry saved:", log);
        return log;
    } catch (error) {
        console.error("Error saving log entry:", error);
        throw error;
    }
};
export const checkPassword = async(email, password) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }
        return user; // Return user object if password is valid
};