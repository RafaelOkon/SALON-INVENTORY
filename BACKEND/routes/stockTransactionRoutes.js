const express = require("express");

const protect =
    require("../middleware/authMiddleware");

const {
    getStockTransactionsController,
    getProductStockHistoryController
} = require("../controllers/stockTransactionController");


const router = express.Router();


// ========================================
// GET ALL STOCK HISTORY
// GET /api/stock-transactions
// ========================================

router.get(
    "/",
    protect,
    getStockTransactionsController
);


// ========================================
// GET PRODUCT STOCK HISTORY
// GET /api/stock-transactions/product/:productId
// ========================================

router.get(
    "/product/:productId",
    protect,
    getProductStockHistoryController
);


module.exports = router;