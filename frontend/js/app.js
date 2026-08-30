/* =========================================================
   PRIVACYGUARD AI - APP.JS
   Login + Register
========================================================= */

const API_URL = "http://localhost:8080/api";


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("PrivacyGuard AI loaded");

    setupAuthSwitch();

    setupPasswordToggle(
        "loginPassword",
        "loginPasswordToggle"
    );

    setupPasswordToggle(
        "registerPassword",
        "registerPasswordToggle"
    );

    setupLogin();

    setupRegister();

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
});


/* =========================================================
   LOGIN / REGISTER SWITCH
========================================================= */

function setupAuthSwitch() {

    const loginSection =
        document.getElementById("loginSection");

    const registerSection =
        document.getElementById("registerSection");

    const showRegister =
        document.getElementById("showRegister");

    const showLogin =
        document.getElementById("showLogin");


    if (!loginSection || !registerSection) {
        return;
    }


    if (showRegister) {

        showRegister.addEventListener("click", function () {

            loginSection.classList.add("hidden");

            registerSection.classList.remove("hidden");

            clearMessage("loginMessage");

            clearMessage("registerMessage");

            refreshIcons();
        });
    }


    if (showLogin) {

        showLogin.addEventListener("click", function () {

            registerSection.classList.add("hidden");

            loginSection.classList.remove("hidden");

            clearMessage("loginMessage");

            clearMessage("registerMessage");

            refreshIcons();
        });
    }
}


/* =========================================================
   PASSWORD SHOW / HIDE
========================================================= */

function setupPasswordToggle(inputId, buttonId) {

    const input =
        document.getElementById(inputId);

    const button =
        document.getElementById(buttonId);


    if (!input || !button) {
        return;
    }


    button.addEventListener("click", function () {

        if (input.type === "password") {

            input.type = "text";

            button.innerHTML =
                '<i data-lucide="eye-off"></i>';

        } else {

            input.type = "password";

            button.innerHTML =
                '<i data-lucide="eye"></i>';
        }

        refreshIcons();
    });
}


/* =========================================================
   LOGIN
========================================================= */

function setupLogin() {

    const form =
        document.getElementById("loginForm");


    if (!form) {
        console.error("loginForm not found");
        return;
    }


    form.addEventListener("submit", async function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim();


        const password =
            document
                .getElementById("loginPassword")
                .value;


        const message =
            document.getElementById("loginMessage");


        /* VALIDATION */

        if (!email || !password) {

            showMessage(
                message,
                "Please enter email and password.",
                "error"
            );

            return;
        }


        const button =
            form.querySelector(".login-submit");


        setButtonLoading(
            button,
            true,
            "Signing in..."
        );


        clearMessage("loginMessage");


        try {

            console.log("Sending login request...");


            const response =
                await fetch(
                    `${API_URL}/auth/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );


            const responseText =
                await response.text();


            console.log(
                "Login status:",
                response.status
            );


            console.log(
                "Login response:",
                responseText
            );


            let data = null;


            try {

                data =
                    responseText
                        ? JSON.parse(responseText)
                        : null;

            } catch (error) {

                data = responseText;
            }


            /* LOGIN ERROR */

            if (!response.ok) {

                let errorMessage =
                    "Invalid email or password.";


                if (
                    data &&
                    typeof data === "object"
                ) {

                    errorMessage =
                        data.message ||
                        data.error ||
                        data.msg ||
                        errorMessage;

                } else if (
                    typeof data === "string" &&
                    data.trim()
                ) {

                    errorMessage =
                        data;
                }


                showMessage(
                    message,
                    errorMessage,
                    "error"
                );

                return;
            }


            /* GET USER DATA */

            const userId =
                data?.userId ??
                data?.id ??
                data?.user?.id;


            const username =
                data?.username ??
                data?.name ??
                data?.user?.username ??
                data?.user?.name ??
                email.split("@")[0];


            const userEmail =
                data?.email ??
                data?.user?.email ??
                email;


            /* SAVE USER DATA */

            if (
                userId !== undefined &&
                userId !== null
            ) {

                localStorage.setItem(
                    "userId",
                    String(userId)
                );
            }


            localStorage.setItem(
                "username",
                username
            );


            localStorage.setItem(
                "email",
                userEmail
            );


            localStorage.setItem(
                "isLoggedIn",
                "true"
            );


            showMessage(
                message,
                "Login successful! Redirecting...",
                "success"
            );


            /* REDIRECT */

            setTimeout(function () {

                window.location.href =
                    "dashboard.html";

            }, 700);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            showMessage(
                message,
                "Cannot connect to server. Make sure Spring Boot is running on port 8080.",
                "error"
            );


        } finally {

            setButtonLoading(
                button,
                false,
                "Sign In"
            );
        }

    });
}


/* =========================================================
   REGISTER
========================================================= */

function setupRegister() {

    const form =
        document.getElementById("registerForm");


    if (!form) {

        console.error(
            "registerForm not found"
        );

        return;
    }


    form.addEventListener("submit", async function (event) {

        event.preventDefault();


        /* GET FORM VALUES */

        const name =
            document
                .getElementById("registerUsername")
                .value
                .trim();


        const email =
            document
                .getElementById("registerEmail")
                .value
                .trim();


        const password =
            document
                .getElementById("registerPassword")
                .value;


        const message =
            document.getElementById(
                "registerMessage"
            );


        /* VALIDATION */

        if (!name || !email || !password) {

            showMessage(
                message,
                "Please fill in all fields.",
                "error"
            );

            return;
        }


        if (name.length < 2) {

            showMessage(
                message,
                "Please enter a valid name.",
                "error"
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                message,
                "Password must contain at least 6 characters.",
                "error"
            );

            return;
        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            showMessage(
                message,
                "Please enter a valid email address.",
                "error"
            );

            return;
        }


        const button =
            form.querySelector(".login-submit");


        setButtonLoading(
            button,
            true,
            "Creating account..."
        );


        clearMessage(
            "registerMessage"
        );


        try {

            console.log(
                "Sending registration request..."
            );


            /* IMPORTANT:
               Backend expects:
               name
               email
               password
            */

            const response =
                await fetch(
                    `${API_URL}/auth/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            email: email,

                            password: password

                        })
                    }
                );


            const responseText =
                await response.text();


            console.log(
                "Register status:",
                response.status
            );


            console.log(
                "Register response:",
                responseText
            );


            let data = null;


            try {

                data =
                    responseText
                        ? JSON.parse(responseText)
                        : null;

            } catch (error) {

                data = responseText;
            }


            /* REGISTRATION ERROR */

            if (!response.ok) {

                let errorMessage =
                    "Registration failed.";


                if (
                    data &&
                    typeof data === "object"
                ) {

                    errorMessage =
                        data.message ||
                        data.error ||
                        data.msg ||
                        errorMessage;

                } else if (
                    typeof data === "string" &&
                    data.trim()
                ) {

                    errorMessage =
                        data;
                }


                showMessage(
                    message,
                    errorMessage,
                    "error"
                );

                return;
            }


            /* SUCCESS */

            showMessage(
                message,
                "Account created successfully! Please sign in.",
                "success"
            );


            /* CLEAR FORM */

            form.reset();


            /* SWITCH TO LOGIN */

            setTimeout(function () {

                const loginSection =
                    document.getElementById(
                        "loginSection"
                    );


                const registerSection =
                    document.getElementById(
                        "registerSection"
                    );


                if (
                    registerSection &&
                    loginSection
                ) {

                    registerSection.classList.add(
                        "hidden"
                    );

                    loginSection.classList.remove(
                        "hidden"
                    );
                }


                /* PUT EMAIL IN LOGIN */

                const loginEmail =
                    document.getElementById(
                        "loginEmail"
                    );


                if (loginEmail) {

                    loginEmail.value =
                        email;
                }


                clearMessage(
                    "registerMessage"
                );


                refreshIcons();


            }, 1000);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            showMessage(
                message,
                "Cannot connect to server. Make sure Spring Boot is running on port 8080.",
                "error"
            );


        } finally {

            setButtonLoading(
                button,
                false,
                "Create Account"
            );
        }

    });
}


/* =========================================================
   SHOW MESSAGE
========================================================= */

function showMessage(
    element,
    text,
    type
) {

    if (!element) {
        return;
    }


    element.textContent =
        text;


    element.className =
        "login-message " + type;


    element.style.display =
        "block";
}


/* =========================================================
   CLEAR MESSAGE
========================================================= */

function clearMessage(elementId) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    element.textContent =
        "";


    element.className =
        "login-message";


    element.style.display =
        "none";
}


/* =========================================================
   BUTTON LOADING
========================================================= */

function setButtonLoading(
    button,
    loading,
    text
) {

    if (!button) {
        return;
    }


    button.disabled =
        loading;


    if (loading) {

        button.innerHTML = `
            <span>${text}</span>
            <span class="button-loader"></span>
        `;

    } else {

        button.innerHTML = `
            <span>${text}</span>
            <i data-lucide="arrow-right"></i>
        `;

        refreshIcons();
    }
}


/* =========================================================
   LUCIDE ICONS
========================================================= */

function refreshIcons() {

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}


/* =========================================================
   LOGIN CHECK
========================================================= */

function isLoggedIn() {

    return (
        localStorage.getItem("isLoggedIn") === "true"
    );
}