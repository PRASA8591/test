import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { 
    getAuth, 
    RecaptchaVerifier, 
    signInWithPhoneNumber,
    onAuthStateChanged,
    signOut
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

// --- UI Elements ---
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const sendOtpBtn = document.getElementById('send-otp-btn');
const verifyOtpBtn = document.getElementById('verify-otp-btn');
const messageContainer = document.getElementById('message-container');
const headerTitle = document.getElementById('header-title');
const headerSubtitle = document.getElementById('header-subtitle');

// --- 1. Check Login State ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is already signed in
        showSuccessState(user.phoneNumber);
    } else {
        // User is signed out
        showLoginState();
    }
});

// --- 2. Country Code Initialization ---
const phoneInput = window.intlTelInput(document.querySelector("#phone"), {
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    initialCountry: "lk",
    separateDialCode: true,
});

// --- 3. OTP Logic ---
let confirmationResult = null;

async function sendOTP() {
    const phoneNumber = phoneInput.getNumber();
    if (!phoneInput.isValidNumber()) return alert("Invalid number");

    // Setup ReCaptcha
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });
    
    try {
        sendOtpBtn.disabled = true;
        confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        headerTitle.innerText = "Verify OTP";
        showMessage("Code sent to " + phoneNumber, "success");
    } catch (error) {
        alert(error.message);
        sendOtpBtn.disabled = false;
    }
}

async function verifyOTP() {
    const code = document.getElementById('otp-code').value;
    try {
        await confirmationResult.confirm(code);
        // onAuthStateChanged will handle the UI transition
    } catch (error) {
        alert("Wrong code. Try again.");
    }
}

// --- 4. UI Transitions ---
function showSuccessState(phone) {
    step1.classList.add('hidden');
    step2.classList.add('hidden');
    headerTitle.innerText = "Verified! ✅";
    headerTitle.classList.add('text-green-600');
    headerSubtitle.innerText = "Logged in as: " + phone;
    
    // Add a logout button dynamically
    messageContainer.innerHTML = `<button id="logout-btn" class="mt-4 text-red-500 underline">Sign Out</button>`;
    messageContainer.classList.remove('hidden');
    document.getElementById('logout-btn').onclick = () => signOut(auth);
}

function showLoginState() {
    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    headerTitle.innerText = "Secure Verification";
    headerTitle.classList.remove('text-green-600');
    headerSubtitle.innerText = "Enter your mobile number to continue";
    messageContainer.classList.add('hidden');
    sendOtpBtn.disabled = false;
}

function showMessage(msg, type) {
    messageContainer.innerText = msg;
    messageContainer.className = `mt-4 p-3 rounded text-sm ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`;
    messageContainer.classList.remove('hidden');
}

sendOtpBtn.onclick = sendOTP;
verifyOtpBtn.onclick = verifyOTP;
