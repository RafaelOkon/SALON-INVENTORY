// =========================
// PASSWORD VISIBILITY
// =========================

const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

if (togglePassword && password) {

    togglePassword.addEventListener("click", function () {

        const isPassword = password.type === "password";

        password.type = isPassword ? "text" : "password";

        const icon = togglePassword.querySelector("i");

        if (isPassword) {
            icon.classList.remove("bi-eye");
            icon.classList.add("bi-eye-slash");
        } else {
            icon.classList.remove("bi-eye-slash");
            icon.classList.add("bi-eye");
        }

    });

}