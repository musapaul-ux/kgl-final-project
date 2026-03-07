const mongoose = require('mongoose');
const { PRODUCE_NAMES, BRANCH_NAMES } = require('../utils/constants');

const creditSchema = new mongoose.Schema({
    buyerName: {
        type: String,
        required: true,
        minlength: 2,
        match: [/^[A-Za-z0-9\s]+$/, 'Buyer name must be alphanumeric']
    },
    nationalId: {
        type: String,
        required: true,
        match: [/^[0-9]{14}$/, 'National ID must be a 14-digit NIN']
    },
    location: {
        type: String,
        required: true,
        minlength: 2,
        match: [/^[A-Za-z0-9\s]+$/, 'Location must be alphanumeric']
    },
    contact: {
        type: String,
        required: true,
        match: [/^\+?[0-9]{10,15}$/, 'Please provide a valid phone number']
    },
    amountDue: {
        type: Number,
        required: true,
        min: [10000, 'Amount due must be at least 5 digits']
    },
    salesAgentName: {
        type: String,
        required: true,
        minlength: 2,
        match: [/^[A-Za-z0-9\s]+$/, 'Agent name must be alphanumeric']
    },
    dueDate: {
        type: Date,
        required: true
    },

    produceName: {
        type: String,
        required: true,
        minlength: 2,
        enum: PRODUCE_NAMES
    },
    produceType: {
        type: String,
        required: true,
        minlength: 2,
        match: [/^[A-Za-z\s]+$/, 'Produce type must contain letters only']
    },
    tonnageKgs: {
        type: Number,
        required: true
    },
    dispatchDate: {
        type: Date,
        required: true
    },
    branchName: {
        type: String,
        enum: BRANCH_NAMES,
        required: true
    },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('CreditSale', creditSchema);
