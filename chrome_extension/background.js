// ============================================
// BROWSER HISTORY STACK
// AUTOMATIC WEBSITE DETECTION
// ============================================

console.log(
    "Browser History Stack Extension Loaded"
);


// ============================================
// UNIQUE CLIENT ID
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

                    clientId = result.clientId;

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
                            clientId: clientId
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
// LAST URL FOR EACH TAB
// ============================================

const lastURLs = {};


// ============================================
// PENDING NAVIGATION ACTION
//
// new     = completely new page
// back    = browser back
// forward = browser forward
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
            hostname.replace(/^www\./, "");


        // ========================================
        // SPECIAL WEBSITE NAMES
        // ========================================

        const specialNames = {

            "google.com": "Google",

            "youtube.com": "YouTube",

            "web.whatsapp.com": "WhatsApp",

            "whatsapp.com": "WhatsApp",

            "instagram.com": "Instagram",

            "facebook.com": "Facebook",

            "github.com": "GitHub",

            "gmail.com": "Gmail",

            "mail.google.com": "Gmail",

            "amazon.com": "Amazon",

            "amazon.in": "Amazon",

            "linkedin.com": "LinkedIn",

            "x.com": "X",

            "twitter.com": "X",

            "reddit.com": "Reddit",

            "wikipedia.org": "Wikipedia",

            "codetantra.com": "CodeTantra"

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
        url.startsWith("chrome://") ||

        url.startsWith(
            "chrome-extension://"
        ) ||

        url.startsWith("edge://") ||

        url.startsWith("about:") ||

        url.startsWith("devtools://")
    ) {

        return false;

    }


    return (
        url.startsWith("http://") ||
        url.startsWith("https://")
    );

}


// ============================================
// SEND NAVIGATION TO FLASK
// ============================================

async function sendNavigationToFlask(
    url,
    action = "new"
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
        "Client ID:",
        clientId
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
        encodeURIComponent(clientId);


    try {

        const response =
            await fetch(requestURL);


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

async function getOperationLog(
    sendResponse
) {

    await clientReady;


    const requestURL =
        "https://stacknav.onrender.com/operation_log" +
        "?client_id=" +
        encodeURIComponent(clientId);


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
    sendResponse
) {

    await clientReady;


    const requestURL =
        "https://stacknav.onrender.com/stack_statistics" +
        "?client_id=" +
        encodeURIComponent(clientId);


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
//
// We process ONLY changeInfo.url.
//
// We do NOT process "complete" again.
//
// This prevents the same navigation from
// being added to the stacks twice.
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
        // NO BUTTON ACTION
        //
        // Therefore this is a NEW PAGE.
        //
        // Example:
        // User types URL in address bar
        // User clicks a link
        // User opens a website normally
        // ====================================

        if (
            !action
        ) {

            action = "new";

        }


        console.log(
            "Final navigation action:",
            action
        );


        // ====================================
        // REMOVE ACTION
        //
        // Prevent the same action from being
        // used for the next navigation.
        // ====================================

        delete pendingNavigation[tabId];


        // ====================================
        // SEND TO FLASK
        // ====================================

        sendNavigationToFlask(
            url,
            action
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
        // GET OPERATION LOG
        // ====================================

        if (
            message.action ===
            "getOperationLog"
        ) {

            getOperationLog(
                sendResponse
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
                sendResponse
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
                sendResponse
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


        const tabId =
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


            // Add https:// if missing

            if (
                !url.startsWith("http://") &&
                !url.startsWith("https://")
            ) {

                url =
                    "https://" + url;

            }


            // --------------------------------
            // IMPORTANT
            // Custom URL = NEW NAVIGATION
            // --------------------------------

            pendingNavigation[tabId] =
                "new";


            chrome.tabs.update(

                tabId,

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
                "Back button clicked"
            );


            // --------------------------------
            // Tell Flask this is BACK
            // --------------------------------

            pendingNavigation[tabId] =
                "back";


            chrome.tabs.goBack(
                tabId
            )

            .catch(
                error => {

                    console.log(
                        "Cannot go back:",
                        error.message
                    );


                    delete pendingNavigation[tabId];

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
                "Forward button clicked"
            );


            // --------------------------------
            // Tell Flask this is FORWARD
            // --------------------------------

            pendingNavigation[tabId] =
                "forward";


            chrome.tabs.goForward(
                tabId
            )

            .catch(
                error => {

                    console.log(
                        "Cannot go forward:",
                        error.message
                    );


                    delete pendingNavigation[tabId];

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
                "Google button clicked"
            );


            pendingNavigation[tabId] =
                "new";


            chrome.tabs.update(

                tabId,

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
                "YouTube button clicked"
            );


            pendingNavigation[tabId] =
                "new";


            chrome.tabs.update(

                tabId,

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
                "Instagram button clicked"
            );


            pendingNavigation[tabId] =
                "new";


            chrome.tabs.update(

                tabId,

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
                "GitHub button clicked"
            );


            pendingNavigation[tabId] =
                "new";


            chrome.tabs.update(

                tabId,

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
    sendResponse
) {

    await clientReady;


    const requestURL =
        "https://stacknav.onrender.com/stack_state" +
        "?client_id=" +
        encodeURIComponent(clientId);


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