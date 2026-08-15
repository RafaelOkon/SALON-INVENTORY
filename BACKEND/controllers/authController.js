const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

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




// =========================
// LOGIN USER
// =========================

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Validate required fields

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required"

            });

        }


        // Find user by email

        const user =
            await findUserByEmail(email);


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // Compare password

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // Create JWT

        const token = jwt.sign(

            {
                id: user.id,
                email: user.email,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );


        // Send response

        return res.status(200).json({

            success: true,

            message:
                "Login successful",

            data: {

                token,

                user: {

                    id: user.id,

                    fullName:
                        user.full_name,

                    email:
                        user.email,

                    role:
                        user.role

                }

            }

        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error during login"

        });

    }

};


module.exports = {
    registerUser,
    loginUser
};