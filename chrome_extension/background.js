// ============================================
// BROWSER HISTORY STACK
// AUTOMATIC WEBSITE DETECTION
// ============================================

console.log(
    "Browser History Stack Extension Loaded"
);


// ============================================
// LAST URL FOR EACH TAB
// ============================================

const lastURLs = {};


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
// SEND WEBSITE TO FLASK
// ============================================

function sendNavigationToFlask(url) {

    if (
        !isValidWebsite(url)
    ) {

        return Promise.resolve();

    }


    const page =
        getWebsiteName(url);


    if (!page) {

        return Promise.resolve();

    }


    console.log(
        "Website detected:",
        page
    );


    console.log(
        "URL:",
        url
    );


    return fetch(
        "http://127.0.0.1:5000/sync_navigation/" +
        encodeURIComponent(page)
    )

    .then(
        response => {

            console.log(
                "Flask status:",
                response.status
            );

            return response.text();

        }
    )

    .then(
        data => {

            console.log(
                "Flask:",
                data
            );

        }
    )

    .catch(
        error => {

            console.log(
                "Flask connection error:",
                error
            );

        }
    );

}


// ============================================
// GET OPERATION LOG FROM FLASK
// ============================================

function getOperationLog(
    sendResponse
) {

    fetch(
        "http://127.0.0.1:5000/operation_log"
    )

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
// GET STACK STATISTICS FROM FLASK
// ============================================

function getStackStatistics(
    sendResponse
) {

    fetch(
        "http://127.0.0.1:5000/stack_statistics"
    )

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
        // URL CHANGED
        // ====================================

        if (
            changeInfo.url
        ) {

            const url =
                changeInfo.url;


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


            sendNavigationToFlask(
                url
            );


            return;

        }


        // ====================================
        // PAGE FINISHED LOADING
        // ====================================

        if (
            changeInfo.status ===
            "complete"
        ) {

            if (!tab.url) {

                return;

            }


            const url =
                tab.url;


            if (
                lastURLs[tabId] ===
                url
            ) {

                return;

            }


            lastURLs[tabId] =
                url;


            console.log(
                "Page loaded:",
                url
            );


            sendNavigationToFlask(
                url
            );

        }

    }

);


// ============================================
// REMOVE CLOSED TAB
// ============================================

chrome.tabs.onRemoved.addListener(

    function(tabId) {

        delete lastURLs[tabId];

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

            chrome.tabs.query(

                {
                    active: true,
                    currentWindow: true
                },

                function(tabs) {

                    if (
                        tabs &&
                        tabs.length > 0
                    ) {

                        const activeTab =
                            tabs[0];

                        const currentURL =
                            activeTab.url;


                        if (
                            isValidWebsite(
                                currentURL
                            )
                        ) {

                            const currentPage =
                                getWebsiteName(
                                    currentURL
                                );


                            console.log(
                                "Active tab:",
                                currentPage
                            );


                            sendNavigationToFlask(
                                currentURL
                            )

                            .finally(

                                function() {

                                    getStackState(
                                        sendResponse
                                    );

                                }

                            );


                            return;

                        }

                    }


                    // =================================
                    // NO VALID URL
                    // =================================

                    getStackState(
                        sendResponse
                    );

                }

            );


            // Keep message channel open
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
        // BACK
        // ====================================

        if (
            message.action ===
            "back"
        ) {

            console.log(
                "Back button clicked"
            );


            chrome.tabs.goBack(
                tabId
            )

            .catch(
                error => {

                    console.log(
                        "Cannot go back:",
                        error.message
                    );

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


            chrome.tabs.goForward(
                tabId
            )

            .catch(
                error => {

                    console.log(
                        "Cannot go forward:",
                        error.message
                    );

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

function getStackState(
    sendResponse
) {

    fetch(
        "http://127.0.0.1:5000/stack_state"
    )

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