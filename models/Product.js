const mongoose = require('mongoose');
const { PRODUCE_NAMES, BRANCH_NAMES } = require('../utils/constants');

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        enum: PRODUCE_NAMES 
    },

    quantity: { 
        type: Number, 
        required: true
     }, // kgs

    price: {
         type: Number, 
         required: true 
        }, // price per kg
    branch: {
        type: String,
        enum: BRANCH_NAMES,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);