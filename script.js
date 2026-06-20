import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBPd2SeDOQ7x0nnShwKqykAn_zNkgx9t4Y",
    authDomain: "test-f52a6.firebaseapp.com",
    projectId: "test-f52a6",
    storageBucket: "test-f52a6.firebasestorage.app",
    messagingSenderId: "276833014789",
    appId: "1:276833014789:web:7ff8d9c5f8409533e6386c",
    measurementId: "G-BSLWX7RKNE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const adminUsername = "admin";
const adminPassword = "8591";
const adminEmail = "admin@test-f52a6.firebaseapp.com";

const loginBtn = document.getElementById("login-btn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const messageContainer = document.getElementById("message-container");

function showMessage(message, type = "error") {
    messageContainer.textContent = message;
    messageContainer.className = `message ${type === "success" ? "success" : "error"}`;
    messageContainer.classList.remove("hidden");
}

async function signInAdmin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        showMessage("Please enter both username and password.");
        return;
    }

    if (username !== adminUsername) {
        showMessage("Only the admin username is allowed to login.");
        return;
    }

    if (password !== adminPassword) {
        showMessage("Incorrect password. Please try again.");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        localStorage.setItem("lastAdminLogin", new Date().toLocaleString());
        showMessage("Login successful. Redirecting...", "success");
        window.location.href = "dashboard.html";
    } catch (error) {
        if (error.code === "auth/user-not-found") {
            try {
                await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
                localStorage.setItem("lastAdminLogin", new Date().toLocaleString());
                window.location.href = "dashboard.html";
            } catch (createError) {
                showMessage(createError.message);
            }
        } else if (error.code === "auth/wrong-password") {
            showMessage("Incorrect password. Please try again.");
        } else {
            showMessage(error.message);
        }
    }
}

onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.endsWith("/") || currentPath.endsWith("index.html");
    const isDashboardPage = currentPath.endsWith("dashboard.html");

    if (user && isLoginPage) {
        window.location.href = "dashboard.html";
    }

    if (!user && isDashboardPage) {
        window.location.href = "index.html";
    }
});

loginBtn.addEventListener("click", signInAdmin);
usernameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        signInAdmin();
    }
});
passwordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        signInAdmin();
    }
});
