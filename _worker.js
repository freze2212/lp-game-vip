// Cloudflare Pages / Workers Serverless Link Routing System
import DOMAIN_MAPPINGS from './domains.json';

const GLOBAL_DEFAULT_REDIRECT = "https://daily.td88v5s.com/?inviteCode=20432384";

function resolveTargetUrl(requestUrl, cleanHost, env) {
  const urlObj = new URL(requestUrl);
  
  // 1. Check Query Parameter Override (?target=... or ?link=...)
  if (urlObj.searchParams.has('target')) {
    return urlObj.searchParams.get('target');
  }
  if (urlObj.searchParams.has('link')) {
    return urlObj.searchParams.get('link');
  }

  // 2. Check Cloudflare Environment Variables (e.g., env["domain_com"] or env.DEFAULT_TARGET_URL)
  const envHostKey = cleanHost.replace(/[^a-zA-Z0-9_]/g, '_');
  if (env && env[envHostKey]) {
    return env[envHostKey];
  }
  if (env && env.DEFAULT_TARGET_URL) {
    return env.DEFAULT_TARGET_URL;
  }

  // 3. Check local domains.json mapping
  if (DOMAIN_MAPPINGS) {
    const entry = DOMAIN_MAPPINGS[cleanHost] || DOMAIN_MAPPINGS["default"];
    if (typeof entry === 'string') {
      return entry;
    } else if (entry && entry.main_url) {
      return entry.main_url;
    } else if (entry && entry.target_url) {
      return entry.target_url;
    }
  }

  // 4. Default Fallback
  return GLOBAL_DEFAULT_REDIRECT;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Extract clean domain host
    const rawHost = request.headers.get("host") || url.hostname || "";
    const cleanHost = rawHost.replace(/^www\./i, "").split(":")[0].toLowerCase();

    // Resolve target redirect URL
    const targetUrl = resolveTargetUrl(request.url, cleanHost, env);

    // Direct API Endpoint for domain config
    if (path === '/api/domain-config') {
      return new Response(JSON.stringify({
        success: true,
        host: cleanHost,
        targetUrl: targetUrl
      }), {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // Dynamic config.js script output
    if (path === '/config.js') {
      const configJsContent = `/* Dynamic Cloudflare Link Config for Host: ${cleanHost} */\nwindow.REDIRECT_URL = ${JSON.stringify(targetUrl)};`;
      return new Response(configJsContent, {
        headers: {
          'Content-Type': 'application/javascript;charset=UTF-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // Pass through to static assets on Cloudflare Pages
    return env.ASSETS ? env.ASSETS.fetch(request) : fetch(request);
  }
};
