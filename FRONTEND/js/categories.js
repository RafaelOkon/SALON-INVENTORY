// ========================================
// CATEGORY MANAGEMENT
// ========================================

let allCategories = [];


// ========================================
// DOM ELEMENTS
// ========================================

const categoriesTableBody =
    document.getElementById("categoriesTableBody");

const categoryCount =
    document.getElementById("categoryCount");

const categorySearch =
    document.getElementById("categorySearch");

const resetCategorySearch =
    document.getElementById("resetCategorySearch");

const categoryForm =
    document.getElementById("categoryForm");

const categoryName =
    document.getElementById("categoryName");

const categoryDescription =
    document.getElementById("categoryDescription");


// ========================================
// INITIALIZE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeCategoriesPage
);


async function initializeCategoriesPage() {

    console.log("Categories page loaded");

    setupCategoryEvents();

    await loadCategories();

}


// ========================================
// LOAD CATEGORIES
// ========================================

async function loadCategories() {

    showCategoryLoading();

    try {

        const response =
            await authenticatedRequest(
                "/categories",
                {
                    method: "GET"
                }
            );


        console.log(
            "Categories API response:",
            response
        );


        if (!response) {

            throw new Error(
                "No response received from server"
            );

        }


        if (!response.success) {

            throw new Error(
                response.data?.message ||
                response.message ||
                "Failed to load categories"
            );

        }


        let categories = [];


        if (Array.isArray(response.data)) {

            categories =
                response.data;

        }

        else if (
            Array.isArray(response.data?.data)
        ) {

            categories =
                response.data.data;

        }


        allCategories =
            categories;


        console.log(
            "Categories loaded:",
            allCategories
        );


        displayCategories(
            allCategories
        );


    }

    catch (error) {

        console.error(
            "Load categories error:",
            error
        );


        showCategoryError(
            error.message
        );

    }

}


// ========================================
// DISPLAY CATEGORIES
// ========================================

function displayCategories(categories) {

    if (!categoriesTableBody) {

        console.error(
            "#categoriesTableBody not found"
        );

        return;

    }


    categoriesTableBody.innerHTML = "";


    if (
        !Array.isArray(categories) ||
        categories.length === 0
    ) {

        categoriesTableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center text-muted py-5"
                >

                    <i
                        class="bi bi-folder2-open fs-2 d-block mb-2"
                    ></i>

                    No categories found.

                </td>

            </tr>

        `;


        updateCategoryCount(0);

        return;

    }


    categories.forEach(
        (category, index) => {

            const row =
                document.createElement("tr");


            const productCount =
                Number(
                    category.product_count ?? 0
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>

                    <strong>
                        ${escapeHtml(
                            category.name || "-"
                        )}
                    </strong>

                </td>

                <td>

                    ${escapeHtml(
                        category.description ||
                        "No description"
                    )}

                </td>

                <td>

                    <span class="badge text-bg-secondary">

                        ${productCount}

                    </span>

                </td>

                <td>

                    <span class="badge text-bg-success">

                        Active

                    </span>

                </td>

                <td class="text-end">

                    <button
                        type="button"
                        class="btn btn-sm btn-outline-primary edit-category-btn"
                        data-category-id="${category.id}"
                        title="Edit category"
                    >

                        <i class="bi bi-pencil"></i>

                    </button>


                    <button
                        type="button"
                        class="btn btn-sm btn-outline-danger delete-category-btn"
                        data-category-id="${category.id}"
                        title="Delete category"
                    >

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            `;


            categoriesTableBody.appendChild(
                row
            );

        }
    );


    updateCategoryCount(
        categories.length
    );

}


// ========================================
// SEARCH CATEGORIES
// ========================================

function filterCategories() {

    const search =
        categorySearch?.value
            .trim()
            .toLowerCase() || "";


    if (!search) {

        displayCategories(
            allCategories
        );

        return;

    }


    const filteredCategories =
        allCategories.filter(
            category => {

                const name =
                    String(
                        category.name || ""
                    ).toLowerCase();


                const description =
                    String(
                        category.description || ""
                    ).toLowerCase();


                return (
                    name.includes(search) ||
                    description.includes(search)
                );

            }
        );


    displayCategories(
        filteredCategories
    );

}


// ========================================
// CREATE CATEGORY
// ========================================

async function createCategory(event) {

    event.preventDefault();


    if (!categoryName) {

        return;

    }


    const name =
        categoryName.value.trim();


    const description =
        categoryDescription
            ? categoryDescription.value.trim()
            : "";


    // ========================================
    // VALIDATION
    // ========================================

    if (!name) {

        categoryName.classList.add(
            "is-invalid"
        );

        return;

    }


    categoryName.classList.remove(
        "is-invalid"
    );


    const submitButton =
        categoryForm?.querySelector(
            'button[type="submit"]'
        );


    if (submitButton) {

        submitButton.disabled = true;

        submitButton.innerHTML = `

            <span
                class="spinner-border spinner-border-sm me-1"
            ></span>

            Saving...

        `;

    }


    try {

        const response =
            await authenticatedRequest(
                "/categories",
                {

                    method: "POST",

                    body: JSON.stringify({

                        name,

                        description:
                            description || null

                    })

                }
            );


        console.log(
            "Create category response:",
            response
        );


        if (!response || !response.success) {

            throw new Error(

                response?.data?.message ||
                response?.message ||
                "Failed to create category"

            );

        }


        showCategoryMessage(
            "Category created successfully.",
            "success"
        );


        categoryForm.reset();


        await loadCategories();


        // Close modal

        const modalElement =
            document.getElementById(
                "addCategoryModal"
            );


        if (modalElement) {

            const modal =
                bootstrap.Modal.getInstance(
                    modalElement
                );


            if (modal) {

                modal.hide();

            }

        }

    }

    catch (error) {

        console.error(
            "Create category error:",
            error
        );


        showCategoryMessage(
            error.message ||
            "Unable to create category.",
            "danger"
        );

    }

    finally {

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.innerHTML = `

                <i class="bi bi-plus-circle"></i>

                Add Category

            `;

        }

    }

}


// ========================================
// EDIT CATEGORY
// ========================================

async function editCategory(categoryId) {

    const category =
        allCategories.find(
            item =>
                String(item.id) ===
                String(categoryId)
        );


    if (!category) {

        showCategoryMessage(
            "Category not found.",
            "danger"
        );

        return;

    }


    const newName =
        prompt(
            "Enter category name:",
            category.name || ""
        );


    if (newName === null) {

        return;

    }


    const cleanedName =
        newName.trim();


    if (!cleanedName) {

        alert(
            "Category name is required."
        );

        return;

    }


    const newDescription =
        prompt(
            "Enter category description:",
            category.description || ""
        );


    if (newDescription === null) {

        return;

    }


    try {

        const response =
            await authenticatedRequest(
                `/categories/${categoryId}`,
                {

                    method: "PUT",

                    body: JSON.stringify({

                        name:
                            cleanedName,

                        description:
                            newDescription.trim() ||
                            null

                    })

                }
            );


        console.log(
            "Update category response:",
            response
        );


        if (!response || !response.success) {

            throw new Error(

                response?.data?.message ||
                response?.message ||
                "Failed to update category"

            );

        }


        showCategoryMessage(
            "Category updated successfully.",
            "success"
        );


        await loadCategories();

    }

    catch (error) {

        console.error(
            "Update category error:",
            error
        );


        showCategoryMessage(
            error.message ||
            "Unable to update category.",
            "danger"
        );

    }

}


// ========================================
// DELETE CATEGORY
// ========================================

async function deleteCategory(categoryId) {

    const category =
        allCategories.find(
            item =>
                String(item.id) ===
                String(categoryId)
        );


    if (!category) {

        return;

    }


    const confirmed =
        confirm(

            `Are you sure you want to delete "${category.name}"?`

        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await authenticatedRequest(
                `/categories/${categoryId}`,
                {

                    method: "DELETE"

                }
            );


        console.log(
            "Delete category response:",
            response
        );


        if (!response || !response.success) {

            throw new Error(

                response?.data?.message ||
                response?.message ||
                "Failed to delete category"

            );

        }


        showCategoryMessage(
            "Category deleted successfully.",
            "success"
        );


        await loadCategories();

    }

    catch (error) {

        console.error(
            "Delete category error:",
            error
        );


        showCategoryMessage(
            error.message ||
            "Unable to delete category.",
            "danger"
        );

    }

}


// ========================================
// EVENTS
// ========================================

function setupCategoryEvents() {

    // Search

    if (categorySearch) {

        categorySearch.addEventListener(
            "input",
            filterCategories
        );

    }


    // Reset search

    if (resetCategorySearch) {

        resetCategorySearch.addEventListener(
            "click",
            () => {

                categorySearch.value = "";

                displayCategories(
                    allCategories
                );

            }
        );

    }


    // Create category

    if (categoryForm) {

        categoryForm.addEventListener(
            "submit",
            createCategory
        );

    }


    // Edit / Delete

    if (categoriesTableBody) {

        categoriesTableBody.addEventListener(
            "click",
            event => {

                const editButton =
                    event.target.closest(
                        ".edit-category-btn"
                    );


                const deleteButton =
                    event.target.closest(
                        ".delete-category-btn"
                    );


                if (editButton) {

                    editCategory(
                        editButton.dataset.categoryId
                    );

                }


                if (deleteButton) {

                    deleteCategory(
                        deleteButton.dataset.categoryId
                    );

                }

            }
        );

    }

}


// ========================================
// CATEGORY COUNT
// ========================================

function updateCategoryCount(count) {

    if (!categoryCount) {

        return;

    }


    categoryCount.textContent =
        `${count} Categor${count === 1 ? "y" : "ies"}`;

}


// ========================================
// LOADING
// ========================================

function showCategoryLoading() {

    if (!categoriesTableBody) {

        return;

    }


    categoriesTableBody.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="text-center py-5"
            >

                <div
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                ></div>

                Loading categories...

            </td>

        </tr>

    `;

}


// ========================================
// ERROR
// ========================================

function showCategoryError(message) {

    if (!categoriesTableBody) {

        return;

    }


    categoriesTableBody.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="text-center text-danger py-5"
            >

                <i
                    class="bi bi-exclamation-triangle fs-3 d-block mb-2"
                ></i>

                ${escapeHtml(
                    message ||
                    "Unable to load categories"
                )}

            </td>

        </tr>

    `;


    updateCategoryCount(0);

}


// ========================================
// MESSAGE
// ========================================

function showCategoryMessage(
    message,
    type = "success"
) {

    let messageElement =
        document.getElementById(
            "categoryMessage"
        );


    if (!messageElement) {

        messageElement =
            document.createElement("div");

        messageElement.id =
            "categoryMessage";

        const main =
            document.querySelector("main");

        if (main) {

            main.prepend(
                messageElement
            );

        }

    }


    messageElement.className =
        `alert alert-${type}`;

    messageElement.textContent =
        message;


    setTimeout(() => {

        if (messageElement) {

            messageElement.remove();

        }

    }, 4000);

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}

