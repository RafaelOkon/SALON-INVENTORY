const pool = require("../config/database");


// Find a user by email
const findUserByEmail = async (email) => {

    const [rows] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0];

};


// Create a new user
const createUser = async (
    fullName,
    email,
    password,
    role = "staff"
) => {

    const [result] = await pool.query(
        `
        INSERT INTO users
        (full_name, email, password, role)
        VALUES (?, ?, ?, ?)
        `,
        [
            fullName,
            email,
            password,
            role
        ]
    );

    return result.insertId;

};


module.exports = {
    findUserByEmail,
    createUser
};