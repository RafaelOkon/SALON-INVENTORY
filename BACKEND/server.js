const express = require("express");

const app = express();

const PORT = 5000;


// =========================
// MIDDLEWARE
// =========================

app.use(express.json());


// =========================
// ROUTES
// =========================

const testRoutes =
    require("./routes/testRoutes");


app.use("/api/test", testRoutes);


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