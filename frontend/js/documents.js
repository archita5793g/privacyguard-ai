const API_URL = "http://localhost:8080/api";

document.addEventListener("DOMContentLoaded", function () {

    console.log("Documents JS loaded");

    setupUpload();
    setupLogout();
    loadDocuments();

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

});


/* =========================================================
   UPLOAD SETUP
========================================================= */

function setupUpload() {

    const fileInput = document.getElementById("documentInput");
    const chooseButton = document.querySelector(".upload-button");
    const uploadButton = document.getElementById("uploadDocumentBtn");
    const selectedFile = document.getElementById("selectedFile");

    if (!fileInput) {
        console.error("documentInput not found");
        return;
    }

    if (!uploadButton) {
        console.error("uploadDocumentBtn not found");
        return;
    }

    if (!selectedFile) {
        console.error("selectedFile not found");
        return;
    }


    /* =====================================================
       FILE SELECT
    ===================================================== */

    fileInput.addEventListener("change", function () {

        const file = fileInput.files[0];

        clearStatus();

        if (!file) {
            selectedFile.innerHTML = "";
            selectedFile.classList.remove("show");
            return;
        }


        /* PDF VALIDATION */

        const isPdf =
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf");

        if (!isPdf) {

            showStatus(
                "Please select a PDF file only.",
                "error"
            );

            fileInput.value = "";
            selectedFile.innerHTML = "";
            selectedFile.classList.remove("show");

            return;
        }


        /* SIZE VALIDATION */

        const maxSize = 10 * 1024 * 1024;

        if (file.size > maxSize) {

            showStatus(
                "File size must be less than 10 MB.",
                "error"
            );

            fileInput.value = "";
            selectedFile.innerHTML = "";
            selectedFile.classList.remove("show");

            return;
        }


        /* SHOW SELECTED FILE */

        selectedFile.innerHTML = `
            <div class="selected-file-content">

                <i data-lucide="file-text"></i>

                <span title="${escapeHtml(file.name)}">
                    ${escapeHtml(file.name)}
                </span>

            </div>
        `;

        selectedFile.classList.add("show");

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }

    });


    /* =====================================================
       UPLOAD BUTTON
    ===================================================== */

    uploadButton.addEventListener("click", async function () {

        const file = fileInput.files[0];

        if (!file) {

            showStatus(
                "Please choose a PDF file first.",
                "error"
            );

            return;
        }

        await uploadDocument(file);

    });

}


/* =========================================================
   UPLOAD DOCUMENT
========================================================= */

async function uploadDocument(file) {

    const fileInput =
        document.getElementById("documentInput");

    const uploadButton =
        document.getElementById("uploadDocumentBtn");

    const selectedFile =
        document.getElementById("selectedFile");


    /* =====================================================
       USER
    ===================================================== */

    const userId =
        localStorage.getItem("userId");


    console.log("=================================");
    console.log("DOCUMENT UPLOAD");
    console.log("User ID:", userId);
    console.log("File:", file.name);
    console.log("=================================");


    if (!userId) {

        showStatus(
            "Please login again. User session not found.",
            "error"
        );

        return;
    }


    /* =====================================================
       FORM DATA
    ===================================================== */

    const formData = new FormData();

    formData.append("userId", userId);

    formData.append(
        "documentName",
        file.name.replace(/\.pdf$/i, "")
    );

    formData.append("file", file);


    /* =====================================================
       BUTTON LOADING
    ===================================================== */

    uploadButton.disabled = true;

    uploadButton.innerHTML = `
        Uploading...
    `;


    try {

        const response = await fetch(
            `${API_URL}/documents/upload`,
            {
                method: "POST",
                body: formData
            }
        );


        console.log(
            "Upload status:",
            response.status
        );


        const text =
            await response.text();


        console.log(
            "Upload response:",
            text
        );


        if (!response.ok) {

            showStatus(
                "Upload failed: " +
                (text || "Server error"),
                "error"
            );

            return;
        }


        /* =================================================
           SUCCESS
        ================================================= */

        showStatus(
            "Document uploaded successfully!",
            "success"
        );


        fileInput.value = "";

        selectedFile.innerHTML = "";

        selectedFile.classList.remove("show");


        /* LOAD NEW DOCUMENT */

        await loadDocuments();


    } catch (error) {

        console.error(
            "Upload error:",
            error
        );

        showStatus(
            "Cannot connect to Spring Boot backend.",
            "error"
        );

    } finally {

        uploadButton.disabled = false;

        uploadButton.innerHTML = `
            <i data-lucide="upload"></i>
            Upload Document
        `;

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }

    }

}


/* =========================================================
   LOAD DOCUMENTS
========================================================= */

async function loadDocuments() {

    const grid =
        document.getElementById("documentsGrid");


    if (!grid) {

        console.error(
            "documentsGrid not found"
        );

        return;
    }


    const userId =
        localStorage.getItem("userId");


    console.log(
        "Loading documents for:",
        userId
    );


    if (!userId) {

        grid.innerHTML = `
            <div class="panel">
                Please login to view your documents.
            </div>
        `;

        return;
    }


    /* LOADING */

    grid.innerHTML = `
        <div
            class="panel"
            style="
                grid-column:1/-1;
                text-align:center;
            ">

            Loading documents...

        </div>
    `;


    try {

        const response = await fetch(
            `${API_URL}/documents/user/${userId}`
        );


        console.log(
            "Documents status:",
            response.status
        );


        const text =
            await response.text();


        console.log(
            "Documents response:",
            text
        );


        if (!response.ok) {

            grid.innerHTML = `
                <div
                    class="panel"
                    style="
                        grid-column:1/-1;
                        text-align:center;
                    ">

                    Unable to load documents.

                </div>
            `;

            return;
        }


        let documents;


        try {

            documents =
                JSON.parse(text);

        } catch (error) {

            console.error(
                "JSON error:",
                error
            );

            grid.innerHTML = `
                <div
                    class="panel"
                    style="
                        grid-column:1/-1;
                        text-align:center;
                    ">

                    Invalid response from server.

                </div>
            `;

            return;
        }


        console.log(
            "Documents:",
            documents
        );


        /* =================================================
           EMPTY
        ================================================= */

        if (
            !Array.isArray(documents) ||
            documents.length === 0
        ) {

            grid.innerHTML = `
                <div
                    class="panel"
                    style="
                        grid-column:1/-1;
                        text-align:center;
                        padding:35px;
                    ">

                    <i
                        data-lucide="file-x"
                        style="
                            width:40px;
                            height:40px;
                            margin-bottom:12px;
                        ">
                    </i>

                    <p>
                        No documents uploaded yet.
                    </p>

                </div>
            `;

            if (typeof lucide !== "undefined") {
                lucide.createIcons();
            }

            return;
        }


        /* =================================================
           DISPLAY
        ================================================= */

        grid.innerHTML = "";


        documents.forEach(function (doc) {

            grid.insertAdjacentHTML(
                "beforeend",
                createDocumentCard(doc)
            );

        });


        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }

    } catch (error) {

        console.error(
            "Load documents error:",
            error
        );

        grid.innerHTML = `
            <div
                class="panel"
                style="
                    grid-column:1/-1;
                    text-align:center;
                ">

                Cannot connect to backend.

            </div>
        `;

    }

}


/* =========================================================
   DOCUMENT CARD
========================================================= */

function createDocumentCard(doc) {

    const id =
        doc.id;


    const name =
        doc.documentName ||
        doc.fileName ||
        "Untitled Document";


    const fileName =
        doc.fileName ||
        "PDF Document";


    return `
        <div class="document-card">

            <div class="document-icon">

                <i data-lucide="file-text"></i>

            </div>


            <div class="document-info">

                <strong
                    title="${escapeHtml(name)}">

                    ${escapeHtml(name)}

                </strong>

                <span
                    title="${escapeHtml(fileName)}">

                    ${escapeHtml(fileName)}

                </span>

            </div>


            <span class="secure-badge">

                <i data-lucide="shield-check"></i>

                Secure

            </span>


            <button
                type="button"
                class="document-more"
                onclick="deleteDocument(${id})"
                title="Delete document">

                <i data-lucide="trash-2"></i>

            </button>

        </div>
    `;

}


/* =========================================================
   DELETE DOCUMENT
========================================================= */

async function deleteDocument(id) {

    if (!id) {
        return;
    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this document?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/documents/${id}`,
                {
                    method: "DELETE"
                }
            );


        const text =
            await response.text();


        console.log(
            "Delete response:",
            text
        );


        if (!response.ok) {

            showStatus(
                "Unable to delete document.",
                "error"
            );

            return;
        }


        showStatus(
            "Document deleted successfully.",
            "success"
        );


        await loadDocuments();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );

        showStatus(
            "Cannot connect to backend.",
            "error"
        );

    }

}


/* =========================================================
   STATUS MESSAGE
========================================================= */

function showStatus(message, type) {

    const status =
        document.getElementById("uploadStatus");


    if (!status) {
        return;
    }


    status.textContent =
        message;


    status.style.display =
        message ? "block" : "none";


    if (type === "success") {

        status.style.color =
            "#059669";

    } else {

        status.style.color =
            "#dc2626";

    }

}


/* =========================================================
   CLEAR STATUS
========================================================= */

function clearStatus() {

    const status =
        document.getElementById("uploadStatus");


    if (!status) {
        return;
    }


    status.textContent = "";

    status.style.display = "none";

}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    const logoutBtn =
        document.getElementById("logoutBtn");


    if (!logoutBtn) {
        return;
    }


    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            localStorage.removeItem("email");

            window.location.href =
                "index.html";

        }
    );

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}