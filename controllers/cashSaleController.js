const Product = require('../models/Product');
const Sale = require('../models/cashSale');

// CREATE SALE
exports.createSale = async (req, res, next) => {
    try {
        const {
            produceName,
            branchName: requestedBranch,
            tonnageKgs,
            amountPaid,
            buyerName,
            salesAgentName,
            date,
            time
        } = req.body;

        // sales must be recorded in the agent's own branch
        const branchName = req.user.branch;
        if (requestedBranch && requestedBranch !== branchName) {
            return res.status(400).json({ message: 'Cannot record sale for a different branch' });
        }

        const product = await Product.findOne({
            name: produceName,
            branch: branchName
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found from branch' });
        }

        if (product.quantity < tonnageKgs) {
            return res.status(400).json({ message: 'Insufficient stock available' });
        }

        product.quantity -= tonnageKgs;
        await product.save();

        const sale = await Sale.create({
            produceName,
            branchName,
            tonnageKgs,
            amountPaid,
            buyerName,
            salesAgentName,
            date,
            time,
            agent: req.user.id
        });

        res.status(201).json({ sale, product });
    } catch (err) {
        next(err);
    }
};

// GET ALL SALES
exports.getAllSales = async (req, res, next) => {
    try {
        const sales = await Sale.find().populate('agent', 'name branch');
        res.json(sales);
    } catch (err) {
        next(err);
    }
};

// GET SINGLE SALE
exports.getSaleById = async (req, res, next) => {
    try {
        const sale = await Sale.findById(req.params.id).populate('agent');
        if (!sale) return res.status(404).json({ message: 'Sale not found' });
        res.json(sale);
    } catch (err) {
        next(err);
    }
};

// DELETE SALE (Optional: restore stock)
exports.deleteSale = async (req, res, next) => {
    try {
        const sale = await Sale.findById(req.params.id);
        if (!sale) return res.status(404).json({ message: 'Sale not found' });

        const product = await Product.findOne({
            name: sale.produceName,
            branch: sale.branchName
        });
        if (product) {
            product.quantity += sale.tonnageKgs;
            await product.save();
        }

        await sale.deleteOne();
        res.json({ message: 'Sale deleted and stock restored' });
    } catch (err) {
        next(err);
    }
};