import { test, expect } from '@playwright/test';
const _helpers = require('../../src/UtilityArea/helpers');
import { assertAccessibility } from '../lib/axe';

const footerLinksHaveAnalyticsId = async (page, screenSize) => {
    const links = await page.getByTestId(`footer-${screenSize}-nav`).locator('a').all();
    for (const link of links) {
        await expect(link).toHaveAttribute('data-analyticsid');
        expect(await link.getAttribute('data-analyticsid')).toMatch(new RegExp(`(.*)-${screenSize}`));
    }
};

test.describe('UQ Footer', () => {
    test.beforeEach(async ({ page, context }) => {
        await context.clearCookies();
        await context.addCookies([{ name: 'UQ_PROACTIVE_CHAT', value: 'hidden', path: '/', domain: 'localhost:8080' }]);

        await page.goto('http://localhost:8080');
    });
    test.describe('Footer', () => {
        test('Footer is visible without interaction at 1280px wide', async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            const footerElement = page.locator('uq-footer');

            await expect(footerElement.getByTestId('uq-footer')).toHaveCSS(
                'background-color',
                _helpers.COLOUR_UQ_PURPLE,
            );
            await expect(footerElement.getByTestId('uq-footer-acknowledgement')).toHaveCSS(
                'background-color',
                _helpers.COLOUR_CONTENT_BLACK,
            );

            await expect(footerElement.getByTestId('uq-acknowledgement__text')).toHaveText(
                /acknowledges the Traditional Owners/,
            );
            await expect(footerElement.getByTestId('uq-footer__navigation-title--media')).toHaveText('Media');
            await expect(footerElement.getByTestId('uqfooter-nav-library-homepage-desktop')).toHaveText('Library');
            await expect(footerElement.getByTestId('uqfooter-nav-library-homepage-desktop')).toHaveAttribute(
                'href',
                `https://www.library.uq.edu.au`,
            );
            await expect(footerElement.getByTestId('uqfooter-facebook')).toBeVisible();
        });

        test('Footer menu  is correct on desktop', async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            const footerElement = page.locator('uq-footer');

            await expect(footerElement.locator('[data-testid="footer-desktop-nav"] > ul')).toBeVisible();
            await expect(
                footerElement.locator('[data-testid="footer-desktop-nav"] > ul').locator(':scope > *'),
            ).toHaveCount(5);
            await expect(
                footerElement.locator(
                    '[data-testid="footer-desktop-nav"] .uq-footer__navigation--is-open:first-child h2',
                ),
            ).toBeVisible();
            await expect(
                footerElement
                    .locator('[data-testid="footer-desktop-nav"] .uq-footer__navigation--is-open:first-child h2')
                    .first(),
            ).toBeVisible();
            await expect(
                footerElement.locator(
                    '[data-testid="footer-desktop-nav"] .uq-footer__navigation--is-open:first-child h2',
                ),
            ).toHaveText(/Media/);

            await expect
                .poll(async () =>
                    footerElement
                        .locator(
                            '[data-testid="footer-desktop-nav"] .uq-footer__navigation--is-open:first-child .uq-footer__navigation-level-2 li',
                        )
                        .count(),
                )
                .toBeGreaterThan(2); // while the length varies, we're always going to have some!

            let listIndex = 2;
            await expect(
                footerElement
                    .getByTestId('footer-desktop-nav')
                    .locator(`.uq-footer__navigation--is-open:nth-child(${listIndex}) h2`),
            ).toBeVisible();
            await expect(
                footerElement
                    .getByTestId('footer-desktop-nav')
                    .locator(`.uq-footer__navigation--is-open:nth-child(${listIndex}) h2`),
            ).toBeVisible();
            await expect(
                footerElement
                    .getByTestId('footer-desktop-nav')
                    .locator(`.uq-footer__navigation--is-open:nth-child(${listIndex}) h2`)
                    .first(),
            ).toBeVisible();
            await expect(
                footerElement
                    .getByTestId('footer-desktop-nav')
                    .locator(`.uq-footer__navigation--is-open:nth-child(${listIndex}) h2`),
            ).toHaveText(/Working with us/);
            await expect
                .poll(async () =>
                    footerElement
                        .locator(
                            `[data-testid="footer-desktop-nav"] .uq-footer__navigation--is-open:nth-child(${listIndex}) .uq-footer__navigation-level-2 li`,
                        )
                        .count(),
                )
                .toBeGreaterThan(2); // while the length varies, we're always going to have some!

            // all the footer links have a data-analytics attribute
            await footerLinksHaveAnalyticsId(page, 'desktop');
        });

        test('Footer menu  is correct on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 320, height: 480 });
            const footerElement = page.locator('uq-footer');
            await expect(footerElement.locator('[data-testid="footer-mobile-nav"] > ul')).toBeVisible();
            await expect(
                footerElement.locator('[data-testid="footer-mobile-nav"] > ul').locator(':scope > *'),
            ).toHaveCount(5);

            // menu is not open
            await expect(footerElement.getByTestId(`mobile-child-list-0`)).not.toBeVisible();
            await expect(footerElement.getByTestId(`mobile-child-list-0`)).toHaveCSS('height', '0px');

            // open menu
            await expect(footerElement.getByTestId(`button-menu-toggle-0`)).toBeVisible();
            await footerElement.getByTestId(`button-menu-toggle-0`).getByText(/Media/).first().click();

            // menu is open
            await expect(footerElement.getByTestId(`mobile-child-list-0`)).toBeVisible();
            await expect(footerElement.getByTestId(`mobile-child-list-0`)).not.toHaveCSS('height', '0px');

            // menu has some children
            await expect(
                footerElement.getByTestId('menu-toggle-0').locator('.uq-footer__navigation-level-2 li').first(),
            ).toBeVisible();
            await expect
                .poll(async () =>
                    footerElement.getByTestId(`menu-toggle-0`).locator('.uq-footer__navigation-level-2 li').count(),
                )
                .toBeGreaterThan(2); // while the length varies, we're always going to have some!

            // close menu
            await footerElement.getByTestId(`button-menu-toggle-0`).getByText(/Media/).first().click();

            // menu is not open
            await expect(footerElement.getByTestId(`mobile-child-list-0`)).not.toBeVisible();
            await expect(footerElement.getByTestId(`mobile-child-list-0`)).toHaveCSS('height', '0px');

            // open second menu
            await expect(footerElement.getByTestId(`button-menu-toggle-1`)).toBeVisible();
            await footerElement
                .getByTestId(`button-menu-toggle-1`)
                .getByText(/Working with us/)
                .first()
                .click();

            // menu is open
            await expect(footerElement.getByTestId(`mobile-child-list-1`)).toBeVisible();
            await expect(footerElement.getByTestId(`mobile-child-list-1`)).not.toHaveCSS('height', '0px');

            // open first submenu - second menu will close automatically
            await expect(footerElement.getByTestId(`button-menu-toggle-0`)).toBeVisible();
            await footerElement.getByTestId(`button-menu-toggle-0`).getByText(/Media/).first().click();

            // second menu is not open
            await expect(footerElement.getByTestId(`mobile-child-list-1`)).not.toBeVisible();
            await expect(footerElement.getByTestId(`mobile-child-list-1`)).toHaveCSS('height', '0px');

            // all the footer links have a data-analytics attribute
            await footerLinksHaveAnalyticsId(page, 'mobile');
        });

        test('Footer passes accessibility on desktop', async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });

            // page has loaded
            await expect(page.locator('uq-footer').getByTestId('uqfooter-nav-library-homepage-desktop')).toHaveText(
                'Library',
            );

            await assertAccessibility(page, 'uq-footer', {
                // - the big grid of links don't look like links
                // - eg cricos text at bottom has insufficient contrast
                // central design, not in our control
                disabledRules: ['link-in-text-block'],
            });
        });

        test('Footer passes accessibility on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 320, height: 480 });
            const footerElement = page.locator('uq-footer');

            // await page has loaded
            await expect(footerElement.getByTestId('uq-footer__navigation-title--media')).toHaveText('Media');

            await assertAccessibility(page, 'uq-footer', {
                // - eg cricos text at bottom has insufficient contrast
                // central design, not in our control
                disabledRules: ['link-in-text-block'],
            });

            // menu is not open
            await expect(footerElement.getByTestId(`mobile-child-list-0`)).not.toBeVisible();
            await expect(footerElement.getByTestId(`mobile-child-list-0`)).toHaveCSS('height', '0px');

            // open menu
            await expect(footerElement.getByTestId(`button-menu-toggle-0`)).toBeVisible();
            await footerElement.getByTestId(`button-menu-toggle-0`).getByText(/Media/).first().click();

            // menu is open
            await expect(footerElement.getByTestId(`mobile-child-list-0`)).toBeVisible();
            await expect(footerElement.getByTestId(`mobile-child-list-0`)).not.toHaveCSS('height', '0px');

            await assertAccessibility(page, 'uq-footer', {
                // - eg cricos text at bottom has insufficient contrast
                // central design, not in our control
                disabledRules: ['link-in-text-block'],
            });
        });

        test('footer navigation blocks are laid out horizontally across the page on desktop', async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            const footerElement = page.locator('uq-footer');

            await expect(footerElement.locator('[data-testid="footer-desktop-nav"] > ul')).toBeVisible();
            await expect(
                footerElement.locator('[data-testid="footer-desktop-nav"] > ul').locator(':scope > *'),
            ).toHaveCount(5);

            const firstBlock = await footerElement.getByTestId('footer-navigation-block-1').boundingBox();
            const secondBlock = await footerElement.getByTestId('footer-navigation-block-2').boundingBox();
            const thirdBlock = await footerElement.getByTestId('footer-navigation-block-3').boundingBox();
            const fourthBlock = await footerElement.getByTestId('footer-navigation-block-4').boundingBox();
            const fifthBlock = await footerElement.getByTestId('footer-navigation-block-5').boundingBox();

            await expect(firstBlock.x).toBeLessThanOrEqual(secondBlock.x);
            await expect(firstBlock.y).toEqual(secondBlock.y);

            await expect(firstBlock.x).toBeLessThanOrEqual(thirdBlock.x);
            await expect(firstBlock.y).toEqual(thirdBlock.y);
            await expect(secondBlock.x).toBeLessThanOrEqual(thirdBlock.x);

            await expect(firstBlock.x).toBeLessThanOrEqual(fourthBlock.x);
            await expect(firstBlock.y).toEqual(fourthBlock.y);
            await expect(thirdBlock.x).toBeLessThanOrEqual(fourthBlock.x);

            await expect(firstBlock.x).toBeLessThanOrEqual(fifthBlock.x);
            await expect(firstBlock.y).toEqual(fifthBlock.y);
            await expect(fourthBlock.x).toBeLessThanOrEqual(fifthBlock.x);
        });
    });
});
