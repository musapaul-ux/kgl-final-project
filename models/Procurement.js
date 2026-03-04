const mongoose = require('mongoose');
const { PRODUCE_NAMES, BRANCH_NAMES } = require('../utils/constants');

const procurementSchema = new mongoose.Schema({
    produceName: {
        type: String,
        enum: PRODUCE_NAMES, // only allow names defined in constants
        required: true
    },

    // where the stock came from
    supplierType: {
        type: String,
        enum: ['Individual', 'Company', 'Farm'],
        required: true
    },

    supplierName: {
        type: String,
        required: true,
        minlength: 2
    },

    produceType: {
        type: String,
        required: true,
        minlength: 2,
        match: [/^[A-Za-z\s]+$/, 'Produce type must contain alphabets only']
    },

    date: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    tonnageKgs: {
        type: Number,
        required: true,
        min: [100, 'Tonnage must be atleast 3 digits']
    },

    costUgx: {
        type: Number,
        required: true,
        min: [10000, 'Cost must be at least 5 digits (10,000+)']
    },

    branchName: {
        type: String,
        enum: BRANCH_NAMES,
        required: true,
        // if supplierType === 'Farm' branchName should match the farm
    },

    contact: {
        type: String,
        required: true,
        match: [/^\+?[0-9]{10,15}$/, 'Please provide a valid phone number']
    },

    PriceToBeSoldAt: {
        type: Number,
        required: true
    },

    manager: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Procurement', procurementSchema);