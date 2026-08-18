const express = require("express");

const protect =
    require("../middleware/authMiddleware");

const {
    getDashboardController
} = require("../controllers/dashboardController");


const router = express.Router();


// ========================================
// GET DASHBOARD
// GET /api/dashboard
// ========================================

router.get(
    "/",
    protect,
    getDashboardController
);


module.exports = router;