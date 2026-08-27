const pool = require("../config/database");


// ========================================
// CREATE STOCK TRANSACTION
// ========================================

const createStockTransaction = async ({
    product_id,
    user_id,
    transaction_type,
    quantity,
    notes
}) => {

    const [result] = await pool.query(

        `
        INSERT INTO stock_transactions
        (
            product_id,
            user_id,
            transaction_type,
            quantity,
            notes
        )

        VALUES (?, ?, ?, ?, ?)
        `,

        [
            product_id,
            user_id,
            transaction_type,
            quantity,
            notes || null
        ]

    );


    return result.insertId;

};


// ========================================
// GET ALL STOCK TRANSACTIONS
// ========================================

const getAllStockTransactions = async () => {

    const [rows] = await pool.query(

        `
        SELECT

            st.id,

            st.product_id,

            p.name AS product_name,

            p.sku,

            st.user_id,

            u.full_name AS user_name,

            st.transaction_type,

            st.quantity,

            st.notes,

            st.created_at

        FROM stock_transactions st

        INNER JOIN products pq
            ON st.product_id = p.id

        INNER JOIN users u
            ON st.user_id = u.id

        ORDER BY st.created_at DESC
        `

    );


    return rows;

};


// ========================================
// GET TRANSACTIONS BY PRODUCT
// ========================================

const getTransactionsByProductId = async (
    productId
) => {

    const [rows] = await pool.query(

        `
        SELECT

            st.id,

            st.product_id,

            p.name AS product_name,

            p.sku,

            st.user_id,

            u.full_name AS user_name,

            st.transaction_type,

            st.quantity,

            st.notes,

            st.created_at

        FROM stock_transactions st

        INNER JOIN products p
            ON st.product_id = p.id

        INNER JOIN users u
            ON st.user_id = u.id

        WHERE st.product_id = ?

        ORDER BY st.created_at DESC
        `,

        [productId]

    );


    return rows;

};


// ========================================
// EXPORT
// ========================================

module.exports = {

    createStockTransaction,

    getAllStockTransactions,

    getTransactionsByProductId

};

