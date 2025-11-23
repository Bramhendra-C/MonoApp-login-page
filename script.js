document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. INITIALIZATION & SELECTORS
    // =========================================
    const flipper = document.getElementById('bookFlipper');
    
    // Forms
    const loginFormContainer = document.getElementById('loginFormContainer'); // New ID added in HTML
    const registerForm = document.getElementById('registerFormContainer');
    const resetForm = document.getElementById('resetFormContainer');
    const loginFormElement = document.getElementById('loginForm');

    // Navigation Triggers
    const goRegisterLink = document.getElementById('goRegister');
    const goResetLink = document.getElementById('goReset');
    const goLoginFromRegLink = document.getElementById('goLoginFromReg');
    const goLoginFromResetLink = document.getElementById('goLoginFromReset');

    // Story Elements
    const storyBtn = document.getElementById('btnShowStory');
    const closeStoryBtn = document.getElementById('btnCloseStory');
    const storyOverlay = document.getElementById('storyOverlay');

    // OTP Elements
    const btnGetOTP = document.getElementById('btnGetOTP');
    const otpContainer = document.getElementById('otpFieldContainer');
    const otpMsg = document.getElementById('otpSentMsg');
    const otpInput = document.getElementById('reg-otp');

    // Runaway Buttons
    const btnRegister = document.getElementById('btnRegister');
    const btnLogin = document.getElementById('btnLogin');

    // =========================================
    // 2. PAGE FLIPPER LOGIC
    // =========================================
    
    function showRegister() {
        flipper.classList.add('is-flipped');
        registerForm.classList.add('is-active');
        
        // Ensure the front page resets if we come back
        setTimeout(() => {
            loginFormContainer.classList.add('is-active');
            resetForm.classList.remove('is-active');
        }, 500);
    }

    function showReset() {
        // DO NOT FLIP. Just swap the forms on the front face.
        flipper.classList.remove('is-flipped');
        
        // Hide Login, Show Reset
        loginFormContainer.classList.remove('is-active');
        resetForm.classList.add('is-active');
    }

    function showLogin() {
        // This is primarily for coming back from the "Back Face" (Register)
        flipper.classList.remove('is-flipped');
        
        // Ensure Login is valid
        loginFormContainer.classList.add('is-active');
        resetForm.classList.remove('is-active');
    }

    function showLoginFromReset() {
        // Swap back to Login on the same face
        resetForm.classList.remove('is-active');
        loginFormContainer.classList.add('is-active');
    }

    // 3D Tilt Effect
    document.addEventListener("mousemove", (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 40;
        const y = (window.innerHeight / 2 - e.clientY) / 40;
        const container = document.querySelector(".perspective-container");
        if(container) {
            container.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        }
    });

    goRegisterLink.addEventListener('click', showRegister);
    goResetLink.addEventListener('click', showReset);
    goLoginFromRegLink.addEventListener('click', showLogin);
    goLoginFromResetLink.addEventListener('click', showLoginFromReset);


    // =========================================
    // 3. STORY OVERLAY LOGIC
    // =========================================
    if (storyBtn && storyOverlay) {
        storyBtn.addEventListener('click', () => {
            storyOverlay.classList.remove('translate-y-full', 'opacity-0'); 
        });
    }
    if (closeStoryBtn && storyOverlay) {
        closeStoryBtn.addEventListener('click', () => {
            storyOverlay.classList.add('translate-y-full', 'opacity-0');
        });
    }


    // =========================================
    // 4. OTP FIELD LOGIC
    // =========================================
    if (btnGetOTP) {
        btnGetOTP.addEventListener('click', () => {
            otpContainer.classList.remove('hidden');
            otpMsg.classList.remove('hidden');
            btnGetOTP.textContent = "Resend";
            btnGetOTP.classList.replace('bg-blue-100', 'bg-gray-200');
            btnGetOTP.classList.replace('text-blue-700', 'text-gray-600');
            if(otpInput) otpInput.focus();
        });
    }


    // =========================================
    // 5. GENERIC "MOVE ANYWHERE" LOGIC
    // =========================================

    /**
     * Calculates boundaries and moves button anywhere in the form
     */
    function handleRunawayButton(btn, formEl, validationFn) {
        if (!btn || !formEl) return;

        const wrapper = btn.parentElement; 
        let lastMoveTime = 0 , count = 0;
        const passwordField = document.getElementById('login-password');

        const shift = (e) => {
            if (validationFn()) {
                btn.style.transform = 'translate(0, 0) rotate(0deg)'; 
                btn.style.cursor = 'pointer';
                return;
            }

            const now = Date.now();
            if (now - lastMoveTime < 100) return; 
            lastMoveTime = now;

            const formRect = formEl.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();
            const passRect = passwordField ? passwordField.getBoundingClientRect() : formRect;
            
            const padding = 10; 

            const minX = (formRect.left + padding) - wrapperRect.left;
            const maxX = (formRect.right - padding) - wrapperRect.right;
            
            const minY = (passRect.bottom + padding) - wrapperRect.top;
            const maxY = (formRect.bottom - padding) - wrapperRect.bottom;

            const safeZoneCenterX = wrapperRect.left + ((maxX + minX) / 2); 
            const safeZoneCenterY = wrapperRect.top + ((maxY + minY) / 2);

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            let targetMinX, targetMaxX, targetMinY, targetMaxY;

            if (mouseX < safeZoneCenterX) {
                targetMinX = maxX - (maxX - minX) * 0.2; 
                targetMaxX = maxX;
            } 
            else {
                targetMinX = minX;
                targetMaxX = minX + (maxX - minX) * 0.2;
            }

            if (mouseY < safeZoneCenterY) {
                targetMinY = maxY - (maxY - minY) * 0.2;
                targetMaxY = maxY;
            } 
            else {
                targetMinY = minY;
                targetMaxY = minY + (maxY - minY) * 0.2;
            }

            const targetX = Math.random() * (targetMaxX - targetMinX) + targetMinX;
            const targetY = Math.random() * (targetMaxY - targetMinY) + targetMinY;

            const randomRotate = Math.floor(Math.random() * 60) - 30; 
            
            // Simple erratic movement pattern
            if(count%2===0){
                btn.style.transform = `translate(${targetX}px, ${targetY}px) rotate(${randomRotate}deg)`;
            } else {
                btn.style.transform = `translate(${targetY-targetX}px, ${-targetY}px) rotate(${randomRotate}deg)`;
            }
            btn.style.cursor = 'not-allowed';
            count++;
        };

        btn.addEventListener('mouseover', shift);
    }

    function restoreOnInput(formEl, btn, validationFn) {
        if (!formEl || !btn) return;
        
        formEl.addEventListener('input', () => {
            if (validationFn()) {
                btn.style.transform = 'translate(0, 0) rotate(0deg)';
                btn.classList.remove('bg-gray-400');
                btn.classList.add('bg-blue-600');
                btn.style.cursor = 'pointer';
            }
        });
    }

    // --- SETUP VALIDATION ---
    function checkLoginValidity() {
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-password').value.trim();
        return email && pass;
    }

    handleRunawayButton(btnLogin, loginFormElement, checkLoginValidity);
    restoreOnInput(loginFormElement, btnLogin, checkLoginValidity);
});