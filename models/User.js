const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },

    email: { 
        type: String, 
        unique: true, 
        required: true
     },

    password: { 
        type: String, 
        required: true,
        minlength: 6
    },

    role: {
        type: String,
        enum: ['SalesAgent', 'Manager', 'Director'],
        required: true
    },
    
    branch: {
        type: String,
        enum: ['Matugga', 'Maganjo']
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);