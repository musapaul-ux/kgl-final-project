const Product = require('../models/Product');
const CashSale = require('../models/cashSale');
const Procurement = require('../models/Procurement');
const Credit = require('../models/CreditSale');


//  MAIN DASHBOARD SUMMARY

exports.getDashboardSummary = async (req, res, next) => {
    try {

        // Total Stock Across All Branches
        const totalStock = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: "$quantity" }
                }
            }
        ]);

        // Total Sales Revenue from cash sales
        const totalSales = await CashSale.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amountPaid" }
                }
            }
        ]);

        // Outstanding credit records (amountDue)
        const outstandingCredits = await Credit.aggregate([
            {
                $group: {
                    _id: null,
                    totalCredit: { $sum: "$amountDue" }
                }
            }
        ]);

        res.json({
            totalStock: totalStock[0]?.totalQuantity || 0,
            totalRevenue: totalSales[0]?.totalRevenue || 0,
            outstandingCredits: outstandingCredits[0]?.totalCredit || 0
        });

    } catch (error) {
        next(error);
    }
};



//  BRANCH PERFORMANCE REPORT

exports.getBranchPerformance = async (req, res, next) => {
    try {

        const branchSales = await CashSale.aggregate([
            {
                $group: {
                    _id: "$branchName",
                    totalRevenue: { $sum: "$amountPaid" },
                    totalQuantitySold: { $sum: "$tonnageKgs" }
                }
            }
        ]);

        res.json(branchSales);

    } catch (error) {
        next(error);
    }
};




//  MONTHLY SALES REPORT

exports.getMonthlySalesReport = async (req, res, next) => {
    try {

        const monthlySales = await CashSale.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    totalRevenue: { $sum: "$amountPaid" }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } }
        ]);

        res.json(monthlySales);

    } catch (error) {
        next(error);
    }
};