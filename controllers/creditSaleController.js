const Product = require('../models/Product');
const Credit = require('../models/CreditSale');

// CREATE CREDIT RECORD
exports.createCredit = async (req, res, next) => {
    try {
        const {
            buyerName,
            nationalId,
            location,
            contact,
            amountDue,
            salesAgentName,
            dueDate,
            produceName,
            produceType,
            tonnageKgs,
            dispatchDate,
            branchName
        } = req.body;

        const quantity = Number(tonnageKgs);

        if (quantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        const product = await Product.findOne({
            name: produceName,
            branch: branchName
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found for branch" });
        }

        if (product.quantity < quantity) {
            return res.status(400).json({ message: "Insufficient stock available" });
        }

        // Create credit record
        const credit = await Credit.create({
            buyerName,
            nationalId,
            location,
            contact,
            amountDue,
            salesAgentName,
            dueDate,
            produceName,
            produceType,
            tonnageKgs: quantity,
            dispatchDate,
            branchName,
            agent: req.user.id
        });

        // Update stock AFTER credit is saved
        if(credit){
             product.quantity -= quantity;
        await product.save();

        res.status(201).json({ credit, product });
        }
    } catch (err) {
        next(err);
    }
};

// GET ALL CREDITS
exports.getAllCredits = async (req, res, next) => {
    try {
        const credits = await Credit.find().populate('agent', 'name branch');
        res.json(credits);
    } catch (err) {
        next(err);
    }
};

// DELETE CREDIT (restore stock)
exports.deleteCredit = async (req, res, next) => {
    try {
        const credit = await Credit.findById(req.params.id);
        if (!credit) return res.status(404).json({ message: 'Record not found' });

        const product = await Product.findOne({ name: credit.produceName, branch: credit.branchName });
        if (product) {
            product.quantity += credit.tonnageKgs;
            await product.save();
        }

        await credit.deleteOne();
        res.json({ message: 'Credit record deleted and stock restored' });
    } catch (err) {
        next(err);
    }
};
