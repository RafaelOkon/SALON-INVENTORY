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


// =========================
// PRODUCT FILTER RESET
// =========================

const resetFilters = document.getElementById("resetFilters");

if (resetFilters) {

    resetFilters.addEventListener("click", function () {

        const searchInput =
            document.getElementById("productSearch");

        const categoryFilter =
            document.getElementById("categoryFilter");

        const stockFilter =
            document.getElementById("stockFilter");

        if (searchInput) {
            searchInput.value = "";
        }

        if (categoryFilter) {
            categoryFilter.value = "";
        }

        if (stockFilter) {
            stockFilter.value = "";
        }

        const rows = document.querySelectorAll(
            "#productsTable tbody tr"
        );

        rows.forEach(function (row) {
            row.style.display = "";
        });

        const productCount =
            document.getElementById("productCount");

        if (productCount) {
            productCount.textContent = `${rows.length} Products`;
        }

    });

}

// =========================
// CATEGORY SEARCH
// =========================

const categorySearch =
    document.getElementById("categorySearch");

if (categorySearch) {

    categorySearch.addEventListener("input", function () {

        const searchValue =
            categorySearch.value.toLowerCase().trim();

        const rows =
            document.querySelectorAll(
                "#categoriesTable tbody tr"
            );

        let visibleCategories = 0;

        rows.forEach(function (row) {

            const categoryName =
                row
                    .querySelector("td:nth-child(2)")
                    .textContent
                    .toLowerCase();

            if (categoryName.includes(searchValue)) {

                row.style.display = "";

                visibleCategories++;

            } else {

                row.style.display = "none";

            }

        });


        const categoryCount =
            document.getElementById("categoryCount");

        if (categoryCount) {

            categoryCount.textContent =
                `${visibleCategories} Categories`;

        }

    });

}


// =========================
// CATEGORY SEARCH RESET
// =========================

const resetCategorySearch =
    document.getElementById("resetCategorySearch");

if (resetCategorySearch) {

    resetCategorySearch.addEventListener("click", function () {

        const searchInput =
            document.getElementById("categorySearch");

        if (searchInput) {
            searchInput.value = "";
        }


        const rows =
            document.querySelectorAll(
                "#categoriesTable tbody tr"
            );


        rows.forEach(function (row) {

            row.style.display = "";

        });


        const categoryCount =
            document.getElementById("categoryCount");

        if (categoryCount) {

            categoryCount.textContent =
                `${rows.length} Categories`;

        }

    });

}



// =========================
// CATEGORY FORM VALIDATION
// =========================

const categoryForm =
    document.getElementById("categoryForm");

if (categoryForm) {

    categoryForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const categoryName =
            document.getElementById("categoryName");

        const categoryDescription =
            document.getElementById("categoryDescription");


        if (categoryName.value.trim().length < 2) {

            categoryName.classList.add("is-invalid");

            return;

        }


        categoryName.classList.remove("is-invalid");
        categoryName.classList.add("is-valid");


        alert(
            "Category form is valid. Backend connection will be added later."
        );

    });

}


// =========================
// SUPPLIER SEARCH
// =========================

const supplierSearch =
    document.getElementById("supplierSearch");

if (supplierSearch) {

    supplierSearch.addEventListener("input", function () {

        filterSuppliers();

    });

}


// =========================
// SUPPLIER FILTER FUNCTION
// =========================

function filterSuppliers() {

    const searchInput =
        document.getElementById("supplierSearch");

    const statusFilter =
        document.getElementById("supplierStatusFilter");

    const rows =
        document.querySelectorAll(
            "#suppliersTable tbody tr"
        );

    const searchValue =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "";

    let visibleSuppliers = 0;


    rows.forEach(function (row) {

        const supplierName =
            row
                .querySelector("td:nth-child(2)")
                .textContent
                .toLowerCase();


        const statusText =
            row
                .querySelector("td:nth-child(7)")
                .textContent
                .toLowerCase()
                .trim();


        const matchesSearch =
            supplierName.includes(searchValue);


        let matchesStatus = true;


        if (selectedStatus === "active") {

            matchesStatus =
                statusText === "active";

        }


        if (selectedStatus === "inactive") {

            matchesStatus =
                statusText === "inactive";

        }


        if (matchesSearch && matchesStatus) {

            row.style.display = "";

            visibleSuppliers++;

        } else {

            row.style.display = "none";

        }

    });


    const supplierCount =
        document.getElementById("supplierCount");


    if (supplierCount) {

        supplierCount.textContent =
            `${visibleSuppliers} Suppliers`;

    }

}



const supplierStatusFilter =
    document.getElementById("supplierStatusFilter");

if (supplierStatusFilter) {

    supplierStatusFilter.addEventListener("change", function () {

        filterSuppliers();

    });

}


// =========================
// SUPPLIER FILTER RESET
// =========================

const resetSupplierFilters =
    document.getElementById("resetSupplierFilters");

if (resetSupplierFilters) {

    resetSupplierFilters.addEventListener("click", function () {

        const searchInput =
            document.getElementById("supplierSearch");

        const statusFilter =
            document.getElementById("supplierStatusFilter");


        if (searchInput) {
            searchInput.value = "";
        }


        if (statusFilter) {
            statusFilter.value = "";
        }


        filterSuppliers();

    });

}


// =========================
// SUPPLIER FORM VALIDATION
// =========================

const supplierForm =
    document.getElementById("supplierForm");

if (supplierForm) {

    supplierForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const supplierName =
            document.getElementById("supplierName");

        const contactPerson =
            document.getElementById("contactPerson");

        const supplierPhone =
            document.getElementById("supplierPhone");

        const supplierEmail =
            document.getElementById("supplierEmail");


        let isValid = true;


        // Supplier name

        if (supplierName.value.trim().length < 2) {

            supplierName.classList.add("is-invalid");

            isValid = false;

        } else {

            supplierName.classList.remove("is-invalid");
            supplierName.classList.add("is-valid");

        }


        // Contact person

        if (contactPerson.value.trim().length < 2) {

            contactPerson.classList.add("is-invalid");

            isValid = false;

        } else {

            contactPerson.classList.remove("is-invalid");
            contactPerson.classList.add("is-valid");

        }


        // Phone

        if (!supplierPhone.validity.valid) {

            supplierPhone.classList.add("is-invalid");

            isValid = false;

        } else {

            supplierPhone.classList.remove("is-invalid");
            supplierPhone.classList.add("is-valid");

        }


        // Email

        if (
            supplierEmail.value.trim() !== "" &&
            !supplierEmail.validity.valid
        ) {

            supplierEmail.classList.add("is-invalid");

            isValid = false;

        } else {

            supplierEmail.classList.remove("is-invalid");

            if (supplierEmail.value.trim() !== "") {
                supplierEmail.classList.add("is-valid");
            }

        }


        if (!isValid) {
            return;
        }


        alert(
            "Supplier form is valid. Backend connection will be added later."
        );

    });

}

