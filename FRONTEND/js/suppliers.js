// ========================================
// SUPPLIERS PAGE
// ========================================

let suppliers = [];


// ========================================
// DOM ELEMENTS
// ========================================

const supplierTableBody =
    document.querySelector("#suppliersTable tbody");

const supplierCount =
    document.getElementById("supplierCount");

const supplierSearch =
    document.getElementById("supplierSearch");

const resetSupplierFilters =
    document.getElementById("resetSupplierFilters");

const supplierForm =
    document.getElementById("supplierForm");


// ========================================
// LOAD SUPPLIERS
// ========================================

async function loadSuppliers() {

    try {

        const response =
            await authenticatedRequest("/suppliers");

        console.log("Suppliers response:", response);

        suppliers =
            response.data?.data || [];

        displaySuppliers(suppliers);

    } catch (error) {

        console.error(
            "Load suppliers error:",
            error
        );

        if (supplierTableBody) {

            supplierTableBody.innerHTML = `
                <tr>
                    <td colspan="8"
                        class="text-center text-danger py-4">
                        ${escapeHtml(
                            error.message ||
                            "Failed to load suppliers."
                        )}
                    </td>
                </tr>
            `;

        }

    }

}


// ========================================
// DISPLAY SUPPLIERS
// ========================================

function displaySuppliers(data) {

    if (!supplierTableBody) {
        return;
    }

    supplierTableBody.innerHTML = "";

    if (!data || data.length === 0) {

        supplierTableBody.innerHTML = `
            <tr>
                <td colspan="8"
                    class="text-center text-muted py-4">
                    No suppliers found.
                </td>
            </tr>
        `;

        updateSupplierCount(0);

        return;
    }


    data.forEach((supplier, index) => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${index + 1}</td>

            <td>
                <strong>
                    ${escapeHtml(supplier.name || "")}
                </strong>
            </td>

            <td>
                —
            </td>

            <td>
                ${escapeHtml(
                    supplier.phone || "—"
                )}
            </td>

            <td>
                ${escapeHtml(
                    supplier.email || "—"
                )}
            </td>

            <td>
                ${Number(
                    supplier.product_count || 0
                )}
            </td>

            <td>
                <span class="badge text-bg-success">
                    Active
                </span>
            </td>

            <td class="text-end">

                <button
                    class="btn btn-sm btn-outline-primary edit-supplier-btn"
                    data-id="${supplier.id}"
                    title="Edit supplier"
                >
                    <i class="bi bi-pencil"></i>
                </button>

                <button
                    class="btn btn-sm btn-outline-danger delete-supplier-btn"
                    data-id="${supplier.id}"
                    title="Delete supplier"
                >
                    <i class="bi bi-trash"></i>
                </button>

            </td>

        `;

        supplierTableBody.appendChild(row);

    });

    updateSupplierCount(data.length);

}


// ========================================
// UPDATE COUNT
// ========================================

function updateSupplierCount(count) {

    if (!supplierCount) {
        return;
    }

    supplierCount.textContent =
        `${count} Supplier${count !== 1 ? "s" : ""}`;

}


// ========================================
// SEARCH SUPPLIERS
// ========================================

function searchSuppliers() {

    const searchTerm =
        supplierSearch.value
            .trim()
            .toLowerCase();

    if (!searchTerm) {

        displaySuppliers(suppliers);

        return;
    }


    const filteredSuppliers =
        suppliers.filter(supplier => {

            const name =
                (supplier.name || "")
                    .toLowerCase();

            const email =
                (supplier.email || "")
                    .toLowerCase();

            const phone =
                (supplier.phone || "")
                    .toLowerCase();

            const address =
                (supplier.address || "")
                    .toLowerCase();

            return (
                name.includes(searchTerm) ||
                email.includes(searchTerm) ||
                phone.includes(searchTerm) ||
                address.includes(searchTerm)
            );

        });

    displaySuppliers(filteredSuppliers);

}


// ========================================
// RESET SEARCH
// ========================================

function resetSearch() {

    if (supplierSearch) {
        supplierSearch.value = "";
    }

    displaySuppliers(suppliers);

}


// ========================================
// CREATE SUPPLIER
// ========================================

async function createSupplier(event) {

    event.preventDefault();

    const name =
        document
            .getElementById("supplierName")
            .value
            .trim();

    const email =
        document
            .getElementById("supplierEmail")
            .value
            .trim();

    const phone =
        document
            .getElementById("supplierPhone")
            .value
            .trim();

    const address =
        document
            .getElementById("supplierAddress")
            .value
            .trim();


    if (!name) {

        alert("Supplier name is required.");

        return;
    }


    const supplierData = {

        name,

        email:
            email || null,

        phone:
            phone || null,

        address:
            address || null

    };


    try {

        const response =
            await authenticatedRequest(
                "/suppliers",
                {
                    method: "POST",

                    body:
                        JSON.stringify(
                            supplierData
                        )
                }
            );


        console.log(
            "Create supplier response:",
            response
        );


        alert(
            "Supplier created successfully."
        );


        supplierForm.reset();


        const modalElement =
            document.getElementById(
                "addSupplierModal"
            );


        const modal =
            bootstrap.Modal.getInstance(
                modalElement
            );


        if (modal) {
            modal.hide();
        }


        await loadSuppliers();


    } catch (error) {

        console.error(
            "Create supplier error:",
            error
        );

        alert(
            error.message ||
            "Failed to create supplier."
        );

    }

}


// ========================================
// DELETE SUPPLIER
// ========================================

async function deleteSupplier(id) {

    const supplier =
        suppliers.find(
            item =>
                Number(item.id) === Number(id)
        );


    if (!supplier) {

        alert("Supplier not found.");

        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${supplier.name}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await authenticatedRequest(
            `/suppliers/${id}`,
            {
                method: "DELETE"
            }
        );


        alert(
            "Supplier deleted successfully."
        );


        await loadSuppliers();


    } catch (error) {

        console.error(
            "Delete supplier error:",
            error
        );

        alert(
            error.message ||
            "Failed to delete supplier."
        );

    }

}


// ========================================
// EDIT SUPPLIER
// ========================================

async function editSupplier(id) {

    const supplier =
        suppliers.find(
            item =>
                Number(item.id) === Number(id)
        );


    if (!supplier) {

        alert("Supplier not found.");

        return;
    }


    const name =
        prompt(
            "Supplier name:",
            supplier.name || ""
        );


    if (name === null) {
        return;
    }


    if (!name.trim()) {

        alert(
            "Supplier name is required."
        );

        return;
    }


    const email =
        prompt(
            "Email:",
            supplier.email || ""
        );


    if (email === null) {
        return;
    }


    const phone =
        prompt(
            "Phone:",
            supplier.phone || ""
        );


    if (phone === null) {
        return;
    }


    const address =
        prompt(
            "Address:",
            supplier.address || ""
        );


    if (address === null) {
        return;
    }


    await updateSupplier(
        id,
        {
            name: name.trim(),

            email:
                email.trim() || null,

            phone:
                phone.trim() || null,

            address:
                address.trim() || null
        }
    );

}


// ========================================
// UPDATE SUPPLIER
// ========================================

async function updateSupplier(
    id,
    supplierData
) {

    try {

        await authenticatedRequest(
            `/suppliers/${id}`,
            {
                method: "PUT",

                body:
                    JSON.stringify(
                        supplierData
                    )
            }
        );


        alert(
            "Supplier updated successfully."
        );


        await loadSuppliers();


    } catch (error) {

        console.error(
            "Update supplier error:",
            error
        );

        alert(
            error.message ||
            "Failed to update supplier."
        );

    }

}


// ========================================
// EVENT LISTENERS
// ========================================

if (supplierForm) {

    supplierForm.addEventListener(
        "submit",
        createSupplier
    );

}


if (supplierSearch) {

    supplierSearch.addEventListener(
        "input",
        searchSuppliers
    );

}


if (resetSupplierFilters) {

    resetSupplierFilters.addEventListener(
        "click",
        resetSearch
    );

}


if (supplierTableBody) {

    supplierTableBody.addEventListener(
        "click",
        event => {

            const editButton =
                event.target.closest(
                    ".edit-supplier-btn"
                );

            const deleteButton =
                event.target.closest(
                    ".delete-supplier-btn"
                );


            if (editButton) {

                editSupplier(
                    editButton.dataset.id
                );

            }


            if (deleteButton) {

                deleteSupplier(
                    deleteButton.dataset.id
                );

            }

        }
    );

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ========================================
// INITIALIZE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadSuppliers();

    }
);

