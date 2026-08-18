const {
    getAllStockTransactions,
    getTransactionsByProductId
} = require("../models/StockTransaction");


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


module.exports = {

    getStockTransactionsController,

    getProductStockHistoryController

};

