const {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} = require("../models/Supplier");


// ========================================
// CREATE SUPPLIER
// ========================================

const createSupplierController = async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            address
        } = req.body;


        // Validate supplier name

        if (!name || name.trim() === "") {

            return res.status(400).json({

                success: false,

                message:
                    "Supplier name is required"

            });

        }


        // Clean input

        const supplierName =
            name.trim();

        const supplierEmail =
            email
                ? email.trim()
                : null;

        const supplierPhone =
            phone
                ? phone.trim()
                : null;

        const supplierAddress =
            address
                ? address.trim()
                : null;


        // Basic email validation

        if (
        supplierEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierEmail)
    ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide a valid email address"

            });

        }


        // Create supplier

        const supplierId =
            await createSupplier({

                name:
                    supplierName,

                email:
                    supplierEmail,

                phone:
                    supplierPhone,

                address:
                    supplierAddress

            });


        return res.status(201).json({

            success: true,

            message:
                "Supplier created successfully",

            data: {

                supplierId

            }

        });

    } catch (error) {

        console.error(
            "Create supplier error:",
            error
        );


        if (error.code === "ER_DUP_ENTRY") {

            return res.status(409).json({

                success: false,

                message:
                    "A supplier with this information already exists"

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Server error while creating supplier"

        });

    }

};


// ========================================
// GET ALL SUPPLIERS
// ========================================

const getSuppliersController = async (
    req,
    res
) => {

    try {

        const suppliers =
            await getAllSuppliers();


        return res.status(200).json({

            success: true,

            count: suppliers.length,

            data: suppliers

        });

    } catch (error) {

        console.error(
            "Get suppliers error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while retrieving suppliers"

        });

    }

};


// ========================================
// GET SUPPLIER BY ID
// ========================================

const getSupplierController = async (
    req,
    res
) => {

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
                    "Invalid supplier ID"

            });

        }


        const supplier =
            await getSupplierById(id);


        if (!supplier) {

            return res.status(404).json({

                success: false,

                message:
                    "Supplier not found"

            });

        }


        return res.status(200).json({

            success: true,

            data: supplier

        });

    } catch (error) {

        console.error(
            "Get supplier error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while retrieving supplier"

        });

    }

};


// ========================================
// UPDATE SUPPLIER
// ========================================

const updateSupplierController = async (
    req,
    res
) => {

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
                    "Invalid supplier ID"

            });

        }


        const {
            name,
            email,
            phone,
            address
        } = req.body;


        // Validate supplier name

        if (!name || name.trim() === "") {

            return res.status(400).json({

                success: false,

                message:
                    "Supplier name is required"

            });

        }


        // Validate email

        const supplierEmail =
            email
                ? email.trim()
                : null;


        if (
            supplierEmail &&
            ! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierEmail)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide a valid email address"

            });

        }


        // Check supplier exists

        const existingSupplier =
            await getSupplierById(id);


        if (!existingSupplier) {

            return res.status(404).json({

                success: false,

                message:
                    "Supplier not found"

            });

        }


        const affectedRows =
            await updateSupplier(

                id,

                {

                    name:
                        name.trim(),

                    email:
                        supplierEmail,

                    phone:
                        phone
                            ? phone.trim()
                            : null,

                    address:
                        address
                            ? address.trim()
                            : null

                }

            );


        if (affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Supplier not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Supplier updated successfully"

        });

    } catch (error) {

        console.error(
            "Update supplier error:",
            error
        );


        if (error.code === "ER_DUP_ENTRY") {

            return res.status(409).json({

                success: false,

                message:
                    "A supplier with this information already exists"

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Server error while updating supplier"

        });

    }

};


// ========================================
// DELETE SUPPLIER
// ========================================

const deleteSupplierController = async (
    req,
    res
) => {

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
                    "Invalid supplier ID"

            });

        }


        // Check supplier exists

        const existingSupplier =
            await getSupplierById(id);


        if (!existingSupplier) {

            return res.status(404).json({

                success: false,

                message:
                    "Supplier not found"

            });

        }


        // Prevent deleting suppliers
        // that have products assigned

        if (
            Number(
                existingSupplier.product_count
            ) > 0
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Supplier cannot be deleted because products are assigned to this supplier"

            });

        }


        const affectedRows =
            await deleteSupplier(id);


        if (affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Supplier not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Supplier deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete supplier error:",
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
                    "Supplier cannot be deleted because products are assigned to this supplier"

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Server error while deleting supplier"

        });

    }

};


// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {

    createSupplierController,

    getSuppliersController,

    getSupplierController,

    updateSupplierController,

    deleteSupplierController

};

