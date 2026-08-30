const API_URL =
    "http://localhost:8080/api";

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById("chatForm");

        const input =
            document.getElementById("chatInput");

        const messages =
            document.getElementById("chatMessages");


        if (!form) {
            return;
        }


        /* SUGGESTIONS */

        document
            .querySelectorAll(".suggestions button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        input.value =
                            button.textContent.trim();

                        input.focus();

                    }
                );

            });


        /* SEND MESSAGE */

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const question =
                    input.value.trim();


                if (!question) {
                    return;
                }


                addMessage(
                    question,
                    "user"
                );


                input.value = "";


                showTyping();


                try {

                    const response =
                        await fetch(
                            `${API_URL}/ai/ask`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    question
                                })
                            }
                        );


                    removeTyping();


                    if (!response.ok) {
                        throw new Error();
                    }


                    const data =
                        await response.json();


                    addMessage(
                        data.answer ||
                        data.response ||
                        "I couldn't generate a response.",
                        "ai"
                    );


                } catch (error) {

                    removeTyping();


                    /*
                     * Temporary frontend response.
                     * Replace when AI backend is connected.
                     */

                    addMessage(
                        getDemoResponse(question),
                        "ai"
                    );

                }

            }
        );


        function addMessage(
            text,
            type
        ) {

            const message =
                document.createElement("div");


            message.className =
                `message ${
                    type === "user"
                        ? "user-message"
                        : "ai-message"
                }`;


            message.innerHTML = `

                <div class="message-avatar">

                    <i data-lucide="${
                        type === "user"
                            ? "user"
                            : "bot"
                    }"></i>

                </div>

                <div class="message-content">

                    <p>${escapeHTML(text)}</p>

                </div>

            `;


            messages.appendChild(message);

            lucide.createIcons();


            messages.scrollTop =
                messages.scrollHeight;

        }


        function showTyping() {

            const typing =
                document.createElement("div");

            typing.id =
                "typingMessage";

            typing.className =
                "message ai-message";

            typing.innerHTML = `

                <div class="message-avatar">
                    <i data-lucide="bot"></i>
                </div>

                <div class="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

            `;

            messages.appendChild(typing);

            lucide.createIcons();

            messages.scrollTop =
                messages.scrollHeight;

        }


        function removeTyping() {

            const typing =
                document.getElementById(
                    "typingMessage"
                );

            if (typing) {
                typing.remove();
            }

        }

    }
);


/* DEMO RESPONSE */

function getDemoResponse(question) {

    const text =
        question.toLowerCase();


    if (
        text.includes("aadhaar")
    ) {

        return `
            Avoid sharing your full Aadhaar number unless
            it is required. Prefer masked Aadhaar where
            possible and only share it with trusted entities.
        `;

    }


    if (
        text.includes("document")
    ) {

        return `
            Before sharing a document, check whether it
            contains unnecessary personal information such
            as ID numbers, addresses or phone numbers.
        `;

    }


    return `
        Based on your question, I recommend checking what
        personal information is being shared, who will
        receive it, and whether sharing it is actually
        necessary.
    `;

}


/* SECURITY */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}