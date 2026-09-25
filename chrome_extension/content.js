// ============================================================
// STACKNAV
// BROWSER NAVIGATION + DSA STACK VISUALIZATION
// ============================================================

let positionIndex = 0;


// ============================================================
// PANEL POSITIONS
// ============================================================

const positions = [

    {
        top: "20px",
        right: "20px",
        bottom: "auto",
        left: "auto"
    },

    {
        top: "20px",
        right: "auto",
        bottom: "auto",
        left: "20px"
    },

    {
        top: "auto",
        right: "auto",
        bottom: "20px",
        left: "20px"
    },

    {
        top: "auto",
        right: "20px",
        bottom: "20px",
        left: "auto"
    }

];


// ============================================================
// SET PANEL POSITION
// ============================================================

function setPanelPosition(panel) {

    const position =
        positions[positionIndex];

    panel.style.top =
        position.top;

    panel.style.right =
        position.right;

    panel.style.bottom =
        position.bottom;

    panel.style.left =
        position.left;
}


// ============================================================
// CREATE NAVIGATION PANEL
// ============================================================

function createNavigationPanel() {

    if (
        document.getElementById(
            "historyStackPanel"
        )
    ) {
        return;
    }


    // ========================================================
    // MAIN PANEL
    // ========================================================

    const panel =
        document.createElement("div");

    panel.id =
        "historyStackPanel";

    panel.style.width =
        "340px";

    panel.style.maxHeight =
        "calc(100vh - 40px)";

    panel.style.overflowY =
        "auto";

    panel.style.boxSizing =
        "border-box";

    panel.style.position =
        "fixed";

    panel.style.zIndex =
        "2147483647";

    setPanelPosition(panel);


    // ========================================================
    // NEW COLORFUL DESIGN
    // ========================================================

    panel.style.background =
        "linear-gradient(145deg,#f8fbff,#eef4ff 45%,#f8f0ff)";

    panel.style.color =
        "#172033";

    panel.style.border =
        "2px solid rgba(99,102,241,0.28)";

    panel.style.borderRadius =
        "20px";

    panel.style.boxShadow =
        "0 18px 45px rgba(31,41,90,0.30)";

    panel.style.padding =
        "13px";

    panel.style.fontFamily =
        "Arial,sans-serif";

    panel.style.backdropFilter =
        "blur(12px)";

    panel.style.scrollbarWidth =
        "thin";


    // ========================================================
    // HEADER
    // ========================================================

    const header =
        document.createElement("div");

    header.style.display =
        "flex";

    header.style.alignItems =
        "center";

    header.style.justifyContent =
        "space-between";

    header.style.marginBottom =
        "9px";


    // ========================================================
    // STACKNAV TITLE
    // ========================================================

    const title =
        document.createElement("div");

    title.innerHTML =
        "<div style='font-size:19px;font-weight:900;letter-spacing:.4px;'>" +
        "🌐 " +
        "<span style='color:#6366f1;'>STACK</span>" +
        "<span style='color:#06b6d4;'>NAV</span>" +
        "</div>" +

        "<div style='font-size:8px;color:#64748b;margin-top:2px;letter-spacing:1px;'>" +
        "BROWSER NAVIGATION • STACK VISUALIZER" +
        "</div>";

    title.style.whiteSpace =
        "nowrap";


    // ========================================================
    // MOVE BUTTON
    // ========================================================

    const moveButton =
        document.createElement("button");

    moveButton.innerText =
        "↗";

    moveButton.title =
        "Move Board";

    moveButton.style.width =
        "36px";

    moveButton.style.height =
        "31px";

    moveButton.style.border =
        "none";

    moveButton.style.borderRadius =
        "9px";

    moveButton.style.background =
        "linear-gradient(135deg,#6366f1,#06b6d4)";

    moveButton.style.color =
        "white";

    moveButton.style.fontSize =
        "18px";

    moveButton.style.fontWeight =
        "bold";

    moveButton.style.cursor =
        "pointer";

    moveButton.style.boxShadow =
        "0 5px 12px rgba(99,102,241,.30)";

    moveButton.onclick =
        function(event) {

            event.stopPropagation();

            positionIndex++;

            if (
                positionIndex >=
                positions.length
            ) {

                positionIndex = 0;

            }

            setPanelPosition(panel);

        };


    header.appendChild(title);
    header.appendChild(moveButton);

    panel.appendChild(header);


    // ========================================================
    // CURRENT PAGE
    // ========================================================

    const currentCard =
        document.createElement("div");

    currentCard.style.padding =
        "9px";

    currentCard.style.marginBottom =
        "9px";

    currentCard.style.borderRadius =
        "13px";

    currentCard.style.background =
        "linear-gradient(135deg,#6366f1,#06b6d4)";

    currentCard.style.color =
        "white";

    currentCard.style.boxShadow =
        "0 7px 18px rgba(99,102,241,.25)";


    const currentLabel =
        document.createElement("div");

    currentLabel.innerText =
        "● CURRENT PAGE";

    currentLabel.style.fontSize =
        "9px";

    currentLabel.style.fontWeight =
        "bold";

    currentLabel.style.opacity =
        "0.9";


    const currentPage =
        document.createElement("div");

    currentPage.id =
        "currentPageDisplay";

    currentPage.innerText =
        "Loading...";

    currentPage.style.fontSize =
        "15px";

    currentPage.style.fontWeight =
        "bold";

    currentPage.style.marginTop =
        "3px";

    currentPage.style.whiteSpace =
        "nowrap";

    currentPage.style.overflow =
        "hidden";

    currentPage.style.textOverflow =
        "ellipsis";


    currentCard.appendChild(
        currentLabel
    );

    currentCard.appendChild(
        currentPage
    );

    panel.appendChild(
        currentCard
    );


    // ========================================================
    // DSA TITLE
    // ========================================================

    const dsaTitle =
        document.createElement("div");

    dsaTitle.innerText =
        "🧠 STACK VISUALIZATION";

    dsaTitle.style.textAlign =
        "center";

    dsaTitle.style.fontSize =
        "11px";

    dsaTitle.style.fontWeight =
        "bold";

    dsaTitle.style.color =
        "#6366f1";

    dsaTitle.style.marginBottom =
        "6px";

    dsaTitle.style.letterSpacing =
        ".5px";

    panel.appendChild(
        dsaTitle
    );


    // ========================================================
    // STACK CONTAINER
    // ========================================================

    const stacks =
        document.createElement("div");

    stacks.style.display =
        "flex";

    stacks.style.gap =
        "7px";


    // ========================================================
    // CREATE STACK CARD
    // ========================================================

    function createStackCard(
        titleText,
        displayId
    ) {

        const card =
            document.createElement("div");

        card.style.flex =
            "1";

        card.style.background =
            "rgba(255,255,255,.88)";

        card.style.border =
            "1px solid rgba(99,102,241,.18)";

        card.style.borderRadius =
            "11px";

        card.style.padding =
            "7px";

        card.style.boxSizing =
            "border-box";

        card.style.boxShadow =
            "0 4px 12px rgba(50,60,120,.08)";


        const title =
            document.createElement("div");

        title.innerText =
            titleText;

        title.style.fontSize =
            "10px";

        title.style.fontWeight =
            "bold";

        title.style.marginBottom =
            "5px";

        title.style.color =
            "#334155";


        const stackDisplay =
            document.createElement("div");

        stackDisplay.id =
            displayId;

        stackDisplay.style.minHeight =
            "45px";

        stackDisplay.style.maxHeight =
            "70px";

        stackDisplay.style.overflowY =
            "auto";

        stackDisplay.style.fontSize =
            "10px";


        card.appendChild(title);

        card.appendChild(
            stackDisplay
        );

        return card;
    }


    // ========================================================
    // BACK STACK
    // ========================================================

    const backCard =
        createStackCard(
            "⬅ BACK STACK",
            "backStackDisplay"
        );


    // ========================================================
    // FORWARD STACK
    // ========================================================

    const forwardCard =
        createStackCard(
            "FORWARD STACK ➡",
            "forwardStackDisplay"
        );


    stacks.appendChild(
        backCard
    );

    stacks.appendChild(
        forwardCard
    );

    panel.appendChild(
        stacks
    );


    // ========================================================
    // STACK INFORMATION
    // ========================================================

    const stackInfo =
        document.createElement("div");

    stackInfo.style.display =
        "flex";

    stackInfo.style.gap =
        "5px";

    stackInfo.style.marginTop =
        "6px";


    // BACK INFO

    const backInfo =
        document.createElement("div");

    backInfo.id =
        "backStackInfo";

    backInfo.style.flex =
        "1";

    backInfo.style.textAlign =
        "center";

    backInfo.style.fontSize =
        "9px";

    backInfo.style.fontWeight =
        "bold";

    backInfo.style.color =
        "#6366f1";


    // FORWARD INFO

    const forwardInfo =
        document.createElement("div");

    forwardInfo.id =
        "forwardStackInfo";

    forwardInfo.style.flex =
        "1";

    forwardInfo.style.textAlign =
        "center";

    forwardInfo.style.fontSize =
        "9px";

    forwardInfo.style.fontWeight =
        "bold";

    forwardInfo.style.color =
        "#0891b2";


    stackInfo.appendChild(
        backInfo
    );

    stackInfo.appendChild(
        forwardInfo
    );

    panel.appendChild(
        stackInfo
    );


    // ========================================================
    // LIFO INFORMATION
    // ========================================================

    const lifo =
        document.createElement("div");

    lifo.innerText =
        "LIFO • Last In, First Out";

    lifo.style.textAlign =
        "center";

    lifo.style.fontSize =
        "10px";

    lifo.style.fontWeight =
        "bold";

    lifo.style.margin =
        "6px 0";

    lifo.style.color =
        "#6366f1";

    panel.appendChild(
        lifo
    );


    // ========================================================
    // CUSTOM URL
    // ========================================================

    const customUrlBox =
        document.createElement("div");

    customUrlBox.style.background =
        "rgba(255,255,255,.9)";

    customUrlBox.style.border =
        "1px solid rgba(6,182,212,.25)";

    customUrlBox.style.borderRadius =
        "10px";

    customUrlBox.style.padding =
        "7px";

    customUrlBox.style.marginBottom =
        "7px";


    const urlTitle =
        document.createElement("div");

    urlTitle.innerText =
        "🌐 CUSTOM URL";

    urlTitle.style.fontSize =
        "10px";

    urlTitle.style.fontWeight =
        "bold";

    urlTitle.style.color =
        "#0891b2";

    urlTitle.style.marginBottom =
        "5px";


    const urlRow =
        document.createElement("div");

    urlRow.style.display =
        "flex";

    urlRow.style.gap =
        "5px";


    const urlInput =
        document.createElement("input");

    urlInput.id =
        "customUrlInput";

    urlInput.type =
        "text";

    urlInput.placeholder =
        "https://example.com";

    urlInput.style.flex =
        "1";

    urlInput.style.minWidth =
        "0";

    urlInput.style.padding =
        "7px";

    urlInput.style.border =
        "1px solid #cbd5e1";

    urlInput.style.borderRadius =
        "7px";

    urlInput.style.outline =
        "none";

    urlInput.style.fontSize =
        "10px";

    urlInput.style.boxSizing =
        "border-box";


    const visitButton =
        document.createElement("button");

    visitButton.innerText =
        "Visit";

    visitButton.style.padding =
        "6px 9px";

    visitButton.style.border =
        "none";

    visitButton.style.borderRadius =
        "7px";

    visitButton.style.background =
        "linear-gradient(135deg,#06b6d4,#3b82f6)";

    visitButton.style.color =
        "white";

    visitButton.style.fontWeight =
        "bold";

    visitButton.style.cursor =
        "pointer";

    visitButton.style.fontSize =
        "10px";


    function visitCustomUrl() {

        let url =
            urlInput.value.trim();

        if (!url) {
            return;
        }

        if (
            !url.startsWith("http://") &&
            !url.startsWith("https://")
        ) {

            url =
                "https://" + url;

        }

        chrome.runtime.sendMessage({

            action:
                "customUrl",

            url:
                url

        });

    }


    visitButton.onclick =
        function(event) {

            event.stopPropagation();

            visitCustomUrl();

        };


    urlInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key ===
                "Enter"
            ) {

                visitCustomUrl();

            }

        }
    );


    urlRow.appendChild(
        urlInput
    );

    urlRow.appendChild(
        visitButton
    );

    customUrlBox.appendChild(
        urlTitle
    );

    customUrlBox.appendChild(
        urlRow
    );

    panel.appendChild(
        customUrlBox
    );


    // ========================================================
    // OPERATION LOG
    // ========================================================

    const logTitle =
        document.createElement("div");

    logTitle.innerText =
        "📝 OPERATION LOG";

    logTitle.style.fontSize =
        "11px";

    logTitle.style.fontWeight =
        "bold";

    logTitle.style.color =
        "#6366f1";

    logTitle.style.margin =
        "6px 0 4px";


    const operationLog =
        document.createElement("div");

    operationLog.id =
        "operationLogDisplay";

    operationLog.style.background =
        "rgba(255,255,255,.9)";

    operationLog.style.border =
        "1px solid #dbe2f0";

    operationLog.style.borderRadius =
        "8px";

    operationLog.style.padding =
        "6px";

    operationLog.style.maxHeight =
        "55px";

    operationLog.style.overflowY =
        "auto";

    operationLog.style.fontSize =
        "10px";

    operationLog.innerText =
        "No operations yet";


    panel.appendChild(
        logTitle
    );

    panel.appendChild(
        operationLog
    );


    // ========================================================
    // STACK STATISTICS
    // ========================================================

    const statisticsTitle =
        document.createElement("div");

    statisticsTitle.innerText =
        "📊 STACK STATISTICS";

    statisticsTitle.style.fontSize =
        "11px";

    statisticsTitle.style.fontWeight =
        "bold";

    statisticsTitle.style.color =
        "#06b6d4";

    statisticsTitle.style.margin =
        "6px 0 4px";


    panel.appendChild(
        statisticsTitle
    );


    const statsBox =
        document.createElement("div");

    statsBox.id =
        "stackStatisticsDisplay";

    statsBox.style.background =
        "rgba(255,255,255,.9)";

    statsBox.style.border =
        "1px solid #dbe2f0";

    statsBox.style.borderRadius =
        "8px";

    statsBox.style.padding =
        "6px";

    statsBox.style.fontSize =
        "9px";

    statsBox.style.textAlign =
        "center";

    statsBox.style.fontWeight =
        "bold";

    statsBox.innerHTML =
        "Loading statistics...";

    panel.appendChild(
        statsBox
    );


    // ========================================================
    // BUTTON GRID
    // ========================================================

    const buttons =
        document.createElement("div");

    buttons.style.display =
        "grid";

    buttons.style.gridTemplateColumns =
        "1fr 1fr 1fr";

    buttons.style.gap =
        "5px";

    buttons.style.marginTop =
        "8px";


    // ========================================================
    // BUTTON FUNCTION
    // ========================================================

    function createButton(
        text,
        action
    ) {

        const button =
            document.createElement("button");

        button.innerText =
            text;

        button.style.padding =
            "8px 3px";

        button.style.border =
            "none";

        button.style.borderRadius =
            "8px";

        button.style.background =
            "linear-gradient(135deg,#eef2ff,#e0f2fe)";

        button.style.color =
            "#26324a";

        button.style.fontWeight =
            "bold";

        button.style.fontSize =
            "11px";

        button.style.cursor =
            "pointer";

        button.style.transition =
            "0.2s";

        button.style.boxShadow =
            "0 2px 6px rgba(50,60,120,.08)";


        button.onmouseenter =
            function() {

                button.style.transform =
                    "translateY(-2px)";

                button.style.background =
                    "linear-gradient(135deg,#c7d2fe,#bae6fd)";

                button.style.boxShadow =
                    "0 5px 12px rgba(50,60,120,.15)";

            };


        button.onmouseleave =
            function() {

                button.style.transform =
                    "translateY(0)";

                button.style.background =
                    "linear-gradient(135deg,#eef2ff,#e0f2fe)";

                button.style.boxShadow =
                    "0 2px 6px rgba(50,60,120,.08)";

            };


        button.onclick =
            function(event) {

                event.stopPropagation();

                chrome.runtime.sendMessage({

                    action:
                        action

                });

            };


        return button;
    }


    // ========================================================
    // ORIGINAL NAVIGATION BUTTONS
    // ========================================================

    buttons.appendChild(
        createButton(
            "◀ Back",
            "back"
        )
    );


    buttons.appendChild(
        createButton(
            "Forward ▶",
            "forward"
        )
    );


    buttons.appendChild(
        createButton(
            "Google",
            "google"
        )
    );


    buttons.appendChild(
        createButton(
            "YouTube",
            "youtube"
        )
    );


    buttons.appendChild(
        createButton(
            "Instagram",
            "instagram"
        )
    );


    buttons.appendChild(
        createButton(
            "GitHub",
            "github"
        )
    );


    panel.appendChild(
        buttons
    );


    // ========================================================
    // ADD PANEL
    // ========================================================

    document.body.appendChild(
        panel
    );


    console.log(
        "STACKNAV loaded successfully"
    );

}


// ============================================================
// UPDATE STACK INFORMATION
// ============================================================

function updateStackInformation() {

    chrome.runtime.sendMessage(

        {
            action:
                "getStackState"
        },

        function(data) {

            if (!data) {
                return;
            }


            // ==================================================
            // CURRENT PAGE
            // ==================================================

            const current =
                document.getElementById(
                    "currentPageDisplay"
                );


            // ==================================================
            // BACK STACK
            // ==================================================

            const back =
                document.getElementById(
                    "backStackDisplay"
                );


            // ==================================================
            // FORWARD STACK
            // ==================================================

            const forward =
                document.getElementById(
                    "forwardStackDisplay"
                );


            // ==================================================
            // STACK INFORMATION
            // ==================================================

            const backInfo =
                document.getElementById(
                    "backStackInfo"
                );

            const forwardInfo =
                document.getElementById(
                    "forwardStackInfo"
                );


            if (
                !current ||
                !back ||
                !forward
            ) {
                return;
            }


            // ==================================================
            // CURRENT PAGE
            // ==================================================

            current.innerText =
                data.current_page;


            // ==================================================
            // CREATE BACK STACK BLOCKS
            // ==================================================

            back.innerHTML =
                "";


            if (
                data.back_stack &&
                data.back_stack.length > 0
            ) {

                const reversedBack =
                    [
                        ...data.back_stack
                    ].reverse();


                reversedBack.forEach(

                    function(
                        page,
                        index
                    ) {

                        const block =
                            document.createElement(
                                "div"
                            );


                        block.innerText =
                            page +
                            (
                                index === 0
                                    ? "  ← TOP"
                                    : ""
                            );


                        block.style.padding =
                            "4px";

                        block.style.marginBottom =
                            "3px";

                        block.style.borderRadius =
                            "5px";

                        block.style.background =
                            index === 0
                                ? "linear-gradient(135deg,#6366f1,#818cf8)"
                                : "#eef2ff";

                        block.style.color =
                            index === 0
                                ? "white"
                                : "#27324a";

                        block.style.fontWeight =
                            "bold";

                        block.style.textAlign =
                            "center";

                        block.style.fontSize =
                            "10px";

                        block.style.boxShadow =
                            index === 0
                                ? "0 3px 8px rgba(99,102,241,.25)"
                                : "none";


                        back.appendChild(
                            block
                        );

                    }

                );

            }

            else {

                back.innerText =
                    "Empty";

                back.style.textAlign =
                    "center";

                back.style.paddingTop =
                    "12px";

                back.style.color =
                    "#94a3b8";

            }


            // ==================================================
            // CREATE FORWARD STACK BLOCKS
            // ==================================================

            forward.innerHTML =
                "";


            if (
                data.forward_stack &&
                data.forward_stack.length > 0
            ) {

                const reversedForward =
                    [
                        ...data.forward_stack
                    ].reverse();


                reversedForward.forEach(

                    function(
                        page,
                        index
                    ) {

                        const block =
                            document.createElement(
                                "div"
                            );


                        block.innerText =
                            page +
                            (
                                index === 0
                                    ? "  ← TOP"
                                    : ""
                            );


                        block.style.padding =
                            "4px";

                        block.style.marginBottom =
                            "3px";

                        block.style.borderRadius =
                            "5px";

                        block.style.background =
                            index === 0
                                ? "linear-gradient(135deg,#06b6d4,#3b82f6)"
                                : "#ecfeff";

                        block.style.color =
                            index === 0
                                ? "white"
                                : "#27324a";

                        block.style.fontWeight =
                            "bold";

                        block.style.textAlign =
                            "center";

                        block.style.fontSize =
                            "10px";

                        block.style.boxShadow =
                            index === 0
                                ? "0 3px 8px rgba(6,182,212,.25)"
                                : "none";


                        forward.appendChild(
                            block
                        );

                    }

                );

            }

            else {

                forward.innerText =
                    "Empty";

                forward.style.textAlign =
                    "center";

                forward.style.paddingTop =
                    "12px";

                forward.style.color =
                    "#94a3b8";

            }


            // ==================================================
            // STACK SIZE
            // ==================================================

            const backLength =
                data.back_stack
                    ? data.back_stack.length
                    : 0;


            const forwardLength =
                data.forward_stack
                    ? data.forward_stack.length
                    : 0;


            // ==================================================
            // STACK TOP
            // ==================================================

            const backTop =
                backLength > 0
                    ? data.back_stack[
                        backLength - 1
                    ]
                    : "None";


            const forwardTop =
                forwardLength > 0
                    ? data.forward_stack[
                        forwardLength - 1
                    ]
                    : "None";


            // ==================================================
            // DISPLAY SIZE + TOP
            // ==================================================

            backInfo.innerText =
                "Size: " +
                backLength +
                " • Top: " +
                backTop;


            forwardInfo.innerText =
                "Size: " +
                forwardLength +
                " • Top: " +
                forwardTop;


            // ==================================================
            // UPDATE OPERATION LOG
            // ==================================================

            updateOperationLog();


            // ==================================================
            // UPDATE STATISTICS
            // ==================================================

            updateStackStatistics();

        }

    );

}


// ============================================================
// UPDATE OPERATION LOG
// ============================================================

function updateOperationLog() {

    const log =
        document.getElementById(
            "operationLogDisplay"
        );


    if (!log) {
        return;
    }


    fetch(
        "http://127.0.0.1:5000/operation_log"
    )

    .then(
        response =>
            response.json()
    )

    .then(
        data => {

            if (
                !data.operations ||
                data.operations.length === 0
            ) {

                log.innerText =
                    "No operations yet";

                return;

            }


            log.innerHTML =
                "";


            const operations =
                [
                    ...data.operations
                ].reverse();


            operations.forEach(

                function(item) {

                    const row =
                        document.createElement(
                            "div"
                        );


                    row.innerText =
                        item.operation +
                        " → " +
                        item.page;


                    row.style.padding =
                        "3px";

                    row.style.marginBottom =
                        "2px";

                    row.style.borderRadius =
                        "5px";

                    row.style.background =
                        "#eef2ff";

                    row.style.color =
                        "#334155";

                    row.style.fontWeight =
                        "bold";

                    row.style.fontSize =
                        "9px";


                    log.appendChild(
                        row
                    );

                }

            );

        }

    )

    .catch(

        error => {

            console.log(
                "Operation log error:",
                error
            );

        }

    );

}


// ============================================================
// UPDATE STACK STATISTICS
// ============================================================

function updateStackStatistics() {

    const statistics =
        document.getElementById(
            "stackStatisticsDisplay"
        );


    if (!statistics) {
        return;
    }


    fetch(
        "http://127.0.0.1:5000/stack_statistics"
    )

    .then(
        response =>
            response.json()
    )

    .then(
        data => {

            statistics.innerHTML =
                "📊 Back: " +
                data.back_count +
                " | Forward: " +
                data.forward_count +
                "<br>" +
                "🔄 Operations: " +
                data.total_operations +
                " | Pages Stored: " +
                data.total_pages;

        }

    )

    .catch(

        error => {

            console.log(
                "Statistics error:",
                error
            );

        }

    );

}


// ============================================================
// CREATE PANEL
// ============================================================

createNavigationPanel();


// ============================================================
// UPDATE EVERY SECOND
// ============================================================

setInterval(

    function() {

        updateStackInformation();

    },

    1000

);