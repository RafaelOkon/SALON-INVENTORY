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

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();


        // ========================================
        // GET CURRENT PRODUCT STOCK
        // ========================================

        const [products] = await connection.query(

            `
            SELECT
                id,
                quantity

            FROM products

            WHERE id = ?

            FOR UPDATE
            `,

            [product_id]

        );


        if (products.length === 0) {

            throw new Error("Product not found");

        }


        const currentQuantity =
            Number(products[0].quantity);

        let newQuantity;


        // ========================================
        // CALCULATE NEW STOCK
        // ========================================

        if (transaction_type === "STOCK_IN") {

            newQuantity =
                currentQuantity + Number(quantity);

        } else if (transaction_type === "STOCK_OUT") {

            newQuantity =
                currentQuantity - Number(quantity);


            // Prevent negative stock
            if (newQuantity < 0) {

                throw new Error(
                    "Insufficient stock"
                );

            }

        } else {

            throw new Error(
                "Invalid transaction type"
            );

        }


        // ========================================
        // UPDATE PRODUCT QUANTITY
        // ========================================

        await connection.query(

            `
            UPDATE products

            SET
                quantity = ?,
                updated_at = CURRENT_TIMESTAMP

            WHERE id = ?
            `,

            [
                newQuantity,
                product_id
            ]

        );


        // ========================================
        // RECORD TRANSACTION
        // ========================================

        const [result] =
            await connection.query(

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


        await connection.commit();


        return result.insertId;


    } catch (error) {

        await connection.rollback();

        throw error;


    } finally {

        connection.release();

    }

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

        INNER JOIN products p
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

