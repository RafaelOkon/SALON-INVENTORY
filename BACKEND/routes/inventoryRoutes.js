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
    deleteInventoryController,
    getLowStockController,
    getOutOfStockController
} = require("../controllers/inventoryController");


const router = express.Router();


// ========================================
// GET LOW STOCK INVENTORY
// GET /api/inventory/low-stock
// ========================================

router.get(
    "/low-stock",
    protect,
    getLowStockController
);


// ========================================
// GET OUT OF STOCK INVENTORY
// GET /api/inventory/out-of-stock
// ========================================

router.get(
    "/out-of-stock",
    protect,
    getOutOfStockController
);

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
// CREATE INVENTORY
// POST /api/inventory
// ========================================

router.post(
    "/",
    protect,
    authorizeRoles("admin", "staff"),
    createInventoryController
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
    authorizeRoles("admin", "staff"),
    stockInController
);

router.post(
    "/stock-out/:productId",
    protect,
    authorizeRoles("admin", "staff"),
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
// DELETE INVENTORY
// DELETE /api/inventory/:id
// ========================================

router.delete(
    "/:id",
    protect,
    deleteInventoryController
);


module.exports = router;
