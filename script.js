import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCqLFv3F9-3HAS7m7OIyCLD3M86KaRltN4",
    authDomain: "test-project-58ac0.firebaseapp.com",
    projectId: "test-project-58ac0",
    storageBucket: "test-project-58ac0.firebasestorage.app",
    messagingSenderId: "10691087045",
    appId: "1:10691087045:web:92637a0ab765882ce5feac",
    measurementId: "G-YHEPWY3EJC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const adminEmail = "admin@test.com";
const adminPassword = "Admin@1234";

const loginBtn = document.getElementById("login-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageContainer = document.getElementById("message-container");

function showMessage(message, type = "error") {
    messageContainer.textContent = message;
    messageContainer.className = `message ${type === "success" ? "success" : "error"}`;
    messageContainer.classList.remove("hidden");
}

async function signInAdmin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        showMessage("Please enter both email and password.");
        return;
    }

    if (email !== adminEmail) {
        showMessage("Only the admin account is allowed to login.");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "dashboard.html";
    } catch (error) {
        if (error.code === "auth/user-not-found") {
            try {
                await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
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
passwordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        signInAdmin();
    }
});
