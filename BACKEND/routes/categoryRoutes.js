const express = require("express");

const protect =
    require("../middleware/authMiddleware");

const {
    createCategoryController,
    getCategoriesController,
    getCategoryController,
    updateCategoryController,
    deleteCategoryController
} = require("../controllers/categoryController");


const router = express.Router();


// ========================================
// GET ALL CATEGORIES
// GET /api/categories
// ========================================

router.get(
    "/",
    protect,
    getCategoriesController
);


// ========================================
// GET CATEGORY BY ID
// GET /api/categories/:id
// ========================================

router.get(
    "/:id",
    protect,
    getCategoryController
);


// ========================================
// CREATE CATEGORY
// POST /api/categories
// ========================================

router.post(
    "/",
    protect,
    createCategoryController
);


// ========================================
// UPDATE CATEGORY
// PUT /api/categories/:id
// ========================================

router.put(
    "/:id",
    protect,
    updateCategoryController
);


// ========================================
// DELETE CATEGORY
// DELETE /api/categories/:id
// ========================================

router.delete(
    "/:id",
    protect,
    deleteCategoryController
);


module.exports = router;