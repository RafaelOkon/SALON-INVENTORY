const {
    getDashboardStatistics
} = require("../models/Dashboard");


// ========================================
// GET DASHBOARD
// ========================================

const getDashboardController = async (
    req,
    res
) => {

    try {

        const statistics =
            await getDashboardStatistics();


        return res.status(200).json({

            success: true,

            data: statistics

        });

    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while loading dashboard"

        });

    }

};


module.exports = {
    getDashboardController
};

