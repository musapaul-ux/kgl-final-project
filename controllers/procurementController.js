const Product = require('../models/Product');
const Procurement = require('../models/Procurement');


// CREATE PROCUREMENT
exports.createProcurement = async (req, res, next) => {
    try {
        const {
            produceName,
            supplierType,
            supplierName,
            produceType,
            date,
            time,
            tonnageKgs,
            costUgx,
            branchName,
            contact,
            PriceToBeSoldAt
        } = req.body;

        const quantity = Number(tonnageKgs)

       if (quantity <= 0) {
            return res.status(400).json({
                message: "Invalid tonnage value"
            });
        }

        // individual dealers must supply at least 1 tonne
        if (supplierType === 'Individual' && tonnageKgs < 1000) {
            return res.status(400).json({
                message: 'Individual dealer deliveries must be at least 1000kgs'
            });
        }

        // if it's a farm delivery, supplierName should equal branch
        if (supplierType === 'Farm') {
            if (supplierName !== branchName || supplierName !== "Matugga" || supplierName !== "Maganjo") {
                return res.status(400).json({
                    message: 'Farm supplierName must match branch'
                });
            }
        }

        const procurement = await Procurement.create({
            produceName,
            supplierType,
            supplierName,
            produceType,
            date,
            time,
            tonnageKgs,
            costUgx,
            branchName,
            contact,
            PriceToBeSoldAt,
            manager: req.user.id
        });

        // update product inventory for the branch
        let product = await Product.findOne({
            name: produceName,
            branch: branchName
        });

        if (product) {
            product.quantity += quantity;
            await product.save();
        } else {
            // create a new product entry if it doesn't exist yet
            product = await Product.create({
                name: produceName,
                quantity: quantity,
                price: PriceToBeSoldAt || costUgx, // whichever price you sell at
                branch: branchName
            });
        }

        // return both records for convenience
        res.status(201).json({ procurement, product });
    } catch (err) {
        next(err);
    }
};



// GET ALL PROCUREMENT
exports.getAllProcurement = async (req, res, next) => {
    try {
        const records = await Procurement.find().populate('manager', 'name');
        res.json(records);
    } catch (err) {
        next(err);
    }
};


// DELETE PROCUREMENT (reverse stock)
exports.deleteProcurement = async (req, res, next) => {
    try {
        const record = await Procurement.findById(req.params.id);
        if (!record) return res.status(404).json({ message: 'Record not found' });

        const product = await Product.findOne({
            name: record.produceName,
            branch: record.branchName
        });
        if (product) {
            product.quantity -= record.tonnageKgs;
            await product.save();
        }

        await record.deleteOne();
        res.json({ message: 'Procurement deleted and stock reversed' });
    } catch (err) {
        next(err);
    }
};