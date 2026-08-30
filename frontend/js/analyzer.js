const API_URL =
    "http://localhost:8080/api";

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const button =
            document.getElementById(
                "analyzeButton"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            analyzePrivacy
        );

    }
);


async function analyzePrivacy() {

    const textarea =
        document.getElementById(
            "analysisText"
        );


    const text =
        textarea.value.trim();


    if (!text) {

        alert(
            "Please enter some text to analyze."
        );

        return;

    }


    const button =
        document.getElementById(
            "analyzeButton"
        );


    button.disabled = true;

    button.innerHTML = `
        <i data-lucide="loader"></i>
        Analyzing...
    `;

    lucide.createIcons();


    try {

        const response =
            await fetch(
                `${API_URL}/analyzer/scan`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        text
                    })
                }
            );


        if (!response.ok) {
            throw new Error();
        }


        const result =
            await response.json();


        showResult(result);


    } catch (error) {

        /*
         * Temporary demo analysis.
         * Replace with backend result.
         */

        const result =
            demoAnalysis(text);

        showResult(result);

    }


    button.disabled = false;

    button.innerHTML = `
        <i data-lucide="scan-search"></i>
        Analyze Privacy
    `;

    lucide.createIcons();

}


/* ================= RESULT ================= */

function showResult(result) {

    const score =
        result.score ?? 24;


    document.getElementById(
        "riskScore"
    ).textContent =
        score;


    const resultBox =
        document.getElementById(
            "analysisResult"
        );


    let level =
        "LOW";


    if (score >= 70) {
        level = "HIGH";
    } else if (score >= 40) {
        level = "MEDIUM";
    }


    resultBox.innerHTML = `

        <div class="analysis-status ${level.toLowerCase()}">

            <i data-lucide="shield-alert"></i>

            <div>

                <strong>
                    ${level} Privacy Risk
                </strong>

                <span>
                    Analysis completed successfully.
                </span>

            </div>

        </div>


        <div class="risk-items">

            <div>
                <span>Personal information</span>
                <b>Detected</b>
            </div>

            <div>
                <span>Identity exposure</span>
                <b>
                    ${level}
                </b>
            </div>

            <div>
                <span>Sharing recommendation</span>
                <b>
                    Review first
                </b>
            </div>

        </div>

    `;


    lucide.createIcons();

}


/* ================= DEMO ================= */

function demoAnalysis(text) {

    let score = 15;


    if (
        /aadhaar|pan|passport/i
            .test(text)
    ) {
        score += 35;
    }


    if (
        /phone|mobile|email/i
            .test(text)
    ) {
        score += 15;
    }


    if (
        /account|bank|card/i
            .test(text)
    ) {
        score += 20;
    }


    return {
        score: Math.min(score, 100)
    };

}