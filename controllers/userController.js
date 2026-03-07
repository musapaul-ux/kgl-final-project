const User = require('../models/User');
const bcrypt = require('bcrypt');


// CREATE USER
exports.createUser = async (req, res) => {
    const { name, email, password, role, branch } = req.body;

    if ((role === 'Manager' || role === 'SalesAgent') && !branch) {
        return res.status(400).json({ message: 'Branch is required for managers and attendants' });
    }

    // enforce one manager per branch
    if (role === 'Manager') {
        const existing = await User.countDocuments({ role: 'Manager', branch });
        if (existing >= 1) {
            return res.status(400).json({ message: 'Each branch can have only one manager' });
        }
    }

    // enforce max two sales agents per branch
    if (role === 'SalesAgent') {
        const existing = await User.countDocuments({ role: 'SalesAgent', branch });
        if (existing >= 2) {
            return res.status(400).json({ message: 'Each branch can have at most two attendants' });
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        branch
    });

    res.status(201).json(user);
};


// GET ALL USERS
exports.getUsers = async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
};

// GET USER BY ID
exports.getUserById = async (req, res) =>{
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
}


// UPDATE USER
exports.updateUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).select('-password');

    if (!user)
        return res.status(404).json({ message: "User not found" });

    res.json(user);
};


// DELETE USER
exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
};