/**
 * Beka Chat Widget Loader
 * Injects the chatbot iframe and handles resizing events.
 */
(function () {
    // Configuration
    var script = document.currentScript;
    var scriptUrl = new URL(script.src);
    var WIDGET_URL = scriptUrl.origin;
    var IFRAME_ID = "beka-chat-widget-iframe";

    // Prevent duplicate injection
    if (document.getElementById(IFRAME_ID)) return;

    // Detect mobile
    var isMobile = window.innerWidth <= 600;

    // Create Iframe
    var iframe = document.createElement("iframe");
    iframe.id = IFRAME_ID;
    iframe.src = WIDGET_URL;
    iframe.style.position = "fixed";
    iframe.style.bottom = "0";
    iframe.style.right = "0";
    iframe.style.border = "none";
    iframe.style.zIndex = "999999";
    iframe.style.backgroundColor = "transparent";
    iframe.style.transition = "width 0.3s ease, height 0.3s ease";

    // Initial Size (Launcher Button only)
    iframe.style.width = "150px";
    iframe.style.height = "150px";

    document.body.appendChild(iframe);

    /**
     * Envia os dados da Shopify para o iframe via postMessage
     */
    function sendShopifyDataToWidget() {
        if (iframe.contentWindow) {
            // Clone object to avoid mutating original and ensure we can add properties
            var bekaData = window.BekaAppData || {};
            var payload = JSON.parse(JSON.stringify(bekaData));

            // Always use current URL (never stale)
            payload.url = window.location.href;

            iframe.contentWindow.postMessage({
                type: "BEKA_SHOPIFY_DATA",
                payload: payload
            }, WIDGET_URL);
            console.log("[Beka] Dados da Shopify enviados para o widget:", payload);
        }
    }

    // ---- URL Change Detection ----
    var lastKnownUrl = window.location.href;

    function checkUrlChange() {
        var currentUrl = window.location.href;
        if (currentUrl !== lastKnownUrl) {
            lastKnownUrl = currentUrl;
            console.log("[Beka] URL mudou para:", currentUrl);
            sendShopifyDataToWidget();
        }
    }

    // Listen for browser back/forward navigation
    window.addEventListener("popstate", function () {
        setTimeout(checkUrlChange, 50);
    });

    // Listen for hash changes
    window.addEventListener("hashchange", function () {
        setTimeout(checkUrlChange, 50);
    });

    // Intercept pushState and replaceState for SPA navigation
    var origPushState = history.pushState;
    var origReplaceState = history.replaceState;

    history.pushState = function () {
        origPushState.apply(this, arguments);
        setTimeout(checkUrlChange, 50);
    };

    history.replaceState = function () {
        origReplaceState.apply(this, arguments);
        setTimeout(checkUrlChange, 50);
    };

    // Fallback polling for edge cases (e.g. Turbolinks, other SPA routers)
    setInterval(checkUrlChange, 1000);

    // Quando o iframe carregar, enviar os dados da Shopify
    iframe.onload = function () {
        sendShopifyDataToWidget();

        var attempts = 0;
        var maxAttempts = 10;
        var interval = setInterval(function () {
            attempts++;
            if (window.BekaAppData) {
                sendShopifyDataToWidget();
                clearInterval(interval);
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.log("[Beka] BekaAppData não encontrado após " + maxAttempts + " tentativas");
            }
        }, 500);
    };

    // Handle Messages from Widget (Open/Close)
    window.addEventListener("message", function (event) {
        if (event.origin !== WIDGET_URL) return;

        var currentIsMobile = window.innerWidth <= 600;

        if (event.data === "BEKA_WIDGET_OPEN") {
            if (currentIsMobile) {
                // Mobile: full screen
                iframe.style.width = "100%";
                iframe.style.height = "100%";
                iframe.style.bottom = "0";
                iframe.style.right = "0";
            } else {
                // Desktop: fixed size
                iframe.style.width = "420px";
                iframe.style.height = "620px";
            }
        } else if (event.data === "BEKA_WIDGET_CLOSE") {
            // Back to launcher size
            iframe.style.width = "150px";
            iframe.style.height = "150px";
        } else if (event.data === "BEKA_REQUEST_SHOPIFY_DATA") {
            sendShopifyDataToWidget();
        }
    });
})();
