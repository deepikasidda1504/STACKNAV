// ============================================
// BROWSER HISTORY STACK
// AUTOMATIC WEBSITE DETECTION
// PER-TAB STACK SESSIONS
// ============================================

console.log(
    "Browser History Stack Extension Loaded"
);


// ============================================
// UNIQUE EXTENSION CLIENT ID
// ============================================

let clientId = null;


// ============================================
// CREATE / LOAD CLIENT ID
// ============================================

function initializeClientId() {

    return new Promise(function(resolve) {

        chrome.storage.local.get(
            ["clientId"],
            function(result) {

                if (result.clientId) {

                    clientId =
                        result.clientId;

                    console.log(
                        "Existing Client ID:",
                        clientId
                    );

                    resolve(clientId);

                } else {

                    clientId =
                        crypto.randomUUID();

                    chrome.storage.local.set(
                        {
                            clientId:
                                clientId
                        },
                        function() {

                            console.log(
                                "New Client ID:",
                                clientId
                            );

                            resolve(clientId);

                        }
                    );

                }

            }
        );

    });

}


// ============================================
// MAKE SURE CLIENT ID EXISTS
// ============================================

const clientReady =
    initializeClientId();


// ============================================
// CREATE SESSION ID FOR A TAB
// ============================================
//
// IMPORTANT:
//
// clientId alone = same for all tabs
// clientId + tabId = different session per tab
//
// ============================================

function getTabSessionId(tabId) {

    if (
        tabId === undefined ||
        tabId === null
    ) {

        return clientId;

    }

    return (
        clientId +
        "_tab_" +
        String(tabId)
    );

}


// ============================================
// LAST URL FOR EACH TAB
// ============================================

const lastURLs = {};


// ============================================
// PENDING NAVIGATION ACTION
//
// new
// back
// forward
// ============================================

const pendingNavigation = {};


// ============================================
// GET WEBSITE NAME
// ============================================

function getWebsiteName(url) {

    try {

        const parsedURL =
            new URL(url);

        let hostname =
            parsedURL.hostname;

        hostname =
            hostname.replace(
                /^www\./,
                ""
            );


        // ========================================
        // SPECIAL WEBSITE NAMES
        // ========================================

        const specialNames = {

            "google.com":
                "Google",

            "youtube.com":
                "YouTube",

            "web.whatsapp.com":
                "WhatsApp",

            "whatsapp.com":
                "WhatsApp",

            "instagram.com":
                "Instagram",

            "facebook.com":
                "Facebook",

            "github.com":
                "GitHub",

            "gmail.com":
                "Gmail",

            "mail.google.com":
                "Gmail",

            "amazon.com":
                "Amazon",

            "amazon.in":
                "Amazon",

            "linkedin.com":
                "LinkedIn",

            "x.com":
                "X",

            "twitter.com":
                "X",

            "reddit.com":
                "Reddit",

            "wikipedia.org":
                "Wikipedia",

            "codetantra.com":
                "CodeTantra"

        };


        // ========================================
        // EXACT MATCH
        // ========================================

        if (
            specialNames[hostname]
        ) {

            return specialNames[hostname];

        }


        // ========================================
        // SUBDOMAIN MATCH
        // ========================================

        for (
            const domain in specialNames
        ) {

            if (
                hostname.endsWith(
                    "." + domain
                )
            ) {

                return specialNames[domain];

            }

        }


        // ========================================
        // AUTOMATIC WEBSITE DETECTION
        // ========================================

        const parts =
            hostname.split(".");


        if (
            parts.length >= 2
        ) {

            let name =
                parts[
                    parts.length - 2
                ];


            return (
                name.charAt(0).toUpperCase() +
                name.slice(1)
            );

        }


        return hostname;

    }

    catch (error) {

        console.log(
            "Website detection error:",
            error
        );

        return null;

    }

}


// ============================================
// CHECK VALID WEBSITE
// ============================================

function isValidWebsite(url) {

    if (!url) {

        return false;

    }


    if (

        url.startsWith(
            "chrome://"
        ) ||

        url.startsWith(
            "chrome-extension://"
        ) ||

        url.startsWith(
            "edge://"
        ) ||

        url.startsWith(
            "about:"
        ) ||

        url.startsWith(
            "devtools://"
        )

    ) {

        return false;

    }


    return (

        url.startsWith(
            "http://"
        ) ||

        url.startsWith(
            "https://"
        )

    );

}


// ============================================
// SEND NAVIGATION TO FLASK
// ============================================
//
// tabId is IMPORTANT.
//
// Each tab gets its own session.
// ============================================

async function sendNavigationToFlask(
    url,
    action = "new",
    tabId
) {

    if (
        !isValidWebsite(url)
    ) {

        return;

    }


    const page =
        getWebsiteName(url);


    if (!page) {

        return;

    }


    await clientReady;


    const sessionId =
        getTabSessionId(tabId);


    console.log(
        "================================"
    );

    console.log(
        "Website detected:",
        page
    );

    console.log(
        "Navigation action:",
        action
    );

    console.log(
        "Tab ID:",
        tabId
    );

    console.log(
        "Session ID:",
        sessionId
    );

    console.log(
        "URL:",
        url
    );

    console.log(
        "================================"
    );


    const requestURL =

        "https://stacknav.onrender.com/sync_navigation/" +

        encodeURIComponent(page) +

        "?action=" +

        encodeURIComponent(action) +

        "&client_id=" +

        encodeURIComponent(sessionId);


    try {

        const response =
            await fetch(
                requestURL
            );


        console.log(
            "Flask status:",
            response.status
        );


        const data =
            await response.json();


        console.log(
            "Flask response:",
            data
        );

    }

    catch (error) {

        console.log(
            "Flask connection error:",
            error
        );

    }

}


// ============================================
// GET OPERATION LOG
// ============================================
//
// Uses sender tab ID.
// ============================================

async function getOperationLog(
    sendResponse,
    tabId
) {

    await clientReady;


    const sessionId =
        getTabSessionId(tabId);


    const requestURL =

        "https://stacknav.onrender.com/operation_log" +

        "?client_id=" +

        encodeURIComponent(
            sessionId
        );


    fetch(requestURL)

    .then(
        response => {

            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status
                );

            }

            return response.json();

        }
    )

    .then(
        data => {

            console.log(
                "Operation log:",
                data
            );


            sendResponse(
                data
            );

        }
    )

    .catch(
        error => {

            console.log(
                "Operation log error:",
                error
            );


            sendResponse({

                operations: []

            });

        }
    );

}


// ============================================
// GET STACK STATISTICS
// ============================================

async function getStackStatistics(
    sendResponse,
    tabId
) {

    await clientReady;


    const sessionId =
        getTabSessionId(tabId);


    const requestURL =

        "https://stacknav.onrender.com/stack_statistics" +

        "?client_id=" +

        encodeURIComponent(
            sessionId
        );


    fetch(requestURL)

    .then(
        response => {

            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status
                );

            }

            return response.json();

        }
    )

    .then(
        data => {

            console.log(
                "Stack statistics:",
                data
            );


            sendResponse(
                data
            );

        }
    )

    .catch(
        error => {

            console.log(
                "Statistics error:",
                error
            );


            sendResponse({

                back_count: 0,

                forward_count: 0,

                total_operations: 0,

                total_pages: 0

            });

        }
    );

}


// ============================================
// DETECT URL CHANGES
// ============================================

chrome.tabs.onUpdated.addListener(

    function(
        tabId,
        changeInfo,
        tab
    ) {


        // ====================================
        // ONLY HANDLE REAL URL CHANGES
        // ====================================

        if (
            !changeInfo.url
        ) {

            return;

        }


        const url =
            changeInfo.url;


        // ====================================
        // IGNORE DUPLICATE URL
        // ====================================

        if (
            lastURLs[tabId] ===
            url
        ) {

            return;

        }


        lastURLs[tabId] =
            url;


        console.log(
            "URL changed:",
            url
        );


        // ====================================
        // GET PENDING ACTION
        // ====================================

        let action =
            pendingNavigation[tabId];


        // ====================================
        // NORMAL WEBSITE NAVIGATION
        // ====================================

        if (!action) {

            action =
                "new";

        }


        console.log(
            "Final navigation action:",
            action
        );


        // ====================================
        // REMOVE PENDING ACTION
        // ====================================

        delete pendingNavigation[tabId];


        // ====================================
        // SEND TO FLASK
        // ====================================

        sendNavigationToFlask(
            url,
            action,
            tabId
        );

    }

);


// ============================================
// REMOVE CLOSED TAB
// ============================================

chrome.tabs.onRemoved.addListener(

    function(tabId) {

        delete lastURLs[tabId];

        delete pendingNavigation[tabId];

        console.log(
            "Tab closed:",
            tabId
        );

    }

);


// ============================================
// RECEIVE MESSAGES
// ============================================

chrome.runtime.onMessage.addListener(

    function(
        message,
        sender,
        sendResponse
    ) {


        // ====================================
        // GET TAB ID
        // ====================================
        //
        // Content scripts have sender.tab.id.
        //
        // ====================================

        const tabId =
            sender.tab
                ? sender.tab.id
                : null;


        // ====================================
        // GET OPERATION LOG
        // ====================================

        if (
            message.action ===
            "getOperationLog"
        ) {

            getOperationLog(
                sendResponse,
                tabId
            );


            return true;

        }


        // ====================================
        // GET STACK STATISTICS
        // ====================================

        if (
            message.action ===
            "getStackStatistics"
        ) {

            getStackStatistics(
                sendResponse,
                tabId
            );


            return true;

        }


        // ====================================
        // GET STACK STATE
        // ====================================

        if (
            message.action ===
            "getStackState"
        ) {

            getStackState(
                sendResponse,
                tabId
            );


            return true;

        }


        // ====================================
        // BUTTON ACTIONS REQUIRE TAB
        // ====================================

        if (
            !sender.tab
        ) {

            return;

        }


        // IMPORTANT:
        // tabId is taken from sender.tab.id
        // so each tab controls its own stack.

        const currentTabId =
            sender.tab.id;


        // ====================================
        // CUSTOM URL
        // ====================================

        if (
            message.action ===
            "customUrl"
        ) {

            console.log(
                "Custom URL:",
                message.url
            );


            let url =
                message.url.trim();


            if (
                !url.startsWith(
                    "http://"
                ) &&

                !url.startsWith(
                    "https://"
                )
            ) {

                url =
                    "https://" +
                    url;

            }


            pendingNavigation[
                currentTabId
            ] =
                "new";


            chrome.tabs.update(

                currentTabId,

                {
                    url: url
                }

            );


            return;

        }


        // ====================================
        // BACK
        // ====================================

        if (
            message.action ===
            "back"
        ) {

            console.log(
                "Back button clicked",
                "Tab:",
                currentTabId
            );


            pendingNavigation[
                currentTabId
            ] =
                "back";


            chrome.tabs.goBack(
                currentTabId
            )

            .catch(
                error => {

                    console.log(
                        "Cannot go back:",
                        error.message
                    );


                    delete pendingNavigation[
                        currentTabId
                    ];

                }
            );


            return;

        }


        // ====================================
        // FORWARD
        // ====================================

        if (
            message.action ===
            "forward"
        ) {

            console.log(
                "Forward button clicked",
                "Tab:",
                currentTabId
            );


            pendingNavigation[
                currentTabId
            ] =
                "forward";


            chrome.tabs.goForward(
                currentTabId
            )

            .catch(
                error => {

                    console.log(
                        "Cannot go forward:",
                        error.message
                    );


                    delete pendingNavigation[
                        currentTabId
                    ];

                }
            );


            return;

        }


        // ====================================
        // GOOGLE
        // ====================================

        if (
            message.action ===
            "google"
        ) {

            console.log(
                "Google button clicked",
                "Tab:",
                currentTabId
            );


            pendingNavigation[
                currentTabId
            ] =
                "new";


            chrome.tabs.update(

                currentTabId,

                {
                    url:
                        "https://www.google.com"
                }

            );


            return;

        }


        // ====================================
        // YOUTUBE
        // ====================================

        if (
            message.action ===
            "youtube"
        ) {

            console.log(
                "YouTube button clicked",
                "Tab:",
                currentTabId
            );


            pendingNavigation[
                currentTabId
            ] =
                "new";


            chrome.tabs.update(

                currentTabId,

                {
                    url:
                        "https://www.youtube.com"
                }

            );


            return;

        }


        // ====================================
        // INSTAGRAM
        // ====================================

        if (
            message.action ===
            "instagram"
        ) {

            console.log(
                "Instagram button clicked",
                "Tab:",
                currentTabId
            );


            pendingNavigation[
                currentTabId
            ] =
                "new";


            chrome.tabs.update(

                currentTabId,

                {
                    url:
                        "https://www.instagram.com"
                }

            );


            return;

        }


        // ====================================
        // GITHUB
        // ====================================

        if (
            message.action ===
            "github"
        ) {

            console.log(
                "GitHub button clicked",
                "Tab:",
                currentTabId
            );


            pendingNavigation[
                currentTabId
            ] =
                "new";


            chrome.tabs.update(

                currentTabId,

                {
                    url:
                        "https://github.com"
                }

            );


            return;

        }

    }

);


// ============================================
// GET STACK STATE FROM FLASK
// ============================================

async function getStackState(
    sendResponse,
    tabId
) {

    await clientReady;


    const sessionId =
        getTabSessionId(tabId);


    const requestURL =

        "https://stacknav.onrender.com/stack_state" +

        "?client_id=" +

        encodeURIComponent(
            sessionId
        );


    fetch(requestURL)

    .then(
        response => {

            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status
                );

            }

            return response.json();

        }
    )

    .then(
        data => {

            console.log(
                "Stack state:",
                data,
                "Tab:",
                tabId
            );


            sendResponse(
                data
            );

        }
    )

    .catch(
        error => {

            console.log(
                "Stack state error:",
                error
            );


            sendResponse({

                current_page:
                    "Error",

                back_stack: [],

                forward_stack: []

            });

        }
    );

}