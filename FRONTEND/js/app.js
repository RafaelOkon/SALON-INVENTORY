// ========================================
// APPLICATION JAVASCRIPT
// ========================================


// ========================================
// PASSWORD VISIBILITY
// ========================================

function setupPasswordToggle(buttonId, inputId) {

    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);

    if (!button || !input) {
        return;
    }

    button.addEventListener("click", function () {

        const isPassword =
            input.type === "password";

        input.type =
            isPassword ? "text" : "password";

        const icon =
            button.querySelector("i");

        if (!icon) {
            return;
        }

        if (isPassword) {

            icon.classList.remove("bi-eye");
            icon.classList.add("bi-eye-slash");

            button.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            icon.classList.remove("bi-eye-slash");
            icon.classList.add("bi-eye");

            button.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    });

}


// ========================================
// PASSWORD TOGGLES
// ========================================

setupPasswordToggle(
    "togglePassword",
    "password"
);

setupPasswordToggle(
    "toggleRegisterPassword",
    "registerPassword"
);

setupPasswordToggle(
    "toggleConfirmPassword",
    "confirmPassword"
);


// ========================================
// FRONTEND AUTHENTICATION
// ========================================

const pageName =
    window.location.pathname
        .split("/")
        .pop();


// ========================================
// PROTECTED PAGES
// ========================================

const protectedPages = [

    "dashboard.html",
    "products.html",
    "categories.html",
    "suppliers.html",
    "stock.html"

];


// ========================================
// CHECK JWT TOKEN
// ========================================

const token =
    typeof getToken === "function"
        ? getToken()
        : localStorage.getItem("token");


const isLoggedIn =
    Boolean(token);


// ========================================
// REDIRECT UNAUTHENTICATED USER
// ========================================

if (
    protectedPages.includes(pageName) &&
    !isLoggedIn
) {

    window.location.href =
        "login.html";

}


// ========================================
// REDIRECT LOGGED-IN USER
// ========================================

if (
    pageName === "login.html" &&
    isLoggedIn
) {

    window.location.href =
        "dashboard.html";

}


// ========================================
// LOGOUT
// ========================================

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            // Remove JWT token

            if (
                typeof removeToken === "function"
            ) {

                removeToken();

            } else {

                localStorage.removeItem(
                    "token"
                );

            }


            // Remove old frontend login flag

            localStorage.removeItem(
                "isLoggedIn"
            );


            // Remove saved user information

            localStorage.removeItem(
                "userEmail"
            );


            // Redirect to login

            window.location.href =
                "login.html";

        }
    );

}


// ========================================
// DISPLAY LOGGED-IN USER
// ========================================

const loggedInUser =
    document.getElementById("loggedInUser");


if (loggedInUser) {

    const userEmail =
        localStorage.getItem("userEmail");


    if (userEmail) {

        loggedInUser.textContent =
            userEmail;

    }

}


// ========================================
// REGISTRATION FORM VALIDATION
// ========================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const fullName =
                document.getElementById("fullName");

            const email =
                document.getElementById("registerEmail");

            const password =
                document.getElementById("registerPassword");

            const confirmPassword =
                document.getElementById("confirmPassword");

            const terms =
                document.getElementById("terms");


            let isValid = true;


            // Full name

            if (
                !fullName ||
                fullName.value.trim().length < 2
            ) {

                fullName?.classList.add(
                    "is-invalid"
                );

                isValid = false;

            } else {

                fullName.classList.remove(
                    "is-invalid"
                );

            }


            // Email

            if (
                !email ||
                !email.validity.valid
            ) {

                email?.classList.add(
                    "is-invalid"
                );

                isValid = false;

            } else {

                email.classList.remove(
                    "is-invalid"
                );

            }


            // Password

            if (
                !password ||
                password.value.length < 6
            ) {

                password?.classList.add(
                    "is-invalid"
                );

                isValid = false;

            } else {

                password.classList.remove(
                    "is-invalid"
                );

            }


            // Confirm password

            if (
                !confirmPassword ||
                confirmPassword.value !==
                    password.value ||
                confirmPassword.value.length < 6
            ) {

                confirmPassword?.classList.add(
                    "is-invalid"
                );

                isValid = false;

            } else {

                confirmPassword.classList.remove(
                    "is-invalid"
                );

            }


            // Terms

            if (
                terms &&
                !terms.checked
            ) {

                terms.classList.add(
                    "is-invalid"
                );

                isValid = false;

            } else {

                terms?.classList.remove(
                    "is-invalid"
                );

            }


            if (!isValid) {
                return;
            }


            console.log(
                "Registration form validation passed"
            );

        }
    );

}