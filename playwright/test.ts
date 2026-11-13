import { test as base } from '@playwright/test';
import { collectCoverageAsync } from './lib/coverage/istanbul/collectCoverageAsync';
import { istanbulReportPartialsDir } from './lib/constants';

export * from '@playwright/test';

// A 1x1 transparent PNG, used so mocked <img> assets still decode.
const EMPTY_PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64',
);

// Fulfil a mocked host's request with an empty-but-valid response for its asset type.
const fulfilExternalAsset = (route: import('@playwright/test').Route) => {
    const url = route.request().url();
    if (/\.css(\?|$)/.test(url)) {
        return route.fulfill({ status: 200, contentType: 'text/css', body: '' });
    }
    if (/\.svg(\?|$)/.test(url)) {
        return route.fulfill({
            status: 200,
            contentType: 'image/svg+xml',
            body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>',
        });
    }
    if (/\.(png|jpe?g|gif|webp)(\?|$)/.test(url)) {
        return route.fulfill({ status: 200, contentType: 'image/png', body: EMPTY_PNG });
    }
    if (/\.(woff2?|ttf|eot|otf)(\?|$)/.test(url)) {
        return route.fulfill({ status: 200, contentType: 'font/woff2', body: '' });
    }
    // Default: a navigable empty HTML page (200, not 204) so a popup / window.open navigation
    // to an external redirect service still "lands" on its URL for toHaveURL assertions.
    return route.fulfill({ status: 200, contentType: 'text/html', body: '' });
};

// Safety-net stubs for the UQ library API and error reporting, mirroring homepage-react.
// The app's own data is supplied in-browser by MockApi under USE_MOCK, so api.library is
// not normally hit; the stub keeps a stray call from leaving the machine.
const JSON_STUB_HOSTS = ['**.sentry.io', 'api.library.uq.edu.au'];

// Third-party hosts fetched directly by the browser that carry NO behaviour under test —
// fulfilled with an empty-but-valid response for the asset type. The cross-app integration
// tests that pulled load-bearing bundles were moved to the e2e-testing repo, so what's left
// is fonts, analytics/ads, decorative images/stylesheets, and the external destinations that
// components open in a popup / new tab (the OpenAthens "Visit" link, the proactive-chat launch
// and its "leave a question" contact page) — those are asserted by URL only, so a navigable
// empty page is enough.
const ASSET_STUB_HOSTS = [
    // fonts
    'static.uq.net.au',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    // analytics / ads / tracking
    'www.googletagmanager.com',
    '*.doubleclick.net',
    'bat.bing.com',
    'px.ads.linkedin.com',
    'snap.licdn.com',
    'www.linkedin.com',
    'connect.facebook.net',
    'www.facebook.com',
    'www.google.com',
    'www.google.com.au',
    'www.gravatar.com',
    // decorative images / stylesheets
    'studenthub.uq.edu.au',
    'web.library.uq.edu.au',
    'assets.library.uq.edu.au',
    'stackpath.bootstrapcdn.com',
    // popup / new-tab destinations (asserted by URL only)
    'go.openathens.net',
    'support.my.uq.edu.au',
    '*.crm.test.uq.edu.au',
    '*.crm.uq.edu.au',
];

// Register the hermetic external-host routes on a context. Exported so tests that create their
// own context (e.g. browser.newContext for a permissions scenario) can stay hermetic too.
export async function applyHermeticRoutes(context: import('@playwright/test').BrowserContext) {
    for (const host of JSON_STUB_HOSTS) {
        await context.route(`https://${host}/**`, (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
        );
    }
    for (const host of ASSET_STUB_HOSTS) {
        await context.route(`https://${host}/**`, fulfilExternalAsset);
        await context.route(`http://${host}/**`, fulfilExternalAsset);
    }
    // The OpenAthens "Visit" link opens the resolver, which redirects to go.openathens with the
    // requested URL. Replicate that with a CLIENT-side redirect (not a 302): a server-redirect
    // response we fulfil is followed internally and would escape routing, so the go.openathens
    // hop would hit the network; a JS navigation is re-routed and stays hermetic. The popup still
    // lands on the go.openathens URL the tests assert.
    await context.route('https://resolver.library.uq.edu.au/**', (route) => {
        const qurl = new URL(route.request().url()).searchParams.get('qurl');
        const target = qurl && `https://go.openathens.net/redirector/uq.edu.au?url=${encodeURIComponent(qurl)}`;
        return route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: target ? `<!doctype html><script>location.replace(${JSON.stringify(target)})</script>` : '',
        });
    });
    // The login/logout flow navigates to auth.library, which redirects back to its base64-encoded
    // `return` URL (e.g. localhost/?user=public -> logged out). Short-circuit to that target.
    await context.route('https://auth.library.uq.edu.au/**', (route) => {
        const ret = new URL(route.request().url()).searchParams.get('return');
        if (ret) {
            try {
                return route.fulfill({
                    status: 302,
                    headers: { location: Buffer.from(ret, 'base64').toString('utf8') },
                    body: '',
                });
            } catch {
                /* fall through to stub page */
            }
        }
        return route.fulfill({ status: 200, contentType: 'text/html', body: '' });
    });
}

const hermeticGuardMessage = (hosts: string[]) =>
    `\n🚧 This test made a live request to an external host: ${hosts.join(', ')}\n\n` +
    `The e2e suite here is deliberately hermetic — it only talks to the local app. External calls\n` +
    `were by far the biggest source of flakiness in this repo (a third party being slow or down would\n` +
    `randomly fail unrelated tests), so we mock them all.\n\n` +
    `No worries — here's how to get green again, whichever fits:\n` +
    `  • If it's incidental to what you're testing (a font, analytics pixel, image, redirect target),\n` +
    `    add its host to the mock list in playwright/test.ts (ASSET_STUB_HOSTS / JSON_STUB_HOSTS).\n` +
    `  • If the test genuinely needs the real external service, it belongs in the e2e-testing repo,\n` +
    `    which runs against staging with real assets — pop it over there instead.\n\n` +
    `Thanks for helping keep this suite fast and reliable! 💚\n`;

const isExternalUrl = (url: URL) => !/^(localhost|127\.0\.0\.1)(:|$)/.test(url.host);

const test = base.extend({
    // Hermetic e2e: NO test may touch a third-party host — it couples the suite to those hosts
    // being up, adds latency and adds flake. Routing is done at the CONTEXT level (not page) so
    // it also covers popups / window.open tabs (e.g. the OpenAthens "Visit" link and the proactive-chat launch),
    // which page-level routes miss. Only the enumerated external hosts are intercepted — localhost is left untouched,
    // so the app's own requests and popup timing are unaffected. auth.library needs a redirect rather than an
    // empty asset. Specs may add their own page-level routes, which take precedence over these.
    context: async ({ context }, use) => {
        // Guard: catch any external request NOT handled by a specific mock, stub it so it can't
        // hit the network, and fail the test afterwards with a friendly pointer. Registered first
        // (a URL predicate that skips localhost) so the specific mocks below take precedence.
        const unmockedExternalHosts = new Set<string>();
        await context.route(isExternalUrl, (route) => {
            unmockedExternalHosts.add(new URL(route.request().url()).host);
            return fulfilExternalAsset(route);
        });
        await applyHermeticRoutes(context);
        // Under NODE_ENV=cc, collect istanbul coverage from the (instrumented) dev-server bundle;
        // a normal run just executes the test.
        if (process?.env?.NODE_ENV === 'cc') {
            await collectCoverageAsync(context, use, istanbulReportPartialsDir);
        } else {
            await use(context);
        }
        if (unmockedExternalHosts.size > 0) {
            throw new Error(hermeticGuardMessage([...unmockedExternalHosts]));
        }
    },
});

export { test };
