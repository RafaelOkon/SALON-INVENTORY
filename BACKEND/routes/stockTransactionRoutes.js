const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createStockTransactionController,
    getStockTransactionsController,
    getProductStockHistoryController
} = require("../controllers/stockTransactionController");


const router = express.Router();


// ========================================
// CREATE STOCK TRANSACTION
// ========================================

router.post(
    "/",
    protect,
    createStockTransactionController
);


// ========================================
// GET ALL STOCK TRANSACTIONS
// ========================================

router.get(
    "/",
    protect,
    getStockTransactionsController
);


// ========================================
// GET PRODUCT STOCK HISTORY
// ========================================

router.get(
    "/product/:productId",
    protect,
    getProductStockHistoryController
);


module.exports = router;