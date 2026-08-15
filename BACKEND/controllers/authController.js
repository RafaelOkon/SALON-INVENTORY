const bcrypt = require("bcrypt");

const {
    findUserByEmail,
    createUser
} = require("../models/User");


// =========================
// REGISTER USER
// =========================

const registerUser = async (req, res) => {

    try {

        const {
            fullName,
            email,
            password
        } = req.body;


        // Validate required fields

        if (
            !fullName ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Full name, email and password are required"

            });

        }


        // Validate password length

        if (password.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters"

            });

        }


        // Check whether user already exists

        const existingUser =
            await findUserByEmail(email);


        if (existingUser) {

            return res.status(409).json({

                success: false,

                message:
                    "A user with this email already exists"

            });

        }


        // Hash password

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user

        const userId =
            await createUser(
                fullName,
                email,
                hashedPassword
            );


        // Send response

        return res.status(201).json({

            success: true,

            message:
                "User registered successfully",

            data: {

                userId,

                fullName,

                email

            }

        });

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error during registration"

        });

    }

};


module.exports = {
    registerUser
};