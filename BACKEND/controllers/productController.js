const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts
} = require("../models/Product");


// ========================================
// CREATE PRODUCT
// ========================================

const createProductController = async (req, res) => {

    try {

        const {
            name,
            sku,
            description,
            categoryId,
            supplierId,
            price,
            quantity,
            minimumStockLevel
        } = req.body;


// ========================================
// VALIDATE PRODUCT DATA
// ========================================

if (!name || name.trim() === "") {

    return res.status(400).json({
        success: false,
        message: "Product name is required"
    });

}

if (!sku || sku.trim() === "") {

    return res.status(400).json({
        success: false,
        message: "SKU is required"
    });

}

if (
    !Number.isInteger(Number(categoryId)) ||
    Number(categoryId) <= 0
) {

    return res.status(400).json({
        success: false,
        message: "Valid category ID is required"
    });

}

if (
    supplierId !== undefined &&
    supplierId !== null &&
    supplierId !== "" &&
    (
        !Number.isInteger(Number(supplierId)) ||
        Number(supplierId) <= 0
    )
) {

    return res.status(400).json({
        success: false,
        message: "Invalid supplier ID"
    });

}

if (
    price === undefined ||
    price === null ||
    price === "" ||
    !Number.isFinite(Number(price)) ||
    Number(price) < 0
) {

    return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number"
    });

}

if (
    quantity === undefined ||
    quantity === null ||
    quantity === "" ||
    !Number.isInteger(Number(quantity)) ||
    Number(quantity) < 0
) {

    return res.status(400).json({
        success: false,
        message: "Quantity must be a valid non-negative integer"
    });

}

if (
    minimumStockLevel === undefined ||
    minimumStockLevel === null ||
    minimumStockLevel === "" ||
    !Number.isInteger(Number(minimumStockLevel)) ||
    Number(minimumStockLevel) < 0
) {

    return res.status(400).json({
        success: false,
        message: "Minimum stock level must be a valid non-negative integer"
    });

}


        const productId =
            await createProduct({

                name,
                sku,
                description:
                    description || null,

                categoryId,

                supplierId:
                    supplierId || null,

                price,

                quantity,

                minimumStockLevel

            });


        return res.status(201).json({

            success: true,

            message:
                "Product created successfully",

            data: {

                productId

            }

        });

    } catch (error) {

        console.error(
            "Create product error:",
            error
        );


        // Duplicate SKU

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(409).json({

                success: false,

                message:
                    "A product with this SKU already exists"

            });

        }


        // Foreign key error

        if (error.code === "ER_NO_REFERENCED_ROW_2") {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid category or supplier"

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Server error while creating product"

        });

    }

};


// ========================================
// GET ALL PRODUCTS
// ========================================

const getProductsController = async (req, res) => {

    try {

        const products =
            await getAllProducts();


        return res.status(200).json({

            success: true,

            count: products.length,

            data: products

        });

    } catch (error) {

        console.error(
            "Get products error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while retrieving products"

        });

    }

};


// ========================================
// GET PRODUCT BY ID
// ========================================

const getProductController = async (req, res) => {

    try {

        const { id } = req.params;


        // Validate ID

        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid product ID"

            });

        }


        const product =
            await getProductById(id);


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });

        }


        return res.status(200).json({

            success: true,

            data: product

        });

    } catch (error) {

        console.error(
            "Get product error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while retrieving product"

        });

    }

};


// ========================================
// UPDATE PRODUCT
// ========================================

const updateProductController = async (req, res) => {

    try {

        const { id } = req.params;


        // Validate ID

        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid product ID"

            });

        }


        const {
            name,
            sku,
            description,
            categoryId,
            supplierId,
            price,
            quantity,
            minimumStockLevel
        } = req.body;


// ========================================
// VALIDATE PRODUCT DATA
// ========================================

if (!name || name.trim() === "") {

    return res.status(400).json({
        success: false,
        message: "Product name is required"
    });

}

if (!sku || sku.trim() === "") {

    return res.status(400).json({
        success: false,
        message: "SKU is required"
    });

}

if (
    !Number.isInteger(Number(categoryId)) ||
    Number(categoryId) <= 0
) {

    return res.status(400).json({
        success: false,
        message: "Valid category ID is required"
    });

}

if (
    supplierId !== undefined &&
    supplierId !== null &&
    supplierId !== "" &&
    (
        !Number.isInteger(Number(supplierId)) ||
        Number(supplierId) <= 0
    )
) {

    return res.status(400).json({
        success: false,
        message: "Invalid supplier ID"
    });

}

if (
    price === undefined ||
    price === null ||
    price === "" ||
    !Number.isFinite(Number(price)) ||
    Number(price) < 0
) {

    return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number"
    });

}

if (
    quantity === undefined ||
    quantity === null ||
    quantity === "" ||
    !Number.isInteger(Number(quantity)) ||
    Number(quantity) < 0
) {

    return res.status(400).json({
        success: false,
        message: "Quantity must be a valid non-negative integer"
    });

}

if (
    minimumStockLevel === undefined ||
    minimumStockLevel === null ||
    minimumStockLevel === "" ||
    !Number.isInteger(Number(minimumStockLevel)) ||
    Number(minimumStockLevel) < 0
) {

    return res.status(400).json({
        success: false,
        message: "Minimum stock level must be a valid non-negative integer"
    });

}


        // Check if product exists

        const existingProduct =
            await getProductById(id);


        if (!existingProduct) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });

        }


        const affectedRows =
            await updateProduct(

                id,

                {

                    name,

                    sku,

                    description:
                        description || null,

                    categoryId,

                    supplierId:
                        supplierId || null,

                    price,

                    quantity,

                    minimumStockLevel

                }

            );


        if (affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Product updated successfully"

        });

    } catch (error) {

        console.error(
            "Update product error:",
            error
        );


        if (error.code === "ER_DUP_ENTRY") {

            return res.status(409).json({

                success: false,

                message:
                    "A product with this SKU already exists"

            });

        }


        if (error.code === "ER_NO_REFERENCED_ROW_2") {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid category or supplier"

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Server error while updating product"

        });

    }

};


// ========================================
// DELETE PRODUCT
// ========================================

const deleteProductController = async (req, res) => {

    try {

        const { id } = req.params;


        // Validate ID

        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid product ID"

            });

        }


        // Check if product exists

        const existingProduct =
            await getProductById(id);


        if (!existingProduct) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });

        }


        const affectedRows =
            await deleteProduct(id);


        if (affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Product deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );


        // Product may be referenced by another table

        if (
            error.code ===
            "ER_ROW_IS_REFERENCED_2"
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Product cannot be deleted because it is being used by another record"

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Server error while deleting product"

        });

    }

};

// ========================================
// SEARCH AND FILTER PRODUCTS
// ========================================

const searchProductsController = async (
    req,
    res
) => {

    try {

        const {
            search,
            category,
            supplier
        } = req.query;


        // ========================================
        // VALIDATE CATEGORY
        // ========================================

        if (
            category !== undefined &&
            category !== "" &&
            (
                !Number.isInteger(
                    Number(category)
                ) ||
                Number(category) <= 0
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid category ID"

            });

        }


        // ========================================
        // VALIDATE SUPPLIER
        // ========================================

        if (
            supplier !== undefined &&
            supplier !== "" &&
            (
                !Number.isInteger(
                    Number(supplier)
                ) ||
                Number(supplier) <= 0
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid supplier ID"

            });

        }


        // ========================================
        // SEARCH PRODUCTS
        // ========================================

        const products = await searchProducts({

            search:
                search
                    ? search.trim()
                    : "",

            category:
                category
                    ? Number(category)
                    : "",

            supplier:
                supplier
                    ? Number(supplier)
                    : ""

        });


        return res.status(200).json({

            success: true,

            count: products.length,

            data: products

        });

    } catch (error) {

        console.error(
            "Search products error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while searching products"

        });

    }

};

// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {

    createProductController,

    getProductsController,

    getProductController,

    updateProductController,

    deleteProductController,
    
    searchProductsController

};