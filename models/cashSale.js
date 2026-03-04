const mongoose = require('mongoose');
const { PRODUCE_NAMES, BRANCH_NAMES } = require('../utils/constants');

const saleSchema = new mongoose.Schema({
    produceName: {
        type: String,
        enum: PRODUCE_NAMES,        // ensures only allowed products can be sold
        required: true,
    },

    branchName: {
        type: String,
        enum: BRANCH_NAMES,         // which branch handled the sale
        required: true,
    },

    tonnageKgs: {
        type: Number,
        required: true,
    },

    amountPaid: {
        type: Number,
        min: [10000, 'Amount paid should be at least 5 digits'],
        required: true,
    },

    buyerName: {
        type: String,
        minlength: 2,
        match: [/^[A-Za-z0-9\s]+$/, 'Buyer name must be alphanumeric'],
        required: true
    },

    salesAgentName: {
        type: String,
        minlength: 2,
        match: [/^[A-Za-z0-9\s]+$/, 'Agent name must be alphanumeric'],
        required: true
    },

    date: {
        type: Date,
        required: true,
    },

    time: {
        type: String,
        required: true
    },

    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

}, { timestamps: true });

module.exports = mongoose.model('CashSale', saleSchema);