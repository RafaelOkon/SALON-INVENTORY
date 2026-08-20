const testAPI = async () => {

    const result =
        await apiRequest(
            "/products"
        );


    console.log(
        "API RESULT:",
        result
    );

};


testAPI();