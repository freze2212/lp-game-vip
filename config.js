/* Config JS - Dynamic Domain Target Link Resolution for Cloudflare & Local Hosting */
(function () {
    var DEFAULT_REDIRECT_URL = "https://daily.td88v5s.com/?inviteCode=20432384";
    window.REDIRECT_URL = window.REDIRECT_URL || DEFAULT_REDIRECT_URL;

    function getCleanHost() {
        return (window.location.hostname || "").replace(/^www\./i, "").toLowerCase();
    }

    function applyDomainConfig(domainData) {
        var cleanHost = getCleanHost();
        
        if (domainData) {
            var entry = domainData[cleanHost] || domainData["default"];
            if (typeof entry === 'string') {
                window.REDIRECT_URL = entry;
            } else if (entry && entry.main_url) {
                window.REDIRECT_URL = entry.main_url;
            } else if (entry && entry.target_url) {
                window.REDIRECT_URL = entry.target_url;
            }
        }
        
        // Priority check for query parameter override (?target=... or ?link=...)
        try {
            var params = new URLSearchParams(window.location.search);
            if (params.has('target')) {
                window.REDIRECT_URL = params.get('target');
            } else if (params.has('link')) {
                window.REDIRECT_URL = params.get('link');
            }
        } catch (e) {}

        // Apply updated URL to all CTA buttons on the page
        updateCtaLinks(window.REDIRECT_URL);

        // Notify listeners that REDIRECT_URL has been resolved
        window.dispatchEvent(new CustomEvent('domainConfigLoaded', { detail: { url: window.REDIRECT_URL, host: cleanHost } }));
    }

    function updateCtaLinks(url) {
        url = url || window.REDIRECT_URL;
        if (!url) return;
        var ctaBtn = document.getElementById('ctaBtn');
        if (ctaBtn) {
            ctaBtn.href = url;
        }
        var allCta = document.querySelectorAll('.btn-cta, a[data-cta="true"], .redirect-link');
        for (var i = 0; i < allCta.length; i++) {
            allCta[i].href = url;
        }
    }

    // Try fetching /api/domain-config first (served by CF Worker), then fallback to /domains.json
    fetch('/api/domain-config')
        .then(function (res) { return res.json(); })
        .then(function (resData) {
            if (resData && resData.success && resData.targetUrl) {
                window.REDIRECT_URL = resData.targetUrl;
                updateCtaLinks(window.REDIRECT_URL);
            } else {
                fetchLocalDomains();
            }
        })
        .catch(function () {
            fetchLocalDomains();
        });

    function fetchLocalDomains() {
        fetch('/domains.json')
            .then(function (res) { return res.json(); })
            .then(function (data) { applyDomainConfig(data); })
            .catch(function () { applyDomainConfig(null); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { updateCtaLinks(); });
    } else {
        updateCtaLinks();
    }
    window.addEventListener('load', function () { updateCtaLinks(); });
})();
