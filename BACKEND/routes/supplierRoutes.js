const express = require("express");

const protect =
    require("../middleware/authMiddleware");

const {
    createSupplierController,
    getSuppliersController,
    getSupplierController,
    updateSupplierController,
    deleteSupplierController
} = require("../controllers/supplierController");


const router = express.Router();


// ========================================
// GET ALL SUPPLIERS
// GET /api/suppliers
// ========================================

router.get(
    "/",
    protect,
    getSuppliersController
);


// ========================================
// GET SUPPLIER BY ID
// GET /api/suppliers/:id
// ========================================

router.get(
    "/:id",
    protect,
    getSupplierController
);


// ========================================
// CREATE SUPPLIER
// POST /api/suppliers
// ========================================

router.post(
    "/",
    protect,
    createSupplierController
);


// ========================================
// UPDATE SUPPLIER
// PUT /api/suppliers/:id
// ========================================

router.put(
    "/:id",
    protect,
    updateSupplierController
);


// ========================================
// DELETE SUPPLIER
// DELETE /api/suppliers/:id
// ========================================

router.delete(
    "/:id",
    protect,
    deleteSupplierController
);


module.exports = router;