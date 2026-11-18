import type { BrowserContext } from '@playwright/test';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// Collect the browser's istanbul coverage into one partial file per test. window.__coverage__ is
// present because the dev-server bundle is instrumented (babel-plugin-istanbul under NODE_ENV=local,
// see .babelrc.js). It's captured on `beforeunload` (each navigation) and once more after the test.
// The partials are merged later with `nyc merge`. Only wired up when the test runner is NODE_ENV=cc
// (see playwright/test.ts), so a normal e2e run collects nothing.
export async function collectCoverageAsync(
    context: BrowserContext,
    use: (context: BrowserContext) => Promise<void>,
    partialsDir: string,
): Promise<void> {
    await fs.promises.mkdir(partialsDir, { recursive: true });

    const writePartial = (coverageJson: string) => {
        if (!coverageJson) return;
        try {
            JSON.parse(coverageJson); // validate before writing
        } catch {
            return;
        }
        fs.writeFileSync(path.join(partialsDir, `${crypto.randomBytes(16).toString('hex')}.json`), coverageJson);
    };

    await context.exposeFunction('collectIstanbulCoverage', writePartial);
    await context.addInitScript(() => {
        window.addEventListener('beforeunload', () => {
            const cov = (window as unknown as { __coverage__?: unknown }).__coverage__;
            if (cov) {
                (window as unknown as { collectIstanbulCoverage: (s: string) => void }).collectIstanbulCoverage(
                    JSON.stringify(cov),
                );
            }
        });
    });

    await use(context);

    for (const page of context.pages()) {
        try {
            await page.evaluate(() => {
                const cov = (window as unknown as { __coverage__?: unknown }).__coverage__;
                if (cov) {
                    (window as unknown as { collectIstanbulCoverage: (s: string) => void }).collectIstanbulCoverage(
                        JSON.stringify(cov),
                    );
                }
            });
        } catch {
            /* page already closed */
        }
    }
}
