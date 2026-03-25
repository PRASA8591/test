import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { 
    getAuth, 
    RecaptchaVerifier, 
    signInWithPhoneNumber 
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// Your exact Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCqLFv3F9-3HAS7m7OIyCLD3M86KaRltN4",
    authDomain: "test-project-58ac0.firebaseapp.com",
    projectId: "test-project-58ac0",
    storageBucket: "test-project-58ac0.firebasestorage.app",
    messagingSenderId: "10691087045",
    appId: "1:10691087045:web:92637a0ab765882ce5feac",
    measurementId: "G-YHEPWY3EJC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage(); // Automatically sets SMS language to user's device preference

// Initialize Country Code Picker
const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    initialCountry: "lk", // Default to Sri Lanka, user can still change it
    preferredCountries: ["lk", "us", "gb", "in"],
    separateDialCode: true,
});

// UI Elements
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const sendOtpBtn = document.getElementById('send-otp-btn');
const verifyOtpBtn = document.getElementById('verify-otp-btn');
const resendBtn = document.getElementById('resend-btn');
const timerSpan = document.getElementById('timer');
const messageContainer = document.getElementById('message-container');
const headerTitle = document.getElementById('header-title');
const headerSubtitle = document.getElementById('header-subtitle');

let confirmationResult = null;
let countdownInterval;

// Initialize reCAPTCHA
function setupRecaptcha() {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved
            },
            'expired-callback': () => {
                showMessage("reCAPTCHA expired. Please try again.", "error");
            }
        });
    }
}

// Handle Sending OTP
async function handleSendOtp() {
    if (!phoneInput.isValidNumber()) {
        showMessage("Please enter a valid mobile number.", "error");
        return;
    }

    const phoneNumber = phoneInput.getNumber(); 
    sendOtpBtn.disabled = true;
    sendOtpBtn.innerText = "Sending Securely...";
    hideMessage();

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
        confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        
        // Transition to Step 2
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        headerTitle.innerText = "Check your phone";
        headerSubtitle.innerText = `We sent an SMS with a code to ${phoneNumber}`;
        
        showMessage("OTP Sent Successfully!", "success");
        startResendTimer();

    } catch (error) {
        console.error("SMS Error:", error);
        sendOtpBtn.disabled = false;
        sendOtpBtn.innerText = "Send OTP";
        
        // If it fails, we must reset the recaptcha to try again
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.render().then(function(widgetId) {
                grecaptcha.reset(widgetId);
            });
        }
        
        showMessage(getFriendlyErrorMessage(error.code), "error");
    }
}

// Handle Verifying OTP
async function handleVerifyOtp() {
    const code = document.getElementById('otp-code').value.trim();
    
    if (code.length !== 6) {
        showMessage("Please enter the 6-digit verification code.", "error");
        return;
    }

    verifyOtpBtn.disabled = true;
    verifyOtpBtn.innerText = "Verifying Code...";
    hideMessage();

    try {
        const result = await confirmationResult.confirm(code);
        const user = result.user;
        
        // Success UI State
        step2.classList.add('hidden');
        headerTitle.innerText = "Verified! ✅";
        headerTitle.classList.replace('text-gray-800', 'text-green-600');
        headerSubtitle.innerText = "Your mobile number has been successfully authenticated.";
        showMessage(`System unlocked for: ${user.phoneNumber}`, "success");

    } catch (error) {
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.innerText = "Verify Mobile";
        showMessage("Incorrect code. Please check the SMS and try again.", "error");
    }
}

// Resend Timer Logic
function startResendTimer() {
    let timeLeft = 60;
    resendBtn.disabled = true;
    
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        timeLeft--;
        timerSpan.innerText = `(${timeLeft}s)`;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            resendBtn.disabled = false;
            timerSpan.innerText = "";
        }
    }, 1000);
}

// Utility: Show/Hide Messages
function showMessage(text, type) {
    messageContainer.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
    
    if (type === "error") {
        messageContainer.classList.add('bg-red-100', 'text-red-700');
    } else {
        messageContainer.classList.add('bg-green-100', 'text-green-700');
    }
    
    messageContainer.innerText = text;
}

function hideMessage() {
    messageContainer.classList.add('hidden');
}

// Utility: Friendly Error Messages
function getFriendlyErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/too-many-requests': return "Too many attempts. Please try again later.";
        case 'auth/invalid-phone-number': return "The format of the phone number is invalid.";
        case 'auth/network-request-failed': return "Network error. Please check your internet connection.";
        default: return "An error occurred while sending the SMS. Please try again.";
    }
}

// Event Listeners
sendOtpBtn.addEventListener('click', handleSendOtp);
verifyOtpBtn.addEventListener('click', handleVerifyOtp);
resendBtn.addEventListener('click', handleSendOtp); // Re-uses the send logic