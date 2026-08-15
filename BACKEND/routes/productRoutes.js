const express = require("express");

const protect =
    require("../middleware/authMiddleware");

const {
    createProductController,
    getProductsController,
    getProductController,
    updateProductController,
    deleteProductController
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
    createProductController
);


// ========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ========================================

router.put(
    "/:id",
    protect,
    updateProductController
);


// ========================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ========================================

router.delete(
    "/:id",
    protect,
    deleteProductController
);


module.exports = router;