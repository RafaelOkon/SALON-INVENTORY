const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../models/Category");


// ========================================
// CREATE CATEGORY
// ========================================

const createCategoryController = async (req, res) => {

    try {

        const {
            name,
            description
        } = req.body;


        // Validate category name

        if (!name || name.trim() === "") {

            return res.status(400).json({

                success: false,

                message:
                    "Category name is required"

            });

        }


        // Clean input

        const categoryName =
            name.trim();

        const categoryDescription =
            description
                ? description.trim()
                : null;


        // Create category

        const categoryId =
            await createCategory({

                name: categoryName,

                description:
                    categoryDescription

            });


        return res.status(201).json({

            success: true,

            message:
                "Category created successfully",

            data: {

                categoryId

            }

        });

    } catch (error) {

        console.error(
            "Create category error:",
            error
        );


        // Duplicate category name

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(409).json({

                success: false,

                message:
                    "A category with this name already exists"

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Server error while creating category"

        });

    }

};


// ========================================
// GET ALL CATEGORIES
// ========================================

const getCategoriesController = async (
    req,
    res
) => {

    try {

        const categories =
            await getAllCategories();


        return res.status(200).json({

            success: true,

            count: categories.length,

            data: categories

        });

    } catch (error) {

        console.error(
            "Get categories error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while retrieving categories"

        });

    }

};


// ========================================
// GET CATEGORY BY ID
// ========================================

const getCategoryController = async (
    req,
    res
) => {

    try {

        const { id } = req.params;


        // Validate ID

        if (
            !Number.isInteger(
                Number(id)
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid category ID"

            });

        }


        const category =
            await getCategoryById(id);


        // Category does not exist

        if (!category) {

            return res.status(404).json({

                success: false,

                message:
                    "Category not found"

            });

        }


        return res.status(200).json({

            success: true,

            data: category

        });

    } catch (error) {

        console.error(
            "Get category error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while retrieving category"

        });

    }

};


// ========================================
// UPDATE CATEGORY
// ========================================

const updateCategoryController = async (
    req,
    res
) => {

    try {

        const { id } = req.params;


        // Validate ID

        if (
            !Number.isInteger(
                Number(id)
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid category ID"

            });

        }


        const {
            name,
            description
        } = req.body;


        // Validate category name

        if (!name || name.trim() === "") {

            return res.status(400).json({

                success: false,

                message:
                    "Category name is required"

            });

        }


        // Check if category exists

        const existingCategory =
            await getCategoryById(id);


        if (!existingCategory) {

            return res.status(404).json({

                success: false,

                message:
                    "Category not found"

            });

        }


        const affectedRows =
            await updateCategory(

                id,

                {

                    name:
                        name.trim(),

                    description:
                        description
                            ? description.trim()
                            : null

                }

            );


        if (affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Category not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Category updated successfully"

        });

    } catch (error) {

        console.error(
            "Update category error:",
            error
        );


        // Duplicate category name

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(409).json({

                success: false,

                message:
                    "A category with this name already exists"

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Server error while updating category"

        });

    }

};


// ========================================
// DELETE CATEGORY
// ========================================

const deleteCategoryController = async (
    req,
    res
) => {

    try {

        const { id } = req.params;


        // Validate ID

        if (
            !Number.isInteger(
                Number(id)
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid category ID"

            });

        }


        // Check if category exists

        const existingCategory =
            await getCategoryById(id);


        if (!existingCategory) {

            return res.status(404).json({

                success: false,

                message:
                    "Category not found"

            });

        }


        // Prevent deleting categories
        // that contain products

        if (
            Number(
                existingCategory.product_count
            ) > 0
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Category cannot be deleted because it contains products"

            });

        }


        const affectedRows =
            await deleteCategory(id);


        if (affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Category not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Category deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete category error:",
            error
        );


        // Foreign key protection

        if (
            error.code ===
            "ER_ROW_IS_REFERENCED_2"
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Category cannot be deleted because products are assigned to it"

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Server error while deleting category"

        });

    }

};


// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {

    createCategoryController,

    getCategoriesController,

    getCategoryController,

    updateCategoryController,

    deleteCategoryController

};