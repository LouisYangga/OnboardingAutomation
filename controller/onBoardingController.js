import axios from 'axios';
import {createUser,logEntry, saveUser,findLogsByEmail} from '../utils/utils.js';
import bcrypt from 'bcrypt';

// POST /start-onboarding
export const startOnboarding = async (req, res) => {
    const { firstName, lastName, email, department, title, githubUsername } = req.body;

    if (!email || !firstName || !lastName || !department || !title) {
        return res.status(400).json({ error: 'Email, firstName, lastName, department, and title are required' });
    }

    try {
        //create user and log the onboarding start and save to database
        const {user, plainPassword} = await createUser(firstName, lastName, email, department, title, githubUsername);
        const log = await logEntry(email, 'Onboarding Started', 'success');
        const userCreatedLog = await logEntry(email, 'User Created', 'success');
        const io = req.app.get('io');
        io.emit('log', log);
        io.emit('log', userCreatedLog);
        // console.log('User created:', user);

        //send user data and plain password to n8n webhook
        try {
            //let it run in the background
            axios.post(process.env.N8N_WEBHOOK_URL, { user, password: plainPassword });
        } catch (axiosError) { // Handle axios error
            console.error('Failed to notify n8n webhook:', axiosError.message);
            const errorLog = await logEntry(email, 'Failed to notify n8n', 'error');
            const io = req.app.get('io');
            io.emit('log', errorLog);
            io.emit('error', { message: 'Failed to notify n8n', details: axiosError.message });
            return res.status(500).json({ error: 'Failed to notify n8n' });
        }
        await saveUser(user); // Save user after sending to n8n to ensure password is hashed
        res.status(201).json({ message: 'User created successfully', user, password: plainPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Failed to start onboarding' });
    }
};

// POST /log-onboarding
export const logOnboardingStep = async (req, res) => {
    const { email, step, status } = req.body;

    if (!email || !step || !status) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        const log = await logEntry(email, step, status);
        const io = req.app.get('io');
        io.emit('log', log);
        res.status(200).json({ message: 'Log saved', log});
    } catch (error) {
        console.error('Log saving error:', error);
        res.status(500).json({ error: 'Failed to save log' });
    }
};

// GET /logs/:email
export const getLogsByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const logs = await findLogsByEmail(email);
        res.status(200).json(logs);
    } catch (error) {
        console.error('Fetching logs error:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
};

export const userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await checkPassword(email, password);

        // Remove password before sending user object
        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.password;
        delete userWithoutPassword.__v;
        delete userWithoutPassword._id;
        res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
}

// PUT /update-password
export const updatePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Email, oldPassword, and newPassword are required' });
    }

    try {
        const user = await checkPassword(email, oldPassword);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        await logEntry(email, 'Password Updated', 'success');
        const io = req.app.get('io');
        io.emit('log', { email, step: 'Password Updated', status: 'success', timestamp: new Date() });

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ error: 'Failed to update password' });
    }
};

export const healthCheck = (req, res) => {
    console.log('Health check endpoint hit');
    res.status(200).json({ 
        message: 'API is healthy',
        timestamp: new Date().toISOString(),
    });
}