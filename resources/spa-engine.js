(function () {
    var contentEl = document.querySelector('[data-spa-content]');
    if (!contentEl || !window.history || !window.fetch) {
        return;
    }

    var requestController = null;
    var navigating = false;
    var appNameSuffix = document.title.includes(' - ') ? ' - ' + document.title.split(' - ').slice(1).join(' - ') : '';

    function setLoading(state) {
        document.body.setAttribute('data-spa-loading', state ? 'true' : 'false');
    }

    function normalizePath(pathname) {
        if (!pathname) return '/';
        if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
        return pathname;
    }

    function updateActiveNav() {
        var currentPath = normalizePath(window.location.pathname);
        document.querySelectorAll('[data-spa-link]').forEach(function (link) {
            var linkPath = normalizePath(new URL(link.href, window.location.origin).pathname);
            link.classList.toggle('active', linkPath === currentPath);
        });
    }

    function applyStyles(styleHtml) {
        document.querySelectorAll('style[data-spa-style],link[data-spa-style]').forEach(function (node) {
            node.remove();
        });
        if (!styleHtml || !styleHtml.trim()) return;
        var wrap = document.createElement('div');
        wrap.innerHTML = styleHtml;
        var nodes = wrap.querySelectorAll('style,link[rel="stylesheet"]');
        if (nodes.length === 0) return;
        nodes.forEach(function (node) {
            node.setAttribute('data-spa-style', 'true');
            document.head.appendChild(node);
        });
    }

    function applyScripts(scriptHtml) {
        document.querySelectorAll('script[data-spa-page-script]').forEach(function (node) {
            node.remove();
        });
        if (!scriptHtml || !scriptHtml.trim()) return;
        var wrap = document.createElement('div');
        wrap.innerHTML = scriptHtml;
        var nodes = wrap.querySelectorAll('script');
        if (nodes.length === 0) {
            var s = document.createElement('script');
            s.setAttribute('data-spa-page-script', 'true');
            s.textContent = scriptHtml;
            document.body.appendChild(s);
            return;
        }
        nodes.forEach(function (old) {
            var s = document.createElement('script');
            Array.from(old.attributes).forEach(function (a) { s.setAttribute(a.name, a.value); });
            s.setAttribute('data-spa-page-script', 'true');
            if (old.src) { s.src = old.src; } else { s.textContent = old.textContent; }
            document.body.appendChild(s);
        });
    }

    function shouldHandleClick(event, link) {
        if (!link) return false;
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
        if (link.getAttribute('data-spa') === 'off') return false;
        if (link.hasAttribute('download') || (link.getAttribute('target') && link.getAttribute('target') !== '_self')) return false;
        var href = link.getAttribute('href');
        if (!href || href === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 || href.indexOf('javascript:') === 0) return false;
        var targetUrl = new URL(link.href, window.location.origin);
        if (targetUrl.origin !== window.location.origin) return false;
        return true;
    }

    async function navigateTo(url, options) {
        options = options || {};
        var shouldPush = options.push !== false;
        var shouldScroll = options.scroll !== false;
        if (navigating) return;
        navigating = true;
        setLoading(true);
        if (requestController) requestController.abort();
        requestController = new AbortController();
        try {
            var response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-Frontend-SPA': 'true',
                    'Accept': 'application/json'
                },
                signal: requestController.signal,
                credentials: 'same-origin'
            });
            var contentType = response.headers.get('content-type') || '';
            if (!response.ok || contentType.indexOf('application/json') === -1) {
                window.location.href = url; return;
            }
            var payload = await response.json();
            if (payload.redirect) {
                window.location.href = payload.redirect; return;
            }
            if (!payload || !payload.content || !payload.content.trim()) {
                window.location.href = url; return;
            }
            applyStyles(payload.style || '');
            contentEl.innerHTML = payload.content;
            applyScripts(payload.script || '');
            if (payload.title && payload.title.trim()) {
                document.title = payload.title + (appNameSuffix ? appNameSuffix : '');
            }
            if (shouldPush) history.pushState({ url: url }, '', url);
            if (shouldScroll) window.scrollTo({ top: 0, behavior: 'auto' });
            updateActiveNav();
        } catch (error) {
            if (error.name !== 'AbortError') window.location.href = url;
        } finally {
            navigating = false;
            setLoading(false);
        }
    }

    history.replaceState({ url: window.location.href }, '', window.location.href);
    updateActiveNav();

    document.addEventListener('click', function (event) {
        var link = event.target.closest('a[href]');
        if (!shouldHandleClick(event, link)) return;
        event.preventDefault();
        navigateTo(link.href, { push: true, scroll: true });
    });

    window.addEventListener('popstate', function () {
        navigateTo(window.location.href, { push: false, scroll: true });
    });

    window.spaNavigate = navigateTo;
})();