const {
    createInventory,
    getAllInventory,
    getInventoryById,
    getInventoryByProductId,
    updateInventory,
    updateStockQuantity,
    deleteInventory
} = require("../models/Inventory");

const {
    createStockTransaction
} = require("../models/StockTransaction");


// ========================================
// CREATE INVENTORY
// ========================================

const createInventoryController = async (req, res) => {

    try {

        const {
            product_id,
            quantity,
            reorder_level
        } = req.body;


        // Validate product ID

        if (
            !product_id ||
            !Number.isInteger(Number(product_id))
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "A valid product ID is required"

            });

        }


        // Validate quantity

        if (
            quantity === undefined ||
            quantity === null ||
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Quantity must be a non-negative integer"

            });

        }


        // Validate reorder level

        if (
            reorder_level === undefined ||
            reorder_level === null ||
            !Number.isInteger(
                Number(reorder_level)
            ) ||
            Number(reorder_level) < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Reorder level must be a non-negative integer"

            });

        }


        // Check whether inventory
        // already exists for product

        const existingInventory =
            await getInventoryByProductId(
                product_id
            );


        if (existingInventory) {

            return res.status(409).json({

                success: false,

                message:
                    "Inventory already exists for this product"

            });

        }


        // Create inventory

        const inventoryId =
            await createInventory({

                product_id:
                    Number(product_id),

                quantity:
                    Number(quantity),

                reorder_level:
                    Number(reorder_level)

            });


        return res.status(201).json({

            success: true,

            message:
                "Inventory created successfully",

            data: {

                inventoryId

            }

        });

    } catch (error) {

        console.error(
            "Create inventory error:",
            error
        );


        // Product does not exist

        if (
            error.code ===
            "ER_NO_REFERENCED_ROW_2"
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });

        }


        // Duplicate product inventory

        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Inventory already exists for this product"

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Server error while creating inventory"

        });

    }

};


// ========================================
// GET ALL INVENTORY
// ========================================

const getInventoryController = async (
    req,
    res
) => {

    try {

        const inventory =
            await getAllInventory();


        return res.status(200).json({

            success: true,

            count: inventory.length,

            data: inventory

        });

    } catch (error) {

        console.error(
            "Get inventory error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while retrieving inventory"

        });

    }

};


// ========================================
// GET INVENTORY BY ID
// ========================================

const getInventoryByIdController = async (
    req,
    res
) => {

    try {

        const { id } = req.params;


        // Validate ID

        if (
            !Number.isInteger(Number(id))
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid inventory ID"

            });

        }


        const inventory =
            await getInventoryById(id);


        if (!inventory) {

            return res.status(404).json({

                success: false,

                message:
                    "Inventory record not found"

            });

        }


        return res.status(200).json({

            success: true,

            data: inventory

        });

    } catch (error) {

        console.error(
            "Get inventory by ID error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while retrieving inventory"

        });

    }

};


// ========================================
// GET INVENTORY BY PRODUCT
// ========================================

const getProductInventoryController = async (
    req,
    res
) => {

    try {

        const { productId } = req.params;


        // Validate product ID

        if (
            !Number.isInteger(
                Number(productId)
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid product ID"

            });

        }


        const inventory =
            await getInventoryByProductId(
                productId
            );


        if (!inventory) {

            return res.status(404).json({

                success: false,

                message:
                    "Inventory record not found for this product"

            });

        }


        return res.status(200).json({

            success: true,

            data: inventory

        });

    } catch (error) {

        console.error(
            "Get product inventory error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while retrieving product inventory"

        });

    }

};


// ========================================
// UPDATE INVENTORY
// ========================================

const updateInventoryController = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const {
            quantity,
            reorder_level
        } = req.body;


        // Validate ID

        if (
            !Number.isInteger(Number(id))
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid inventory ID"

            });

        }


        // Validate quantity

        if (
            quantity === undefined ||
            quantity === null ||
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Quantity must be a non-negative integer"

            });

        }


        // Validate reorder level

        if (
            reorder_level === undefined ||
            reorder_level === null ||
            !Number.isInteger(
                Number(reorder_level)
            ) ||
            Number(reorder_level) < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Reorder level must be a non-negative integer"

            });

        }


        // Check inventory exists

        const existingInventory =
            await getInventoryById(id);


        if (!existingInventory) {

            return res.status(404).json({

                success: false,

                message:
                    "Inventory record not found"

            });

        }


        const affectedRows =
            await updateInventory(

                id,

                {

                    quantity:
                        Number(quantity),

                    reorder_level:
                        Number(reorder_level)

                }

            );


        if (affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Inventory record not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Inventory updated successfully"

        });

    } catch (error) {

        console.error(
            "Update inventory error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while updating inventory"

        });

    }

};


//=========================================
// STOCK IN
//=========================================

const stockInController = async (
    req,
    res
) => {

    try {

        const { productId } = req.params;

        const {
            quantity,
            notes
        } = req.body;


        // ========================================
        // VALIDATE PRODUCT ID
        // ========================================

        if (
            !Number.isInteger(
                Number(productId)
            ) ||
            Number(productId) <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid product ID"

            });

        }


        // ========================================
        // VALIDATE QUANTITY
        // ========================================

        if (
            quantity === undefined ||
            quantity === null ||
            !Number.isInteger(
                Number(quantity)
            ) ||
            Number(quantity) <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Stock-in quantity must be greater than zero"

            });

        }


        // ========================================
        // GET USER FROM JWT
        // ========================================

        const userId =
            req.user.id;


        // ========================================
        // CHECK INVENTORY
        // ========================================

        const inventory =
            await getInventoryByProductId(
                productId
            );


        if (!inventory) {

            return res.status(404).json({

                success: false,

                message:
                    "Inventory record not found for this product"

            });

        }


        // ========================================
        // UPDATE STOCK
        // ========================================

        const affectedRows =
            await updateStockQuantity(

                Number(productId),

                Number(quantity)

            );


        if (affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Stock could not be updated"

            });

        }


        // ========================================
        // RECORD TRANSACTION
        // ========================================

        await createStockTransaction({

            product_id:
                Number(productId),

            user_id:
                Number(userId),

            transaction_type:
                "STOCK_IN",

            quantity:
                Number(quantity),

            notes:
                notes || "Stock added"

        });


        // ========================================
        // GET UPDATED INVENTORY
        // ========================================

        const updatedInventory =
            await getInventoryByProductId(
                productId
            );


        return res.status(200).json({

            success: true,

            message:
                "Stock added successfully",

            data: {

                productId:
                    Number(productId),

                quantityAdded:
                    Number(quantity),

                currentQuantity:
                    updatedInventory.quantity

            }

        });

    } catch (error) {

        console.error(
            "Stock in error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while adding stock"

        });

    }

};

//=========================================
// STOCK OUT
//=========================================

const stockOutController = async (
    req,
    res
) => {

    try {

        const { productId } = req.params;

        const {
            quantity,
            notes
        } = req.body;


        // ========================================
        // VALIDATE PRODUCT ID
        // ========================================

        if (
            !Number.isInteger(
                Number(productId)
            ) ||
            Number(productId) <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid product ID"

            });

        }


        // ========================================
        // VALIDATE QUANTITY
        // ========================================

        if (
            quantity === undefined ||
            quantity === null ||
            !Number.isInteger(
                Number(quantity)
            ) ||
            Number(quantity) <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Stock-out quantity must be greater than zero"

            });

        }


        // ========================================
        // GET USER FROM JWT
        // ========================================

        const userId =
            req.user.id;


        // ========================================
        // GET CURRENT INVENTORY
        // ========================================

        const inventory =
            await getInventoryByProductId(
                productId
            );


        if (!inventory) {

            return res.status(404).json({

                success: false,

                message:
                    "Inventory record not found for this product"

            });

        }


        // ========================================
        // CHECK AVAILABLE STOCK
        // ========================================

        const requestedQuantity =
            Number(quantity);

        const currentQuantity =
            Number(inventory.quantity);


        if (
            requestedQuantity >
            currentQuantity
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Insufficient stock",

                data: {

                    available:
                        currentQuantity,

                    requested:
                        requestedQuantity

                }

            });

        }


        // ========================================
        // REMOVE STOCK
        // ========================================

        const affectedRows =
            await updateStockQuantity(

                Number(productId),

                -requestedQuantity

            );


        if (affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Stock could not be updated"

            });

        }


        // ========================================
        // RECORD TRANSACTION
        // ========================================

        await createStockTransaction({

            product_id:
                Number(productId),

            user_id:
                Number(userId),

            transaction_type:
                "STOCK_OUT",

            quantity:
                requestedQuantity,

            notes:
                notes || "Stock removed"

        });


        // ========================================
        // GET UPDATED INVENTORY
        // ========================================

        const updatedInventory =
            await getInventoryByProductId(
                productId
            );


        return res.status(200).json({

            success: true,

            message:
                "Stock removed successfully",

            data: {

                productId:
                    Number(productId),

                quantityRemoved:
                    requestedQuantity,

                currentQuantity:
                    updatedInventory.quantity

            }

        });

    } catch (error) {

        console.error(
            "Stock out error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while removing stock"

        });

    }

};


// ========================================
// DELETE INVENTORY
// ========================================

const deleteInventoryController = async (
    req,
    res
) => {

    try {

        const { id } = req.params;


        // Validate ID

        if (
            !Number.isInteger(Number(id))
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid inventory ID"

            });

        }


        // Check inventory exists

        const inventory =
            await getInventoryById(id);


        if (!inventory) {

            return res.status(404).json({

                success: false,

                message:
                    "Inventory record not found"

            });

        }


        const affectedRows =
            await deleteInventory(id);


        if (affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Inventory record not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Inventory deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete inventory error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while deleting inventory"

        });

    }

};


// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {

    createInventoryController,

    getInventoryController,

    getInventoryByIdController,

    getProductInventoryController,

    updateInventoryController,

    stockInController,

    stockOutController,

    deleteInventoryController

};


