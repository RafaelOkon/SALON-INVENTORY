// ========================================
// API CONFIGURATION
// ========================================

const API_BASE_URL = "http://127.0.0.1:5000/api";


// ========================================
// API REQUEST FUNCTION
// ========================================

const apiRequest = async (endpoint, options = {}) => {

    try {

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                cache: "no-store"
            }
        );

        // Safely handle responses that may not contain JSON
        const contentType = response.headers.get("content-type");

        let data = {};

        if (
            contentType &&
            contentType.includes("application/json")
        ) {
            data = await response.json();
        } else {
            data = {
                message: await response.text()
            };
        }

        return {
            success: response.ok,
            status: response.status,
            data: data
        };

    } catch (error) {

        console.error("API request error:", error);

        return {
            success: false,
            status: 0,
            data: {
                message: "Unable to connect to the server"
            }
        };

    }

};


// ========================================
// TOKEN MANAGEMENT
// ========================================

const getToken = () => {

    return localStorage.getItem("token");

};


const saveToken = (token) => {

    localStorage.setItem("token", token);

};


const removeToken = () => {

    localStorage.removeItem("token");

};


// ========================================
// AUTHENTICATED API REQUEST
// ========================================

const authenticatedRequest = async (
    endpoint,
    options = {}
) => {

    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };


    // Add JWT token when available
    if (token) {

        headers.Authorization =
            `Bearer ${token}`;

    }


    return apiRequest(
        endpoint,
        {
            ...options,
            headers
        }
    );

};