// ========================================
// API CONFIGURATION
// ========================================

const API_BASE_URL =
    "http://localhost:5000/api";


    // ========================================
// API REQUEST FUNCTION
// ========================================

const apiRequest = async (
    endpoint,
    options = {}
) => {

    try {

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            options
        );


        const data =
            await response.json();


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

};

// ========================================
// TOKEN MANAGEMENT
// ========================================

const getToken = () => {

    return localStorage.getItem(
        "token"
    );

};


const saveToken = (token) => {

    localStorage.setItem(
        "token",
        token
    );

};


const removeToken = () => {

    localStorage.removeItem(
        "token"
    );

};


// ========================================
// AUTHENTICATED API REQUEST
// ========================================

const authenticatedRequest = async (
    endpoint,
    options = {}
) => {

    const token =
        getToken();


    const headers = {

        "Content-Type":
            "application/json",

        ...(options.headers || {})

    };


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

