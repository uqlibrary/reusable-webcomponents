import { defineConfig, devices } from '@playwright/test';
import * as os from 'os';
import { baseURL } from './playwright/lib/constants';

// Locally, cap workers at a fixed number (os.cpus() over-reports on high-core dev
// machines, and too many parallel browser contexts flake layout-timing tests). CI
// uses a percentage that resolves on the pipe. Mirrors homepage-react.
const localWorkers = Math.min(4, Math.max(1, Math.floor(os.cpus().length / 2)));

export default defineConfig({
    tsconfig: './tsconfig.json',
    outputDir: 'playwright/.results',
    testDir: 'playwright/tests',
    timeout: 120_000,
    expect: {
        timeout: 10_000,
    },
    fullyParallel: true,
    failOnFlakyTests: !process.env.CI_BRANCH,
    forbidOnly: !!process.env.CI_BRANCH,
    retries: process.env.CI_BRANCH ? 2 : 0,
    workers: process.env.CI_BRANCH ? '75%' : localWorkers,
    use: {
        baseURL,
        trace: 'retain-on-failure',
        headless: process.env.PW_HEADED === 'true' ? false : true,
        ignoreHTTPSErrors: true,
        bypassCSP: true,
        launchOptions: {
            args: ['--disable-web-security', '--disable-ipv6', '--disable-dev-shm-usage'],
        },
    },
    projects: [
        {
            name: 'chromium-headless-shell',
            use: {
                ...devices['Desktop Chrome'],
                viewport: {
                    width: 1000,
                    height: 660,
                },
            },
        },
    ],
    webServer: {
        command: 'npm run start:mock:no-open',
        url: baseURL,
        timeout: 5 * 60 * 1000,
        reuseExistingServer: true,
    },
});
