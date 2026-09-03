const {
    createStockTransaction,
    getAllStockTransactions,
    getTransactionsByProductId
} = require("../models/StockTransaction");


// ========================================
// CREATE STOCK TRANSACTION
// ========================================

const createStockTransactionController = async (req, res) => {

    try {

        const {
            product_id,
            transaction_type,
            quantity,
            notes
        } = req.body;


        // ========================================
        // VALIDATE PRODUCT ID
        // ========================================

        if (
            !Number.isInteger(Number(product_id)) ||
            Number(product_id) <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });

        }


        // ========================================
        // VALIDATE TRANSACTION TYPE
        // ========================================

        if (
            transaction_type !== "STOCK_IN" &&
            transaction_type !== "STOCK_OUT"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Transaction type must be STOCK_IN or STOCK_OUT"
            });

        }


        // ========================================
        // VALIDATE QUANTITY
        // ========================================

        if (
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be a positive integer"
            });

        }


        // ========================================
        // CREATE TRANSACTION
        // ========================================

        const transaction =
            await createStockTransaction({

                product_id: Number(product_id),

                user_id: req.user.id,

                transaction_type,

                quantity: Number(quantity),

                notes: notes || null

            });


        return res.status(201).json({

            success: true,

            message:
                "Stock transaction created successfully",

            data: transaction

        });


    } catch (error) {

        console.error(
            "Create stock transaction error:",
            error
        );


        // ========================================
        // KNOWN STOCK ERRORS
        // ========================================

        if (
            error.message === "Insufficient stock" ||
            error.message === "Product not found" ||
            error.message === "Invalid transaction type"
        ) {

            return res.status(400).json({

                success: false,

                message: error.message

            });

        }


        // ========================================
        // UNEXPECTED SERVER ERROR
        // ========================================

        return res.status(500).json({

            success: false,

            message:
                "Server error while creating stock transaction"

        });

    }

};


// ========================================
// GET ALL STOCK TRANSACTIONS
// ========================================

const getStockTransactionsController = async (
    req,
    res
) => {

    try {

        const transactions =
            await getAllStockTransactions();


        return res.status(200).json({

            success: true,

            count: transactions.length,

            data: transactions

        });

    } catch (error) {

        console.error(
            "Get stock transactions error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while retrieving stock history"

        });

    }

};


// ========================================
// GET PRODUCT STOCK HISTORY
// ========================================

const getProductStockHistoryController =
    async (req, res) => {

        try {

            const { productId } =
                req.params;


            // ========================================
            // VALIDATE PRODUCT ID
            // ========================================

            if (
                !Number.isInteger(
                    Number(productId)
                ) ||
                Number(productId) <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid product ID"

                });

            }


            // ========================================
            // GET TRANSACTIONS
            // ========================================

            const transactions =
                await getTransactionsByProductId(
                    Number(productId)
                );


            return res.status(200).json({

                success: true,

                count: transactions.length,

                data: transactions

            });

        } catch (error) {

            console.error(
                "Get product stock history error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Server error while retrieving product stock history"

            });

        }

    };


// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {

    createStockTransactionController,

    getStockTransactionsController,

    getProductStockHistoryController

};