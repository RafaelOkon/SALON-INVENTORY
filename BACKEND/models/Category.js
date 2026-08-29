const pool = require("../config/database");


// ========================================
// CREATE CATEGORY
// ========================================

const createCategory = async (categoryData) => {

    const {
        name,
        description
    } = categoryData;


    const [result] = await pool.query(

        `
        INSERT INTO categories
        (
            name,
            description
        )
        VALUES (?, ?)
        `,

        [
            name,
            description
        ]

    );


    return result.insertId;

};


// ========================================
// GET ALL CATEGORIES
// ========================================

const getAllCategories = async () => {

    const [rows] = await pool.query(

        `
        SELECT
            c.id,
            c.name,
            c.description,
            c.created_at,
            c.updated_at,

            COUNT(p.id) AS product_count

        FROM categories c

        LEFT JOIN products p
            ON c.id = p.category_id

        GROUP BY
            c.id,
            c.name,
            c.description,
            c.created_at,
            c.updated_at

        ORDER BY c.id DESC
        `

    );


    return rows;

};


// ========================================
// GET CATEGORY BY ID
// ========================================

const getCategoryById = async (id) => {

    const [rows] = await pool.query(

        `
        SELECT
            c.id,
            c.name,
            c.description,
            c.created_at,
            c.updated_at,

            COUNT(p.id) AS product_count

        FROM categories c

        LEFT JOIN products p
            ON c.id = p.category_id

        WHERE c.id = ?

        GROUP BY
            c.id,
            c.name,
            c.description,
            c.created_at,
            c.updated_at
        `,

        [id]

    );


    return rows[0];

};


// ========================================
// UPDATE CATEGORY
// ========================================

const updateCategory = async (
    id,
    categoryData
) => {

    const {
        name,
        description
    } = categoryData;


    const [result] = await pool.query(

        `
        UPDATE categories

        SET
            name = ?,
            description = ?

        WHERE id = ?
        `,

        [
            name,
            description,
            id
        ]

    );


    return result.affectedRows;

};


// ========================================
// DELETE CATEGORY
// ========================================

const deleteCategory = async (id) => {

    const [result] = await pool.query(

        `
        DELETE FROM categories

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

    createCategory,

    getAllCategories,

    getCategoryById,

    updateCategory,

    deleteCategory

};

