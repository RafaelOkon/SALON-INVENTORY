// =========================
// PASSWORD VISIBILITY
// =========================

function setupPasswordToggle(buttonId, inputId) {

    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);

    if (!button || !input) {
        return;
    }

    button.addEventListener("click", function () {

        const isPassword = input.type === "password";

        input.type = isPassword ? "text" : "password";

        const icon = button.querySelector("i");

        if (isPassword) {

            icon.classList.remove("bi-eye");
            icon.classList.add("bi-eye-slash");

            button.setAttribute("aria-label", "Hide password");

        } else {

            icon.classList.remove("bi-eye-slash");
            icon.classList.add("bi-eye");

            button.setAttribute("aria-label", "Show password");
        }

    });
}


// Login password
setupPasswordToggle(
    "togglePassword",
    "password"
);


// Registration password
setupPasswordToggle(
    "toggleRegisterPassword",
    "registerPassword"
);


// Registration confirm password
setupPasswordToggle(
    "toggleConfirmPassword",
    "confirmPassword"
);


// =========================
// REGISTRATION VALIDATION
// =========================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const fullName = document.getElementById("fullName");
        const email = document.getElementById("registerEmail");
        const password = document.getElementById("registerPassword");
        const confirmPassword = document.getElementById("confirmPassword");
        const terms = document.getElementById("terms");

        let isValid = true;


        // Full name validation
        if (fullName.value.trim().length < 2) {

            fullName.classList.add("is-invalid");
            isValid = false;

        } else {

            fullName.classList.remove("is-invalid");
            fullName.classList.add("is-valid");
        }


        // Email validation
        if (!email.validity.valid) {

            email.classList.add("is-invalid");
            isValid = false;

        } else {

            email.classList.remove("is-invalid");
            email.classList.add("is-valid");
        }


        // Password validation
        if (password.value.length < 6) {

            password.classList.add("is-invalid");
            isValid = false;

        } else {

            password.classList.remove("is-invalid");
            password.classList.add("is-valid");
        }


        // Confirm password validation
        if (
            confirmPassword.value.length < 6 ||
            confirmPassword.value !== password.value
        ) {

            confirmPassword.classList.add("is-invalid");
            isValid = false;

        } else {

            confirmPassword.classList.remove("is-invalid");
            confirmPassword.classList.add("is-valid");
        }


        // Terms validation
        if (!terms.checked) {

            terms.classList.add("is-invalid");
            isValid = false;

        } else {

            terms.classList.remove("is-invalid");
        }


        // Final result
        if (isValid) {

            alert("Registration form is valid. Backend connection will be added later.");

        }

    });

}




// =========================
// PRODUCT SEARCH
// =========================

const productSearch = document.getElementById("productSearch");

if (productSearch) {

    productSearch.addEventListener("input", function () {

        const searchValue = productSearch.value
            .toLowerCase()
            .trim();

        const rows = document.querySelectorAll(
            "#productsTable tbody tr"
        );

        let visibleProducts = 0;

        rows.forEach(function (row) {

            const productName = row
                .querySelector("td:nth-child(2)")
                .textContent
                .toLowerCase();

            if (productName.includes(searchValue)) {

                row.style.display = "";
                visibleProducts++;

            } else {

                row.style.display = "none";

            }

        });

        const productCount =
            document.getElementById("productCount");

        if (productCount) {

            productCount.textContent =
                `${visibleProducts} Products`;

        }

    });

}