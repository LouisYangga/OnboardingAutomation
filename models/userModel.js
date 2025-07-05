import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    department:{
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    githubUsername: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('User', userSchema);