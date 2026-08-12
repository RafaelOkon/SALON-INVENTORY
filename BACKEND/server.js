const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const pool = require("./config/database");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());


// =========================
// TEST ROUTE
// =========================

const testRoutes =
    require("./routes/testRoutes");

app.use("/api/test", testRoutes);


// =========================
// DATABASE TEST
// =========================

app.get("/api/test-db", async (req, res) => {

    try {

        const [rows] = await pool.query(
            "SELECT 1 AS result"
        );

        res.json({
            success: true,
            message: "MySQL database connection is working",
            data: rows
        });

    } catch (error) {

        console.error(
            "Database connection error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });

    }

});


// =========================
// PRODUCTS TEST
// =========================

app.get("/api/test-products", async (req, res) => {

    try {

        const [products] = await pool.query(
            "SELECT * FROM products"
        );

        res.json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {

        console.error(
            "Product query error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to retrieve products"
        });

    }

});


// =========================
// ROOT ROUTE
// =========================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Salon Inventory Management API is running"
    });

});


// =========================
// START SERVER
// =========================

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});