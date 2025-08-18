import { test, expect } from '@playwright/test';
import { assertAccessibility } from '../lib/axe';

const _access = require('../../src/helpers/access');

test.describe('UQ Header', () => {
    test.describe('Helpers', () => {
        async function expectHomePageOfUrlIs(currentUrl, expectedHomepage) {
            const currentUrlParts = new URL(currentUrl);
            const loggedoutHomepageLink = (0, _access.getHomepageLink)(
                currentUrlParts.hostname,
                currentUrlParts.protocol,
                currentUrlParts.port,
                currentUrlParts.pathname,
            );
            expect(loggedoutHomepageLink).toEqual(expectedHomepage);
        }

        test('should generate the correct homepage links', async ({ page }) => {
            expectHomePageOfUrlIs(
                'https://www.library.uq.edu.au/learning-resources?coursecode=PHYS1001&campus=St%20Lucia&semester=Semester%201%202023',
                'https://www.library.uq.edu.au',
            );

            expectHomePageOfUrlIs(
                'https://homepage-development.library.uq.edu.au/master/#/admin/masquerade',
                'https://homepage-development.library.uq.edu.au/master/#/',
            );

            expectHomePageOfUrlIs(
                'https://homepage-staging.library.uq.edu.au/learning-resources?coursecode=FREN1020&campus=St%20Lucia&semester=Semester%202%202023',
                'https://homepage-staging.library.uq.edu.au',
            );

            expectHomePageOfUrlIs('https://app.library.uq.edu.au/#/membership/admin', 'https://app.library.uq.edu.au');

            expectHomePageOfUrlIs(
                'http://localhost:8080/#keyword=;campus=;weekstart=',
                'http://localhost:8080/?user=public',
            );
        });
    });
    test.describe('Header', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('http://localhost:8080');
        });
        test('UQ Header operates as expected', async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            const headerElement = page.locator('uq-header');

            // UQ logo is visible
            await expect(headerElement.getByTestId('uq-header-logo')).toBeVisible();

            // top right nav exists
            await expect(headerElement.getByTestId('uq-header-secondary-nav').locator('li')).toHaveCount(5);

            // secondary nav exists
            await expect.poll(async () => headerElement.locator(':scope > *').count()).toBeGreaterThan(0);

            // Site Search accordion toggles correctly
            await expect(headerElement.getByTestId('uq-header-search-button')).toBeVisible();
            await expect(headerElement.locator('.uq-header__search-query-input')).not.toBeVisible();
            await headerElement.getByTestId('uq-header-search-button').click();
            await page.waitForTimeout(1200);
            await expect(headerElement.locator('.uq-header__search-query-input')).toBeVisible();
            await expect(headerElement.locator('.uq-header__search-query-input')).toBeVisible();
            await expect(headerElement.getByTestId('uq-header-search-input')).toBeVisible();
            await expect(headerElement.getByTestId('uq-header-search-input')).toBeVisible();
            await expect(headerElement.locator('input[placeholder="Search by keyword"]')).toBeVisible();
            await expect(headerElement.locator('input[placeholder="Search by keyword"]')).toBeVisible();
            await expect(headerElement.getByTestId('uq-header-search-input-as-sitesearch')).not.toBeVisible();
            await expect(headerElement.getByTestId('uq-header-search-input-as-sitesearch')).not.toBeVisible();
            await expect(headerElement.getByTestId('uq-header-search-submit')).toBeVisible();
            await headerElement.getByTestId('uq-header-search-button').click();
            await expect(headerElement.locator('.uq-header__search-query-input')).not.toBeVisible();
        });

        test('Header passes accessibility', async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            await page.waitForLoadState('networkidle');

            await assertAccessibility(page, 'uq-header');
        });

        test('Site-header has expected items', async ({ page }) => {
            const headerElement = page.locator('uq-site-header');
            await expect(headerElement.getByTestId('root-link')).toBeVisible();
            await expect(headerElement.getByText(/UQ home/).first()).toHaveAttribute('href', /https:\/\/uq\.edu\.au\//);
            await expect(headerElement.getByTestId('site-title')).toBeVisible();
            await expect(headerElement.getByText(/Library/).first()).toHaveAttribute(
                'href',
                /https:\/\/www\.library\.uq\.edu\.au\//,
            );
            await expect(headerElement.getByTestId('subsite-title')).not.toBeVisible();
        });

        test('Breadcrumbs in Responsive show the correct item', async ({ page }) => {
            await page.setViewportSize({ width: 650, height: 1024 });
            // both items show
            const headerElement = page.locator('uq-site-header');
            await expect(headerElement.getByTestId('root-link')).toBeVisible();
            await expect(headerElement.getByTestId('root-link')).toBeVisible();
            await expect(headerElement.getByText(/UQ home/).first()).toBeVisible();
            await expect(headerElement.getByTestId('site-title')).toBeVisible();
            await expect(headerElement.getByTestId('site-title')).toBeVisible();
            await expect(headerElement.getByText(/Library Test/).first()).toBeVisible();

            await page.setViewportSize({ width: 590, height: 1024 });
            const headerElement2 = page.locator('uq-site-header');
            await expect(headerElement2.getByTestId('root-link')).toBeVisible();
            await expect(headerElement2.getByTestId('root-link')).toBeVisible();
            await expect(headerElement2.getByText(/UQ home/).first()).toBeVisible();
            await expect(headerElement2.getByTestId('site-title')).not.toBeVisible();
        });

        test('Responsive Menu operates as expected', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            const siteHeaderElement = page.locator('uq-site-header');

            await page.waitForLoadState('networkidle');

            // mobile menu hidden
            await expect(
                siteHeaderElement.locator('nav[aria-label="Site navigation"] > ul:first-child'),
            ).not.toBeVisible();
            await expect(siteHeaderElement.getByTestId('uq-header-study-link-mobile')).not.toBeVisible();

            // open the menu
            await expect(page.locator('uq-header').getByTestId('mobile-menu-toggle-button')).toBeVisible();
            await page.locator('uq-header').getByTestId('mobile-menu-toggle-button').dispatchEvent('click');

            // menu is open
            await expect(siteHeaderElement.locator('[aria-label="Site navigation"]')).toBeVisible();
            // other items visible
            await expect(siteHeaderElement.getByTestId('uq-header-study-link-mobile')).toBeVisible();
            await expect(
                siteHeaderElement.locator('.uq-site-header__navigation__list__first-permanent-child'),
            ).toBeVisible();
            // and menu has the correct children
            const countPrimaryListItems = 4;
            const countSecondaryListItems = 5;
            await expect(siteHeaderElement.locator('[aria-label="Site navigation"] ul li')).toHaveCount(
                countPrimaryListItems + countSecondaryListItems,
            );
            // both primary list items and secondary list items are present
            await expect(siteHeaderElement.getByTestId('uq-header-study-link-mobile')).toBeVisible();
            await expect(siteHeaderElement.getByTestId('uq-header-study-link-mobile')).toHaveText(/Study/);
            await expect(siteHeaderElement.getByTestId('uq-header-home-link-mobile')).toBeVisible();
            await expect(siteHeaderElement.getByTestId('uq-header-home-link-mobile')).toHaveText(/UQ home/);

            // close the mobile menu
            await page.locator('uq-header').getByTestId('mobile-menu-toggle-button').dispatchEvent('click');

            // mobile menu is hidden
            await expect(
                siteHeaderElement.locator('nav[aria-label="Site navigation"] > ul:first-child'),
            ).not.toBeVisible();
            await expect(siteHeaderElement.getByTestId('uq-header-study-link-mobile')).not.toBeVisible();
        });

        test('can send a search on the library site', async ({ page }) => {
            await page.route(
                'https://search.uq.edu.au/?q=frogs&op=Search&as_sitesearch=library.uq.edu.au',
                async (route) => {
                    await route.fulfill({ body: 'a search results page with frogs' });
                },
            );

            await page.setViewportSize({ width: 1280, height: 900 });
            const headerElement = page.locator('uq-header');

            // search accordion is closed
            await expect(headerElement.getByTestId('uq-header-search-submit')).not.toBeVisible();

            // open search accordion
            await headerElement.getByTestId('uq-header-search-button').click();

            // search accordion is open
            await expect(headerElement.getByTestId('uq-header-search-submit')).toBeVisible();

            // enter a query term and click return to submit
            await headerElement.getByTestId('uq-header-search-input').fill('frogs');
            await headerElement.getByTestId('uq-header-search-input').press('Enter');

            // we send through to the uq search page correctly
            await expect(page.getByText('a search results page with frogs')).toBeVisible();
        });
    });
});
