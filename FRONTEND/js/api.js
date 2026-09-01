const API_BASE_URL = "http://localhost:5000/api";


// ========================================
// GET TOKEN
// ========================================

function getToken() {
    return localStorage.getItem("token");
}


// ========================================
// SAVE TOKEN
// ========================================

function saveToken(token) {
    localStorage.setItem("token", token);
}


// ========================================
// REMOVE TOKEN
// ========================================

function removeToken() {
    localStorage.removeItem("token");
}

// ========================================
// API REQUEST
// ========================================

async function apiRequest(
    endpoint,
    options = {}
) {

    const token = getToken();


    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };


    // Add token if available
    if (token) {

        headers.Authorization =
            `Bearer ${token}`;

    }


    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );


    let data;

    try {

        data = await response.json();

    } catch (error) {

        data = {};

    }


    return {

        success: response.ok,

        status: response.status,

        data

    };

}


// ========================================
// AUTHENTICATED REQUEST
// ========================================

async function authenticatedRequest(
    endpoint,
    options = {}
) {

    const token = getToken();

    if (!token) {
        throw new Error("Authentication required");
    }


    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        "Authorization": `Bearer ${token}`
    };


    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );


    let data;

    try {
        data = await response.json();
    } catch (error) {
        data = {};
    }


    if (response.status === 401) {

        removeToken();

        throw new Error(
            data.message || "Authentication required"
        );
    }


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Request failed"
        );
    }


    return {
        success: true,
        status: response.status,
        data
    };
}


