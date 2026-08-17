const pool = require("../config/database");


// ========================================
// CREATE SUPPLIER
// ========================================

const createSupplier = async (supplierData) => {

    const {
        name,
        email,
        phone,
        address
    } = supplierData;


    const [result] = await pool.query(

        `
        INSERT INTO suppliers
        (
            name,
            email,
            phone,
            address
        )
        VALUES (?, ?, ?, ?)
        `,

        [
            name,
            email,
            phone,
            address
        ]

    );


    return result.insertId;

};


// ========================================
// GET ALL SUPPLIERS
// ========================================

const getAllSuppliers = async () => {

    const [rows] = await pool.query(

        `
        SELECT
            s.id,
            s.name,
            s.email,
            s.phone,
            s.address,
            s.created_at,
            s.updated_at,

            COUNT(p.id) AS product_count

        FROM suppliers s

        LEFT JOIN products p
            ON s.id = p.supplier_id

        GROUP BY
            s.id,
            s.name,
            s.email,
            s.phone,
            s.address,
            s.created_at,
            s.updated_at

        ORDER BY s.id DESC
        `

    );


    return rows;

};


// ========================================
// GET SUPPLIER BY ID
// ========================================

const getSupplierById = async (id) => {

    const [rows] = await pool.query(

        `
        SELECT
            s.id,
            s.name,
            s.email,
            s.phone,
            s.address,
            s.created_at,
            s.updated_at,

            COUNT(p.id) AS product_count

        FROM suppliers s

        LEFT JOIN products p
            ON s.id = p.supplier_id

        WHERE s.id = ?

        GROUP BY
            s.id,
            s.name,
            s.email,
            s.phone,
            s.address,
            s.created_at,
            s.updated_at
        `,

        [id]

    );


    return rows[0];

};


// ========================================
// UPDATE SUPPLIER
// ========================================

const updateSupplier = async (
    id,
    supplierData
) => {

    const {
        name,
        email,
        phone,
        address
    } = supplierData;


    const [result] = await pool.query(

        `
        UPDATE suppliers

        SET
            name = ?,
            email = ?,
            phone = ?,
            address = ?

        WHERE id = ?
        `,

        [
            name,
            email,
            phone,
            address,
            id
        ]

    );


    return result.affectedRows;

};


// ========================================
// DELETE SUPPLIER
// ========================================

const deleteSupplier = async (id) => {

    const [result] = await pool.query(

        `
        DELETE FROM suppliers

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

    createSupplier,

    getAllSuppliers,

    getSupplierById,

    updateSupplier,

    deleteSupplier

};