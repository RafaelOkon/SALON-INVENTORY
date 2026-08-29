// ========================================
// API CONFIGURATION
// ========================================

const API_BASE_URL = "http://localhost:5000/api";


// ========================================
// TOKEN MANAGEMENT
// ========================================

function getToken() {

    return localStorage.getItem("token");

}


function saveToken(token) {

    if (token) {

        localStorage.setItem(
            "token",
            token
        );

    }

}


function removeToken() {

    localStorage.removeItem("token");

}


// ========================================
// NORMAL API REQUEST
// ========================================

async function apiRequest(
    endpoint,
    options = {}
) {

    try {

        const url =
            `${API_BASE_URL}${endpoint}`;

        const response =
            await fetch(
                url,
                {
                    ...options,

                    headers: {

                        "Content-Type":
                            "application/json",

                        ...(options.headers || {})

                    }

                }
            );


        // ========================================
        // READ RESPONSE SAFELY
        // ========================================

        const contentType =
            response.headers.get(
                "content-type"
            );


        let data = {};


        if (
            contentType &&
            contentType.includes(
                "application/json"
            )
        ) {

            data =
                await response.json();

        } else {

            const text =
                await response.text();

            data = {

                message:
                    text ||
                    "Server returned an unexpected response"

            };

        }


        return {

            success:
                response.ok,

            status:
                response.status,

            data

        };

    } catch (error) {

        console.error(
            "API request error:",
            error
        );


        return {

            success: false,

            status: 0,

            data: {

                message:
                    "Unable to connect to the server"

            }

        };

    }

}


// ========================================
// AUTHENTICATED API REQUEST
// ========================================

async function authenticatedRequest(
    endpoint,
    options = {}
) {

    const token =
        getToken();


    // ========================================
    // CHECK TOKEN
    // ========================================

    if (!token) {

        console.warn(
            "No authentication token found"
        );

        return {

            success: false,

            status: 401,

            data: {

                message:
                    "Authentication required"

            }

        };

    }


    // ========================================
    // SEND AUTHENTICATED REQUEST
    // ========================================

    try {

        const url =
            `${API_BASE_URL}${endpoint}`;


        const response =
            await fetch(
                url,
                {

                    ...options,

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`,

                        ...(options.headers || {})

                    }

                }
            );


        // ========================================
        // READ RESPONSE SAFELY
        // ========================================

        const contentType =
            response.headers.get(
                "content-type"
            );


        let data = {};


        if (
            contentType &&
            contentType.includes(
                "application/json"
            )
        ) {

            data =
                await response.json();

        } else {

            const text =
                await response.text();

            data = {

                message:
                    text ||
                    "Server returned an unexpected response"

            };

        }


        // ========================================
        // TOKEN EXPIRED / UNAUTHORIZED
        // ========================================

        if (
            response.status === 401
        ) {

            console.warn(
                "Authentication expired or invalid"
            );

            removeToken();

        }


        return {

            success:
                response.ok,

            status:
                response.status,

            data

        };

    } catch (error) {

        console.error(
            "Authenticated API request error:",
            error
        );


        return {

            success: false,

            status: 0,

            data: {

                message:
                    "Unable to connect to the server"

            }

        };

    }

}


// ========================================
// LOGOUT
// ========================================

function logout() {

    removeToken();

    window.location.href =
        "login.html";

}


// ========================================
// EXPORT / GLOBAL ACCESS
// ========================================

// These functions are intentionally
// attached to window so that other
// frontend JavaScript files can use them.

window.apiRequest =
    apiRequest;

window.authenticatedRequest =
    authenticatedRequest;

window.getToken =
    getToken;

window.saveToken =
    saveToken;

window.removeToken =
    removeToken;

window.logout =
    logout;