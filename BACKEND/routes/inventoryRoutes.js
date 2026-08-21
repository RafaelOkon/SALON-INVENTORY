const express = require("express");

const protect =
    require("../middleware/authMiddleware");

    const authorizeRoles =
    require("../middleware/roleMiddleware");

const {
    createInventoryController,
    getInventoryController,
    getInventoryByIdController,
    getProductInventoryController,
    updateInventoryController,
    stockInController,
    stockOutController,
    deleteInventoryController
} = require("../controllers/inventoryController");


const router = express.Router();


// ========================================
// GET ALL INVENTORY
// GET /api/inventory
// ========================================

router.get(
    "/",
    protect,
    getInventoryController
);


// ========================================
// GET INVENTORY BY PRODUCT
// GET /api/inventory/product/:productId
// ========================================

router.get(
    "/product/:productId",
    protect,
    getProductInventoryController
);


// ========================================
// GET INVENTORY BY ID
// GET /api/inventory/:id
// ========================================

router.get(
    "/:id",
    protect,
    getInventoryByIdController
);


// ========================================
// CREATE INVENTORY
// POST /api/inventory
// ========================================

router.post(
    "/stock-in/:productId",
    protect,
    authorizeRoles("ADMIN", "STAFF"),
    stockInController
);

router.post(
    "/stock-out/:productId",
    protect,
    authorizeRoles("ADMIN", "STAFF"),
    stockOutController
);


// ========================================
// UPDATE INVENTORY
// PUT /api/inventory/:id
// ========================================

router.put(
    "/:id",
    protect,
    updateInventoryController
);


// ========================================
// STOCK IN
// POST /api/inventory/stock-in/:productId
// ========================================

router.post(
    "/stock-in/:productId",
    protect,
    stockInController
);


// ========================================
// STOCK OUT
// POST /api/inventory/stock-out/:productId
// ========================================

router.post(
    "/stock-out/:productId",
    protect,
    stockOutController
);


// ========================================
// DELETE INVENTORY
// DELETE /api/inventory/:id
// ========================================

router.delete(
    "/:id",
    protect,
    deleteInventoryController
);


module.exports = router;

