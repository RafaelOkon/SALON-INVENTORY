const pool = require("../config/database");


// ========================================
// CREATE INVENTORY RECORD
// ========================================

const createInventory = async (inventoryData) => {

    const {
        product_id,
        quantity,
        reorder_level
    } = inventoryData;


    const [result] = await pool.query(

        `
        INSERT INTO inventory
        (
            product_id,
            quantity,
            reorder_level
        )
        VALUES (?, ?, ?)
        `,

        [
            product_id,
            quantity,
            reorder_level
        ]

    );


    return result.insertId;

};


// ========================================
// GET ALL INVENTORY
// ========================================

const getAllInventory = async () => {

    const [rows] = await pool.query(

        `
        SELECT

            i.id,

            i.product_id,

            p.name AS product_name,

            p.sku,

            p.price,

            i.quantity,

            i.reorder_level,

            CASE

                WHEN i.quantity = 0
                    THEN 'OUT_OF_STOCK'

                WHEN i.quantity <= i.reorder_level
                    THEN 'LOW_STOCK'

                ELSE 'IN_STOCK'

            END AS stock_status,

            i.created_at,

            i.updated_at

        FROM inventory i

        INNER JOIN products p
            ON i.product_id = p.id

        ORDER BY i.id DESC
        `

    );


    return rows;

};


// ========================================
// GET INVENTORY BY ID
// ========================================

const getInventoryById = async (id) => {

    const [rows] = await pool.query(

        `
        SELECT

            i.id,

            i.product_id,

            p.name AS product_name,

            p.sku,

            p.price,

            i.quantity,

            i.reorder_level,

            CASE

                WHEN i.quantity = 0
                    THEN 'OUT_OF_STOCK'

                WHEN i.quantity <= i.reorder_level
                    THEN 'LOW_STOCK'

                ELSE 'IN_STOCK'

            END AS stock_status,

            i.created_at,

            i.updated_at

        FROM inventory i

        INNER JOIN products p
            ON i.product_id = p.id

        WHERE i.id = ?
        `,

        [id]

    );


    return rows[0];

};


// ========================================
// GET INVENTORY BY PRODUCT ID
// ========================================

const getInventoryByProductId = async (
    productId
) => {

    const [rows] = await pool.query(

        `
        SELECT

            i.id,

            i.product_id,

            p.name AS product_name,

            p.sku,

            p.price,

            i.quantity,

            i.reorder_level,

            CASE

                WHEN i.quantity = 0
                    THEN 'OUT_OF_STOCK'

                WHEN i.quantity <= i.reorder_level
                    THEN 'LOW_STOCK'

                ELSE 'IN_STOCK'

            END AS stock_status,

            i.created_at,

            i.updated_at

        FROM inventory i

        INNER JOIN products p
            ON i.product_id = p.id

        WHERE i.product_id = ?
        `,

        [productId]

    );


    return rows[0];

};


// ========================================
// UPDATE INVENTORY
// ========================================

const updateInventory = async (
    id,
    inventoryData
) => {

    const {
        quantity,
        reorder_level
    } = inventoryData;


    const [result] = await pool.query(

        `
        UPDATE inventory

        SET

            quantity = ?,

            reorder_level = ?

        WHERE id = ?
        `,

        [
            quantity,
            reorder_level,
            id
        ]

    );


    return result.affectedRows;

};


// ========================================
// UPDATE STOCK QUANTITY
// ========================================

const updateStockQuantity = async (
    productId,
    quantity
) => {

    const [result] = await pool.query(

        `
        UPDATE inventory

        SET quantity = quantity + ?

        WHERE product_id = ?
        `,

        [
            quantity,
            productId
        ]

    );


    return result.affectedRows;

};


// ========================================
// DELETE INVENTORY
// ========================================

const deleteInventory = async (id) => {

    const [result] = await pool.query(

        `
        DELETE FROM inventory

        WHERE id = ?
        `,

        [id]

    );


    return result.affectedRows;

};


// ========================================
// EXPORT FUNCTIONS
// ========================================

module.exports = {

    createInventory,

    getAllInventory,

    getInventoryById,

    getInventoryByProductId,

    updateInventory,

    updateStockQuantity,

    deleteInventory

};

