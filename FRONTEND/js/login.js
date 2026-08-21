// ========================================
// LOGIN FORM
// ========================================

const loginForm =
    document.getElementById(
        "loginForm"
    );


// ========================================
// LOGIN MESSAGE
// ========================================

const loginMessage =
    document.getElementById(
        "loginMessage"
    );


// ========================================
// LOGIN EVENT
// ========================================

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        // ========================================
        // GET FORM VALUES
        // ========================================

        const email =
            document.getElementById(
                "email"
            ).value.trim();


        const password =
            document.getElementById(
                "password"
            ).value;


        // ========================================
        // CLEAR OLD MESSAGE
        // ========================================

        loginMessage.innerHTML = "";


        // ========================================
        // CLIENT-SIDE VALIDATION
        // ========================================

        if (!email || !password) {

            loginMessage.innerHTML = `
                <div class="alert alert-danger">
                    Please enter your email and password.
                </div>
            `;

            return;

        }


        // ========================================
        // DISABLE BUTTON
        // ========================================

        const submitButton =
            loginForm.querySelector(
                'button[type="submit"]'
            );


        submitButton.disabled = true;

        submitButton.textContent =
            "Logging in...";


        try {

            // ========================================
            // SEND LOGIN REQUEST
            // ========================================

            const result =
                await apiRequest(
                    "/auth/login",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                email:
                                    email,

                                password:
                                    password

                            })

                    }
                );


            // ========================================
            // CHECK RESPONSE
            // ========================================

            if (!result.success) {

                loginMessage.innerHTML = `
                    <div class="alert alert-danger">
                        ${
                            result.data.message ||
                            "Login failed."
                        }
                    </div>
                `;

                return;

            }


            // ========================================
            // GET TOKEN
            // ========================================

            const token =
                result.data.token;


            // ========================================
            // SAVE TOKEN
            // ========================================

            saveToken(token);


            // ========================================
            // SAVE USER DATA
            // ========================================

            if (result.data.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        result.data.user
                    )
                );

            }


            // ========================================
            // SUCCESS MESSAGE
            // ========================================

            loginMessage.innerHTML = `
                <div class="alert alert-success">
                    Login successful. Redirecting...
                </div>
            `;


            // ========================================
            // REDIRECT
            // ========================================

            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 800);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            loginMessage.innerHTML = `
                <div class="alert alert-danger">
                    Something went wrong. Please try again.
                </div>
            `;

        } finally {

            submitButton.disabled = false;

            submitButton.textContent =
                "Login";

        }

    }
);

