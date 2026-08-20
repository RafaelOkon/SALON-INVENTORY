const express = require("express");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const protect =
    require("../middleware/authMiddleware");

const {
    createProductController,
    getProductsController,
    getProductController,
    updateProductController,
    deleteProductController,
    searchProductsController
} = require("../controllers/productController");


const router = express.Router();


// ========================================
// GET ALL PRODUCTS
// GET /api/products
// ========================================

router.get(
    "/",
    protect,
    getProductsController
);

// ========================================
// SEARCH AND FILTER PRODUCTS
// GET /api/products/search
// ========================================

router.get(
    "/search",
    protect,
    searchProductsController
);

// ========================================
// GET PRODUCT BY ID
// GET /api/products/:id
// ========================================

router.get(
    "/:id",
    protect,
    getProductController
);


// ========================================
// CREATE PRODUCT
// POST /api/products
// ========================================

router.post(
    "/",
    protect,
    authorizeRoles("ADMIN"),
    createProductController
);


// ========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ========================================
router.put(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    updateProductController
);


// ========================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ========================================

router.delete(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    deleteProductController
);

module.exports = router;

