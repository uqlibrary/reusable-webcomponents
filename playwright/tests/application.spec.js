import { test, expect } from '@playwright/test';

test.describe('Dummy Application', () => {
    test.describe('Works as expected', () => {
        test('Where javascript is used to alter the base html acts correctly', async ({ page }) => {
            await page.goto('http://localhost:8080/index.html');
            await page.setViewportSize({ width: 1280, height: 900 });
            // applications/testing has a skip nav button
            await expect(page.locator('uq-header').locator('button[data-testid="skip-nav"]')).toBeVisible();
            // has an auth button
            // await expect(page.locator('auth-button').locator('button:contains("Log out")')).toBeVisible();
            await assertHasAuthButton(page);
            await assertHasCulturalAdviceBanner(page);
        });
    });

    async function assertHasUqHeader(page) {
        await expect(page.locator('uq-header').locator('[data-testid="uq-header-logo-large-link"]')).toBeVisible();
    }

    async function assertHasNoUqHeader(page) {
        await expect(page.locator('uq-header')).not.toBeVisible();
    }

    async function assertHasUqSiteHeader(page, sitesearchurl = 'https://www.library.uq.edu.au/') {
        await expect(
            page.locator('uq-site-header').locator('div.uq-site-header').locator('a[data-testid="site-title"]'),
        ).toHaveAttribute('href', sitesearchurl);
    }

    async function assertHasNoUqSiteHeader(page) {
        await expect(page.locator('uq-site-header')).not.toBeVisible();
    }

    async function assertHasNoProactiveChat(page) {
        await expect(page.locator('proactive-chat')).not.toBeVisible();
    }

    async function proactiveChatLoadsAsIcon(page) {
        const proactiveChat = page.locator('proactive-chat');
        // proactive chat icon, for online, shows )other items are hidden
        await expect(proactiveChat.getByTestId('proactive-chat-online')).toBeVisible();
        await expect(proactiveChat.getByTestId('proactive-chat-offline')).not.toBeVisible();
        await expect(proactiveChat.locator('button', { hasText: /Ask Library Chatbot/ }).first()).not.toBeVisible();
        await expect(proactiveChat.locator('button', { hasText: /Leave a question/ }).first()).not.toBeVisible();
        await expect(proactiveChat.getByTestId('close-button')).not.toBeVisible();

        // proactive chat opens on click
        await proactiveChat.getByTestId('proactive-chat-online').click();
        await expect(proactiveChat.locator('button', { hasText: /Ask Library Chatbot/ }).first()).toBeVisible();
        // and closes
        await expect(proactiveChat.getByTestId('close-button')).toBeVisible();
        await proactiveChat.getByTestId('close-button').click();
        await expect(proactiveChat.locator('button', { hasText: /Ask Library Chatbot/ }).first()).not.toBeVisible();
    }

    async function assertHasNoAuthButton(page) {
        await expect(page.locator('auth-button')).not.toBeVisible();
    }

    async function assertHasAnAlert(page) {
        await expect(
            page.locator('alert-list').locator('uq-alert').locator('[data-testid="alert-alert-1"]'),
        ).toBeVisible();
        await expect(
            page.locator('alert-list').locator('uq-alert').locator('[data-testid="alert-alert-1"]'),
        ).toHaveText(/This is the first message/);

        // none of these test systems are primo, so this alert wont appear on any of them
        await expect(
            page.locator('alert-list').locator('uq-alert').locator('[data-testid="alert-alert-2"]'),
        ).not.toBeVisible();
        await expect(
            page.locator('alert-list').locator('uq-alert').locator('[data-testid="alert-link"]'),
        ).toBeVisible();
        await expect(page.locator('alert-list').locator('uq-alert').locator('[data-testid="alert-link"]')).toHaveText(
            /Alert 1 button label/,
        );
        await expect(
            page.locator('alert-list').locator('uq-alert').locator('[data-testid="alert-link"]'),
        ).toBeVisible();

        // not occluded by close button
    }

    async function assertHasNoAlerts(page) {
        await expect(page.locator('alert-list')).not.toBeVisible();
    }

    // function assertHasConnectFooter(page) {
    //     cy.get('connect-footer')
    //         .shadow()
    //         .find('[data-testid="connect-footer-social-heading"]')
    //         .should('exist')
    //         .and('contain', 'Library footer');
    // }
    //
    // function assertHasNoConnectFooter(page) {
    //     cy.get('connect-footer').should('not.exist');
    // }

    async function assertHasUqFooter(page) {
        await expect(page.locator('uq-footer').locator('[data-testid="footer-acknowledgement-link"]')).toBeVisible();
        await expect(page.locator('uq-footer').locator('[data-testid="footer-acknowledgement-link"]')).toHaveText(
            /Reconciliation at UQ/,
        );
    }

    async function assertHasNoUqFooter(page) {
        await expect(page.locator('uq-footer')).not.toBeVisible();
    }

    async function assertHasAuthButton(page, username = 'User, Vanilla') {
        await expect(page.locator('auth-button').locator('[data-testid="username-area-label"]')).toBeVisible();
        await expect(page.locator('auth-button').locator('[data-testid="username-area-label"]')).toHaveText(username);
    }

    async function assertHasCulturalAdviceBanner(page) {
        await expect(page.locator('cultural-advice').getByTestId('culturaladvice-wrapper')).toBeVisible();
        await expect(
            page
                .locator('cultural-advice')
                .getByTestId('culturaladvice-wrapper')
                .getByText(/The Library is custodian of/),
        ).toBeVisible();
    }

    test.describe('app.library.uq.edu.au works as expected', () => {
        test('Javascript load works correctly', async ({ page }) => {
            await page.goto('http://localhost:8080/src/applications/uqlapp/demo.html');
            await page.setViewportSize({ width: 1280, height: 900 });

            await assertHasUqHeader(page);

            await assertHasUqSiteHeader(page);

            await proactiveChatLoadsAsIcon(page);
            await assertHasAuthButton(page);

            await assertHasAnAlert(page);

            // await assertHasConnectFooter(page);
            await assertHasUqFooter(page);
        });
    });

    test.describe('Shared works as expected', () => {
        test('Javascript load works correctly', async ({ page }) => {
            await page.goto('http://localhost:8080/src/applications/shared/demo-randompage.html');
            await page.setViewportSize({ width: 1280, height: 900 });

            await assertHasUqHeader(page);

            await assertHasUqSiteHeader(page);

            await assertHasNoAuthButton(page);
            await assertHasNoProactiveChat(page);
            await assertHasCulturalAdviceBanner(page);

            await assertHasAnAlert(page);

            // assertHasNoConnectFooter(page);

            await assertHasUqFooter(page);
        });
    });

    test.describe('Rightnow works as expected', () => {
        test('Javascript load works correctly', async ({ page }) => {
            await page.goto('http://localhost:8080/src/applications/rightnow/demo.html');
            await page.setViewportSize({ width: 1280, height: 900 });

            await assertHasUqHeader(page);

            await assertHasUqSiteHeader(page);

            await proactiveChatLoadsAsIcon(page);
            await assertHasNoAuthButton(page);

            await assertHasAnAlert(page);

            // await assertHasConnectFooter(page);

            await assertHasUqFooter(page);
        });
    });

    // Primo has no load.js file so is not tested here

    // note that the load.js file calls the live minimal file :(
    test.describe('LibWizard works as expected', () => {
        test('Javascript load works correctly', async ({ page }) => {
            await page.goto('http://localhost:8080/src/applications/libwizard/demo.html');
            await page.setViewportSize({ width: 1280, height: 900 });

            await assertHasUqHeader(page);

            await assertHasUqSiteHeader(page);

            await assertHasNoAuthButton(page);
            await assertHasNoProactiveChat(page);

            await assertHasNoAlerts(page);

            // assertHasNoConnectFooter(page);

            await assertHasNoUqFooter(page);
        });
    });

    test.describe('Springshare Guides works as expected', () => {
        test('homepage is correct', async ({ page }) => {
            await page.goto('http://localhost:8080/src/applications/libguides/demo.html');
            await page.setViewportSize({ width: 1280, height: 900 });

            await assertHasUqHeader(page);

            await assertHasUqSiteHeader(page);

            await assertHasCulturalAdviceBanner(page);

            await proactiveChatLoadsAsIcon(page);
            await assertHasAuthButton(page);

            await assertHasAnAlert(page);

            // await assertHasConnectFooter(page);

            await assertHasUqFooter(page);
        });
        test('detail page with hero and accordion handler works', async ({ page }) => {
            await page.goto('http://localhost:8080/src/applications/libguides/demo-landing.html');
            await page.setViewportSize({ width: 1280, height: 900 });
            // the guides built in breadcrumb has been removed
            const siteHeader = page.locator('uq-site-header');

            // the breadcrumbs has all the children from the guides demo page
            await expect(siteHeader.getByTestId('breadcrumb_nav').locator(':scope > *')).toHaveCount(4);
            await expect(siteHeader.getByTestId('breadcrumb_nav').locator('li:nth-child(3) a')).toHaveAttribute(
                'href',
                `https://guides.library.uq.edu.au/`,
            );
            await expect(siteHeader.getByText(/Guides/).first()).toHaveCSS('text-decoration-line', 'underline');

            // that last not-a-link does not have an underline
            await expect(siteHeader.getByText(/Referencing/).first()).not.toHaveCSS(
                'text-decoration-line',
                'underline',
            );
            // guides built in breadcrumb has been removed
            await expect(siteHeader.locator('#s-lib-bc')).not.toBeVisible();

            // detail hero image loads

            await expect(page.getByTestId('hero-text')).toBeVisible();

            await page.locator('uq-footer').scrollIntoViewIfNeeded();
            // confirm the onload closes the accordions
            await expect(page.getByTestId('research-accordion-button')).toBeVisible();
            const accordionButton = page.getByTestId('research-accordion-button');
            await expect(page.getByTestId('research-accordion-panel')).not.toBeVisible();
            const accordionPanel = page.getByTestId('research-accordion-panel');

            await expect(accordionButton).toHaveAttribute('aria-expanded', 'false');

            // confirm we can click to open an accordion
            await accordionButton.click();
            await expect(accordionButton).toHaveAttribute('aria-expanded', 'true');
            await expect(accordionPanel).toBeVisible();

            // confirm we can click to close an accordion
            await accordionButton.click();
            await expect(accordionButton).toHaveAttribute('aria-expanded', 'false');
            await expect(accordionPanel).not.toBeVisible();
        });
        // hero is set in the hompage template - test in e2e
        test.describe('homepage layout', () => {
            test('is laid out correctly at mobile size', async ({ page }) => {
                await page.goto('http://localhost:8080/src/applications/libguides/demo.html');
                await page.setViewportSize({ width: 320, height: 480 });
                await expect(page.locator('cultural-advice')).toBeVisible();
                await page.locator('cultural-advice').scrollIntoViewIfNeeded();
                // let firstItemTop;
                // let firstItemLeft;
                // cy.get('[data-testid="hero-image"]')
                //     .should('exist')
                //     .should('be.visible')
                //     .within(($el) => {
                //         firstItemTop = $el.position().top;
                //         firstItemLeft = $el.position().left;
                //     });
                // cy.get('[data-testid="hero-words-words-wrapper"]')
                //     .should('exist')
                //     .should('be.visible')
                //     .within(($el) => {
                //         const secondItemTop = $el.position().top;
                //         const secondItemLeft = $el.position().left;
                //
                //         // at mobile size, the image (first) and words (second) are stacked vertically
                //         expect(secondItemTop).to.be.greaterThan(firstItemTop);
                //         expect(secondItemLeft).to.equal(firstItemLeft);
                //     });
            });
            test('is laid out correctly at tablet size', async ({ page }) => {
                await page.goto('http://localhost:8080/src/applications/libguides/demo.html');
                await page.setViewportSize({ width: 840, height: 900 });
                await expect(page.locator('cultural-advice')).toBeVisible();
                await page.locator('cultural-advice').scrollIntoViewIfNeeded();
                // let firstItemTop;
                // let firstItemLeft;
                // cy.get('[data-testid="hero-image"]')
                //     .should('exist')
                //     .should('be.visible')
                //     .within(($el) => {
                //         firstItemTop = $el.position().top;
                //         firstItemLeft = $el.position().left;
                //     });
                // cy.get('[data-testid="hero-words-words-wrapper"]')
                //     .should('exist')
                //     .should('be.visible')
                //     .within(($el) => {
                //         const secondItemTop = $el.position().top;
                //         const secondItemLeft = $el.position().left;
                //
                //         // at tablet size, the image (first) and words (second) are stacked vertically
                //         expect(secondItemTop).to.be.greaterThan(firstItemTop);
                //         expect(secondItemLeft).to.equal(firstItemLeft);
                //     });
            });
            test('is laid out correctly at narrow desktop size', async ({ page }) => {
                await page.goto('http://localhost:8080/src/applications/libguides/demo.html');
                await page.setViewportSize({ width: 905, height: 800 });
                await expect(page.locator('cultural-advice')).toBeVisible();
                await page.locator('cultural-advice').scrollIntoViewIfNeeded();
                // let firstItemTop;
                // let firstItemLeft;
                // cy.get('[data-testid="hero-image"]')
                //     .should('exist')
                //     .should('be.visible')
                //     .within(($el) => {
                //         firstItemTop = $el.position().top;
                //         firstItemLeft = $el.position().left;
                //     });
                // cy.get('[data-testid="hero-words-words-wrapper"]')
                //     .should('exist')
                //     .should('be.visible')
                //     .within(($el) => {
                //         const secondItemTop = $el.position().top;
                //         const secondItemLeft = $el.position().left;
                //
                //         // at narrow desktop, hero image (first) sits to the right of the words (second)
                //         expect(secondItemTop - firstItemTop).to.be.lessThan(1);
                //         expect(secondItemTop - firstItemTop).to.be.greaterThan(-1);
                //         expect(firstItemLeft).to.be.greaterThan(secondItemLeft);
                //     });
            });
            test('is laid out correctly at desktop size', async ({ page }) => {
                await page.goto('http://localhost:8080/src/applications/libguides/demo.html');
                await page.setViewportSize({ width: 1280, height: 900 });
                await expect(page.locator('cultural-advice')).toBeVisible();
                await page.locator('cultural-advice').scrollIntoViewIfNeeded();
                // let firstItemTop;
                // let firstItemLeft;
                // cy.get('[data-testid="hero-image"]')
                //     .should('exist')
                //     .should('be.visible')
                //     .within(($el) => {
                //         firstItemTop = $el.position().top;
                //         firstItemLeft = $el.position().left;
                //     });
                // cy.get('[data-testid="hero-words-words-wrapper"]')
                //     .should('exist')
                //     .should('be.visible')
                //     .within(($el) => {
                //         const secondItemTop = $el.position().top;
                //         const secondItemLeft = $el.position().left;
                //
                //         // at desktop, hero image (first) sits to the right of the words (second)
                //         expect(secondItemTop - firstItemTop).to.be.lessThan(1);
                //         expect(secondItemTop - firstItemTop).to.be.greaterThan(-1);
                //         expect(secondItemLeft).to.be.lessThan(firstItemLeft);
                //     });
            });
        });
    });

    test.describe('Springshare Cal works as expected', () => {
        test('Javascript load works correctly', async ({ page }) => {
            await page.goto('http://localhost:8080/src/applications/libcal/demo.html');
            await page.setViewportSize({ width: 1280, height: 900 });

            await assertHasUqHeader(page);

            await assertHasUqSiteHeader(page);

            // the breadcrumbs are moved from the springshare location into our uq-site-header

            await expect(page.locator('uq-site-header').locator('[data-testid="breadcrumb_nav"]')).toBeVisible();
            await expect(
                page.locator('uq-site-header').locator('[data-testid="breadcrumb_nav"]').locator(':scope > *'),
            ).toHaveCount(5);

            await proactiveChatLoadsAsIcon(page);
            await assertHasNoAuthButton(page);
            await assertHasCulturalAdviceBanner(page);

            await assertHasAnAlert(page);

            // await assertHasConnectFooter(page);

            await assertHasUqFooter(page);
        });
    });

    test.describe('Drupal works as expected', () => {
        test('Sample page load works correctly', async ({ page }) => {
            await page.goto('http://localhost:8080/src/applications/drupal/demo.html');
            await page.setViewportSize({ width: 1280, height: 900 });

            //assertHasNoUqHeader(); // drupal supplies that

            await assertHasCulturalAdviceBanner(page);

            // we use the drupal utility bar instead of our uq-site-header and inject our auth button into it
            await assertHasAuthButton(page);

            await assertHasAnAlert(page);
            // a drupal specific alert appears
            await expect(
                page.locator('alert-list').locator('uq-alert').locator('[data-testid="alert-alert-3"]'),
            ).toBeVisible();
            await expect(
                page.locator('alert-list').locator('uq-alert').locator('[data-testid="alert-alert-3"]'),
            ).toHaveText(/This is another message/);

            // assertHasNoConnectFooter(page);

            await proactiveChatLoadsAsIcon(page);

            await assertHasNoUqFooter(page); // drupal supplies that

            // simple check that the components exist, now that we are splitting them out from the main reusable.min file
            await expect(page.locator('open-athens').locator('fieldset input')).toHaveAttribute(
                'placeholder',
                /DOI or URL/,
            );
            await expect(page.locator('library-training').locator('training-filter').locator('h3')).toHaveText(
                /Filter events/,
            );
        });
        test('does not have any web components on a specifically named Drupal page', async ({ page }) => {
            await page.goto('http://localhost:8080/src/applications/drupal/pageWithoutComponents.html');
            await page.setViewportSize({ width: 1280, height: 900 });

            await assertHasNoUqHeader(page);

            await assertHasNoUqSiteHeader(page);

            await assertHasNoAlerts(page);

            // assertHasNoConnectFooter(page);

            await assertHasNoUqFooter(page);
        });
    });

    test.describe('Auth works as expected', () => {
        test('Javascript load works correctly', async ({ page }) => {
            await page.goto('http://localhost:8080/src/applications/auth/demo.html');
            await page.setViewportSize({ width: 1280, height: 900 });

            await assertHasUqHeader(page);

            await assertHasUqSiteHeader(page);

            await proactiveChatLoadsAsIcon(page);
            await assertHasNoAuthButton(page);

            await assertHasAnAlert(page);

            await assertHasUqFooter(page);
        });
    });

    test.describe('Atom works as expected', () => {
        async function assertHasBookNowLink(page) {
            // there is a "book now" type link in the sidebar
            const bookingUrl = 'https://calendar.library.uq.edu.au/reserve/spaces/reading-room';
            await expect(
                page.locator('#context-menu').locator('..').locator('[data-testid="booknowLink"] a'),
            ).toBeVisible();
            await expect(
                page.locator('#context-menu').locator('..').locator('[data-testid="booknowLink"] a'),
            ).toHaveAttribute('href', bookingUrl);
        }

        test('Sample home page load works correctly', async ({ page }) => {
            await page.goto('http://localhost:8080/src/applications/atom/demo-homepage.html');
            await page.setViewportSize({ width: 1280, height: 900 });

            await assertHasCulturalAdviceBanner(page);
        });

        test('Sample detail page load works correctly', async ({ page }) => {
            await page.goto('http://localhost:8080/src/applications/atom/demo-detailpage.html');
            await page.setViewportSize({ width: 1280, height: 900 });

            await assertHasBookNowLink(page);

            await assertHasCulturalAdviceBanner(page); // site CA banner

            // has cultural advice banner for this record
            await expect(page.getByTestId('culturalAdviceBanner')).toBeVisible();
            await expect(
                page.getByTestId('culturalAdviceBanner').getByText(/Aboriginal and Torres Strait Islander peoples/),
            ).toBeVisible();
        });
    });

    test.describe('espace displays as expected', () => {
        test('Javascript load works correctly', async ({ page }) => {
            await page.goto('http://localhost:8080/src/applications/espace/example.html');
            await page.setViewportSize({ width: 1450, height: 900 });

            // assertHasUqHeader(page);
            //
            // assertHasUqSiteHeader(page'https://espace.library.uq.edu.au/');
            //
            // assertHasAuthButton(page);

            await assertHasAnAlert(page);

            // assertHasNoUqFooter(page);
        });
    });
});
