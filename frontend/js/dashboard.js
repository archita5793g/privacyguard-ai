const API_URL = "http://localhost:8080/api";


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("================================");
    console.log("PRIVACYGUARD AI DASHBOARD");
    console.log("================================");

    loadUser();
    loadDocumentCount();
    loadPrivacyScore();
    setupSecurityScan();
    setupLogout();

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

});


/* =========================================================
   GET USER ID
========================================================= */

function getUserId() {

    const userId = localStorage.getItem("userId");

    console.log("Current User ID:", userId);

    return userId;
}


/* =========================================================
   LOAD USER
========================================================= */

function loadUser() {

    const username =
        localStorage.getItem("username");

    const usernameElement =
        document.getElementById("username");

    const welcomeElement =
        document.getElementById("welcomeName");


    if (username) {

        if (usernameElement) {
            usernameElement.textContent = username;
        }

        if (welcomeElement) {
            welcomeElement.textContent = username;
        }

    }

}


/* =========================================================
   DOCUMENT COUNT
========================================================= */

async function loadDocumentCount() {

    const element =
        document.getElementById("documentCount");

    if (!element) {

        console.error(
            "documentCount element not found"
        );

        return;
    }


    const userId = getUserId();


    if (!userId) {

        element.textContent = "0";

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/documents/count/${userId}`
            );


        console.log(
            "Document count status:",
            response.status
        );


        if (!response.ok) {

            console.error(
                "Document count failed:",
                response.status
            );

            element.textContent = "0";

            return;
        }


        const text =
            await response.text();


        const count =
            parseInt(text, 10);


        if (Number.isNaN(count)) {

            element.textContent = "0";

            return;
        }


        element.textContent =
            count;


        console.log(
            "Secure Documents:",
            count
        );

    }
    catch (error) {

        console.error(
            "Document count error:",
            error
        );

        element.textContent = "0";

    }

}


/* =========================================================
   PRIVACY SCORE
========================================================= */

async function loadPrivacyScore() {

    const scoreElement =
        document.getElementById("privacyScore");

    const progressElement =
        document.getElementById("privacyProgress");

    const riskElement =
        document.getElementById("riskLevel");


    if (!scoreElement) {

        console.error(
            "privacyScore element not found"
        );

        return;
    }


    const userId =
        getUserId();


    if (!userId) {

        updatePrivacyUI(
            0,
            scoreElement,
            progressElement,
            riskElement
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/privacy-score/${userId}`
            );


        console.log(
            "Privacy score status:",
            response.status
        );


        if (!response.ok) {

            console.warn(
                "Privacy score endpoint returned:",
                response.status
            );


            updatePrivacyUI(
                0,
                scoreElement,
                progressElement,
                riskElement
            );

            return;
        }


        const text =
            await response.text();


        const score =
            parseInt(text, 10);


        if (Number.isNaN(score)) {

            updatePrivacyUI(
                0,
                scoreElement,
                progressElement,
                riskElement
            );

            return;
        }


        updatePrivacyUI(
            score,
            scoreElement,
            progressElement,
            riskElement
        );


        console.log(
            "Privacy Score:",
            score
        );

    }
    catch (error) {

        console.error(
            "Privacy score error:",
            error
        );


        updatePrivacyUI(
            0,
            scoreElement,
            progressElement,
            riskElement
        );

    }

}


/* =========================================================
   UPDATE PRIVACY UI
========================================================= */

function updatePrivacyUI(
    score,
    scoreElement,
    progressElement,
    riskElement
) {

    /*
     * Keep score between 0 and 100
     */

    score =
        Math.max(
            0,
            Math.min(
                100,
                score
            )
        );


    scoreElement.textContent =
        score;


    if (progressElement) {

        progressElement.style.width =
            score + "%";

    }


    if (riskElement) {

        if (score >= 80) {

            riskElement.textContent =
                "LOW";

        }
        else if (score >= 50) {

            riskElement.textContent =
                "MEDIUM";

        }
        else {

            riskElement.textContent =
                "HIGH";

        }

    }

}


/* =========================================================
   SECURITY SCAN
========================================================= */

function setupSecurityScan() {

    /*
     * YOUR HTML USES:
     *
     * id="scanButton"
     *
     * NOT securityScanBtn
     */

    const scanButton =
        document.getElementById("scanButton");


    if (!scanButton) {

        console.error(
            "scanButton NOT FOUND in dashboard.html"
        );

        return;
    }


    console.log(
        "Security Scan button connected"
    );


    scanButton.addEventListener(
        "click",
        runSecurityScan
    );

}


/* =========================================================
   RUN SECURITY SCAN
========================================================= */

async function runSecurityScan() {

    const scanButton =
        document.getElementById("scanButton");


    if (!scanButton) {
        return;
    }


    const userId =
        getUserId();


    if (!userId) {

        alert(
            "Please login again."
        );

        return;
    }


    console.log(
        "Security Scan Started"
    );


    /*
     * Save original button
     */

    const originalButton =
        scanButton.innerHTML;


    /*
     * Disable button
     */

    scanButton.disabled =
        true;


    scanButton.innerHTML = `
        <i data-lucide="loader-2"></i>
        Scanning...
    `;


    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }


    try {

        /*
         * SECURITY SCAN ENDPOINT
         *
         * Your Spring Boot controller
         * must provide:
         *
         * POST
         * /api/security-scan/{userId}
         */

        const response =
            await fetch(
                `${API_URL}/security-scan/${userId}`,
                {
                    method: "POST"
                }
            );


        console.log(
            "Security Scan HTTP Status:",
            response.status
        );


        const responseText =
            await response.text();


        console.log(
            "Security Scan Response:",
            responseText
        );


        if (!response.ok) {

            console.error(
                "Security scan failed:",
                response.status,
                responseText
            );


            alert(
                "Security scan failed.\n\n" +
                "Server status: " +
                response.status
            );


            return;
        }


        /*
         * SUCCESS
         */

        alert(
            "✓ Security scan completed successfully!"
        );


        /*
         * Reload dashboard data
         */

        await loadDocumentCount();

        await loadPrivacyScore();


        console.log(
            "Security Scan Completed"
        );

    }
    catch (error) {

        console.error(
            "Security scan connection error:",
            error
        );


        alert(
            "Cannot connect to backend.\n\n" +
            "Please make sure Spring Boot is running on port 8080."
        );

    }
    finally {

        /*
         * Restore button
         */

        scanButton.disabled =
            false;


        scanButton.innerHTML =
            originalButton;


        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    const logoutButton =
        document.getElementById("logoutBtn");


    if (!logoutButton) {

        console.warn(
            "logoutBtn not found"
        );

        return;
    }


    logoutButton.addEventListener(
        "click",
        function () {

            console.log(
                "Logging out..."
            );


            localStorage.removeItem(
                "userId"
            );

            localStorage.removeItem(
                "username"
            );

            localStorage.removeItem(
                "email"
            );


            window.location.href =
                "index.html";

        }
    );

}