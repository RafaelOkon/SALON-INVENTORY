const pool = require("../config/database");


// ========================================
// CREATE PRODUCT
// ========================================

const createProduct = async (productData) => {

    const {
        name,
        sku,
        description,
        categoryId,
        supplierId,
        price,
        quantity,
        minimumStockLevel
    } = productData;


    const [result] = await pool.query(

        `
        INSERT INTO products
        (
            name,
            sku,
            description,
            category_id,
            supplier_id,
            price,
            quantity,
            minimum_stock_level
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,

        [
            name,
            sku,
            description,
            categoryId,
            supplierId,
            price,
            quantity,
            minimumStockLevel
        ]

    );


    return result.insertId;

};


// ========================================
// GET ALL PRODUCTS
// ========================================

const getAllProducts = async () => {

    const [rows] = await pool.query(

        `
        SELECT
            p.id,
            p.name,
            p.sku,
            p.description,
            p.category_id,
            c.name AS category_name,
            p.supplier_id,
            s.name AS supplier_name,
            p.price,
            p.quantity,
            p.minimum_stock_level,
            p.created_at,
            p.updated_at

        FROM products p

        INNER JOIN categories c
            ON p.category_id = c.id

        LEFT JOIN suppliers s
            ON p.supplier_id = s.id

        ORDER BY p.id DESC
        `

    );


    return rows;

};


// ========================================
// GET PRODUCT BY ID
// ========================================

const getProductById = async (id) => {

    const [rows] = await pool.query(

        `
        SELECT
            p.id,
            p.name,
            p.sku,
            p.description,
            p.category_id,
            c.name AS category_name,
            p.supplier_id,
            s.name AS supplier_name,
            p.price,
            p.quantity,
            p.minimum_stock_level,
            p.created_at,
            p.updated_at

        FROM products p

        INNER JOIN categories c
            ON p.category_id = c.id

        LEFT JOIN suppliers s
            ON p.supplier_id = s.id

        WHERE p.id = ?
        `,

        [id]

    );


    return rows[0];

};


// ========================================
// UPDATE PRODUCT
// ========================================

const updateProduct = async (
    id,
    productData
) => {

    const {
        name,
        sku,
        description,
        categoryId,
        supplierId,
        price,
        quantity,
        minimumStockLevel
    } = productData;


    const [result] = await pool.query(

        `
        UPDATE products

        SET
            name = ?,
            sku = ?,
            description = ?,
            category_id = ?,
            supplier_id = ?,
            price = ?,
            quantity = ?,
            minimum_stock_level = ?

        WHERE id = ?
        `,

        [
            name,
            sku,
            description,
            categoryId,
            supplierId,
            price,
            quantity,
            minimumStockLevel,
            id
        ]

    );


    return result.affectedRows;

};


// ========================================
// DELETE PRODUCT
// ========================================

const deleteProduct = async (id) => {

    const [result] = await pool.query(

        `
        DELETE FROM products
        WHERE id = ?
        `,

        [id]

    );


    return result.affectedRows;

};

// ========================================
// SEARCH AND FILTER PRODUCTS
// ========================================

const searchProducts = async (filters) => {

    const {
        search,
        category,
        supplier
    } = filters;


    let query = `
        SELECT

            p.id,

            p.name,

            p.sku,

            p.description,

            p.price,

            p.quantity,

            p.minimum_stock_level,
            
            p.category_id,

            c.name AS category_name,

            p.supplier_id,

            s.name AS supplier_name,

            p.created_at,

            p.updated_at

        FROM products p

        LEFT JOIN categories c
            ON p.category_id = c.id

        LEFT JOIN suppliers s
            ON p.supplier_id = s.id

        WHERE 1 = 1
    `;


    const values = [];


    // ========================================
    // SEARCH BY PRODUCT NAME OR SKU
    // ========================================

    if (search && search.trim() !== "") {

        query += `
            AND (
                p.name LIKE ?
                OR p.sku LIKE ?
                OR p.description LIKE ?
            )
        `;


        const searchValue =
            `%${search.trim()}%`;


        values.push(
            searchValue,
            searchValue,
            searchValue
        );

    }


    // ========================================
    // FILTER BY CATEGORY
    // ========================================

    if (
        category !== undefined &&
        category !== null &&
        category !== ""
    ) {

        query += `
            AND p.category_id = ?
        `;


        values.push(
            Number(category)
        );

    }


    // ========================================
    // FILTER BY SUPPLIER
    // ========================================

    if (
        supplier !== undefined &&
        supplier !== null &&
        supplier !== ""
    ) {

        query += `
            AND p.supplier_id = ?
        `;


        values.push(
            Number(supplier)
        );

    }


    // ========================================
    // ORDER RESULTS
    // ========================================

    query += `
        ORDER BY p.created_at DESC
    `;


    const [rows] =
        await pool.query(
            query,
            values
        );


    return rows;

};


// ========================================
// UPDATE PRODUCT STOCK QUANTITY
// ========================================

const updateProductStock = async (
    productId,
    newQuantity
) => {

    const [result] = await pool.query(

        `
        UPDATE products

        SET
            quantity = ?,
            updated_at = CURRENT_TIMESTAMP

        WHERE id = ?
        `,

        [
            newQuantity,
            productId
        ]

    );


    return result.affectedRows;

};


// ========================================
// EXPORT FUNCTIONS
// ========================================

module.exports = {

    createProduct,

    getAllProducts,

    getProductById,

    updateProduct,

    deleteProduct,

    searchProducts,

    updateProductStock

};
