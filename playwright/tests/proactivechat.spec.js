import { test, expect } from '@playwright/test';
import { assertAccessibility } from '../lib/axe';

var _helpers = require('../../src/UtilityArea/helpers');
const COLOUR_UQ_GREY300 = 'rgb(117, 115, 119)';

async function assertPopupIsOpen(page) {
    const proactiveChatElement = page.locator('proactive-chat');
    await expect(proactiveChatElement.getByTestId('popupIsOpen')).toBeVisible();
    await expect(proactiveChatElement.getByTestId('popupIsOpen')).toHaveClass(/show/);

    await expect(
        page.locator('proactive-chat').getByRole('button', { name: 'Ask Library Chat Bot a question' }),
    ).toBeVisible();
    await expect(proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' })).toHaveCSS(
        'background-color',
        _helpers.COLOUR_UQ_PURPLE,
    );
}

async function assertHideCookieUnset(context) {
    const cookies = await context.cookies();
    const hideCookie = cookies.find((c) => c.name === 'UQ_PROACTIVE_CHAT');
    await expect(!!hideCookie).toEqual(false);
}

test.describe('Proactive Chat', () => {
    test('will proactively open on user first visit (when "hide" cookie is not set)', async ({ page }) => {
        await page.goto('http://localhost:8080/index-chat-fast.html');
        await page.setViewportSize({ width: 1280, height: 900 });
        const proactiveChatElement = page.locator('proactive-chat');

        // now the popup is open (simulate user first visit, no "hide" cookie present)
        await assertPopupIsOpen(page);

        // button has correct look and feel
        await expect(proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' })).toHaveCSS(
            'background-color',
            _helpers.COLOUR_UQ_PURPLE,
        );
        await proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }).hover();
        await expect(proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' })).toHaveCSS(
            'background-color',
            'rgb(255, 255, 255)',
        );
        await expect(proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' })).toHaveCSS(
            'border-color',
            _helpers.COLOUR_UQ_PURPLE,
        );
    });

    test.describe('Proactive chat passes accessibility', () => {
        test('online minimised', async ({ page }) => {
            await page.goto('http://localhost:8080/index-chat-slow.html');
            await page.setViewportSize({ width: 1280, height: 900 });

            await expect(page.locator('proactive-chat').getByTestId('proactive-chat-online')).toBeVisible();

            await assertAccessibility(page, 'proactive-chat');
        });
        test('offline minimised', async ({ page }) => {
            await page.goto('http://localhost:8080/index-chat-slow.html?chatstatusoffline=true');
            await page.setViewportSize({ width: 1280, height: 900 });

            await expect(page.locator('proactive-chat').getByTestId('proactive-chat-offline')).toBeVisible();

            await assertAccessibility(page, 'proactive-chat');
        });
        test('proactive chat open', async ({ page }) => {
            await page.goto('http://localhost:8080/index-chat-fast.html');
            await page.setViewportSize({ width: 1280, height: 900 });
            const proactiveChatElement = page.locator('proactive-chat');

            await expect(
                proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }),
            ).toBeVisible();
            await assertAccessibility(page, 'proactive-chat');

            await proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }).hover();
            await expect(
                proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }),
            ).toHaveCSS('background-color', 'rgb(255, 255, 255)');
            await assertAccessibility(page, 'proactive-chat');
        });
        test('proactive chat open after hours', async ({ page }) => {
            await page.goto('http://localhost:8080/index-chat-fast.html?chatstatusoffline=true');
            await page.setViewportSize({ width: 1280, height: 900 });
            await expect(
                page.locator('proactive-chat').getByRole('button', { name: 'Ask Library Chat Bot a question' }),
            ).toBeVisible();
            await assertAccessibility(page, 'proactive-chat');
        });
        test('iframe open', async ({ page }) => {
            await page.goto('http://localhost:8080/index-chat-fast.html');
            await page.setViewportSize({ width: 1280, height: 900 });
            const proactiveChatElement = page.locator('proactive-chat');

            await expect(
                proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }),
            ).toBeVisible();
            await proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }).click();

            // can see iframe
            await expect(page.locator('proactive-chat').getByTestId('chatbot-wrapper')).toBeVisible();
            await assertAccessibility(page, 'proactive-chat', {
                disabledRules: [
                    'region', // it is complaining about the content of the iframe - when we only get dummy content at localhost!
                    'landmark-one-main',
                    'page-has-heading-one',
                ],
            });
        });
        test('iframe open after hours', async ({ page }) => {
            await page.goto('http://localhost:8080/index-chat-fast.html?chatstatusoffline=true');
            await page.setViewportSize({ width: 1280, height: 900 });
            const proactiveChatElement = page.locator('proactive-chat');

            await expect(
                proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }),
            ).toBeVisible();
            await proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }).click();

            // can see iframe
            await expect(page.locator('proactive-chat').getByTestId('chatbot-wrapper')).toBeVisible();
            await expect(page.locator('proactive-chat').getByTestId('chatbot-wrapper')).toBeVisible();
            await expect(page.locator('proactive-chat').getByTestId('chatbot-wrapper')).toBeVisible();
            await assertAccessibility(page, 'proactive-chat', {
                disabledRules: [
                    'region', // it is complaining about the content of the iframe - when we only get dummy content at localhost!
                    'landmark-one-main',
                    'page-has-heading-one',
                ],
            });
        });
    });

    test.describe('when online', () => {
        test('Can hide proactive chat button', async ({ page, context }) => {
            async function assertHideChatCookieisSet(context) {
                const cookies = await context.cookies();
                const hideCookie = cookies.find((c) => c.name === 'UQ_PROACTIVE_CHAT');
                await expect(hideCookie.value).toEqual('hidden');
            }
            async function assertPopupIsHidden(page) {
                await expect(
                    page.locator('proactive-chat').locator('[data-testid="close-button"]').locator('..'),
                ).not.toBeVisible();
                await expect(
                    page.locator('proactive-chat').locator('[data-testid="close-button"]').locator('..'),
                ).not.toHaveClass(/show/);
            }

            await page.goto('http://localhost:8080/index-chat-fast.html');
            await page.setViewportSize({ width: 1280, height: 900 });
            const proactiveChatElement = page.locator('proactive-chat');

            await assertPopupIsOpen(page);

            // close popup
            await expect(proactiveChatElement.locator('[data-testid="close-button"]')).toBeVisible();
            await proactiveChatElement.locator('[data-testid="close-button"]').click();

            await assertHideChatCookieisSet(context);
            await assertPopupIsHidden(page);

            // reload the page and, because of the cookie, the popup doesn't appear
            await page.goto('http://localhost:8080/index-chat-fast.html');
            await assertHideChatCookieisSet(context);
            await assertPopupIsHidden(page);

            // "online Minimised" button is visible
            await expect(proactiveChatElement.getByTestId('proactive-chat-online')).toBeVisible();
            await expect(proactiveChatElement.getByTestId('proactive-chat-online')).not.toHaveCSS('display', 'none');
            await expect(proactiveChatElement.getByTestId('proactive-chat-online')).toHaveCSS(
                'background-color',
                _helpers.COLOUR_UQ_PURPLE,
            );
            await expect(proactiveChatElement.getByTestId('proactive-chat-online').locator('..')).toHaveCSS(
                'right',
                '16px',
            );

            // "offline Minimised" button is hidden. Well duh, but just checking
            await expect(proactiveChatElement.getByTestId('proactive-chat-offline')).not.toBeVisible();
            await expect(proactiveChatElement.getByTestId('proactive-chat-offline')).toHaveCSS('display', 'none');
        });

        test.skip('Navigates to CRM from "Chat with Library staff" button', async ({ page }) => {
            await page.goto('http://localhost:8080/index-chat-fast.html');
            const proactiveChatElement = page.locator('proactive-chat');

            await expect(proactiveChatElement.getByTestId('crm-chat-button')).toBeVisible();
            await proactiveChatElement.getByTestId('crm-chat-button').click();

            // expected page opens
            const newTabPromise = page.waitForEvent('popup');
            const newTab = await newTabPromise;
            await newTab.waitForLoadState();
            await expect(newTab).toHaveURL(
                'https://uqcurrent.crm.test.uq.edu.au/app/chat/chat_launch_lib/p/45?email=vanilla@example.uq.edu.au&name=Vanilla',
            );
        });

        test.skip('Navigates to CRM from iframe "Person" button', async ({ page }) => {
            await page.goto('http://localhost:8080/index-chat-slow.html');
            await page.setViewportSize({ width: 1280, height: 900 });
            const proactiveChatElement = page.locator('proactive-chat');

            // await proactiveChatElement.getByTestId('crm-chat-button').click();
            await expect(proactiveChatElement.getByTestId('proactive-chat-online')).toBeVisible();
            await proactiveChatElement.getByTestId('proactive-chat-online').click();

            await expect(
                proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }),
            ).toBeVisible();
            await proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }).click();

            // iframe is open
            await expect(proactiveChatElement.getByTestId('chatbot-iframe')).toBeVisible();
            const chatbotIframe = await proactiveChatElement.getByTestId('chatbot-iframe').boundingBox();
            await expect(chatbotIframe.height).toBeGreaterThan(400);

            // can click "person" button
            await expect(
                proactiveChatElement.getByRole('button', { name: 'Chat with Library staff now' }),
            ).toBeVisible();
            await proactiveChatElement.getByRole('button', { name: 'Chat with Library staff now' }).click();

            // expected page opens
            const newTabPromise = page.waitForEvent('popup');
            const newTab = await newTabPromise;
            await newTab.waitForLoadState();
            await expect(newTab).toHaveURL(
                'https://uqcurrent.crm.test.uq.edu.au/app/chat/chat_launch_lib/p/45?email=vanilla@example.uq.edu.au&name=Vanilla',
            );
        });

        test('AI chatbot iframe opens from proactive dialog for logged in user', async ({ page, context }) => {
            await page.goto('http://localhost:8080/index-chat-fast.html');
            await page.setViewportSize({ width: 1280, height: 900 });
            await assertHideCookieUnset(context);

            // // manually wait
            // await page.waitForTimeout(100);

            const proactiveChatElement = page.locator('proactive-chat');

            await assertPopupIsOpen(page);
            await expect(proactiveChatElement.getByTestId('popupIsOpen')).toBeVisible();
            await proactiveChatElement.getByTestId('popupIsOpen').click();

            // // let the iframe finish drawing
            // await page.waitForTimeout(4000);
            await expect(proactiveChatElement.getByTestId('chatbot-wrapper')).toBeVisible(); // well, at least we know the iframe reaches the page!

            // logged in user is correctly attached to the page
            await expect(proactiveChatElement.getByTestId('chatbot-iframe')).toBeVisible();
            await expect(proactiveChatElement.getByTestId('chatbot-iframe')).toHaveAttribute(
                'src',
                'http://localhost:2020/chatbot.html?name=Vanilla&email=vanilla@example.uq.edu.au',
            );

            // can close iframe
            await expect(proactiveChatElement.getByTestId('closeIframeButton')).toBeVisible();
            await proactiveChatElement.getByTestId('closeIframeButton').click();
            // once the chatbot is closed, the minimised icon appears
            await expect(proactiveChatElement.getByTestId('proactive-chat-online')).toBeVisible();

            // can reopen iframe
            await expect(proactiveChatElement.getByTestId('proactive-chat-online')).toBeVisible();
            await proactiveChatElement.getByTestId('proactive-chat-online').click();
            await expect(
                proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }),
            ).toBeVisible();
            await proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }).click();
            await expect(proactiveChatElement.getByTestId('chatbot-wrapper')).toBeVisible();
            await expect(proactiveChatElement.getByTestId('chatbot-wrapper')).toBeVisible();
        });

        test('AI chatbot iframe opens from proactive dialog for logged out user', async ({ page, context }) => {
            await page.goto('http://localhost:8080/index-chat-fast.html?user=public');
            await page.setViewportSize({ width: 1280, height: 900 });
            await assertHideCookieUnset(context);

            // // manually wait
            // await page.waitForTimeout(100);

            await assertPopupIsOpen(page);
            const proactiveChatElement = page.locator('proactive-chat');
            await expect(
                proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }),
            ).toBeVisible();
            await proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }).click();

            // let the iframe finish drawing
            await page.waitForTimeout(4000);
            await expect(proactiveChatElement.getByTestId('chatbot-wrapper')).toBeVisible(); // well, at least we know the iframe reaches the page!

            // logged-in user is correctly attached to the page
            await expect(proactiveChatElement.getByTestId('chatbot-iframe')).toBeVisible();
            await expect(proactiveChatElement.getByTestId('chatbot-iframe')).toHaveAttribute(
                'src',
                'http://localhost:2020/chatbot.html',
            ); // logged out so no user params
        });

        test('minimised button click opens proactive dialog', async ({ page }) => {
            // delay the proactive apearance so we can reliably click on the green button
            await page.goto('http://localhost:8080/index-chat-slow.html');
            await page.setViewportSize({ width: 1280, height: 900 });
            const proactiveChatElement = page.locator('proactive-chat');

            // proactive dialog is hidden
            await expect(proactiveChatElement.getByTestId('popupIsOpen')).not.toBeVisible();

            // minimised online button appearance as expected
            await expect(proactiveChatElement.getByTestId('proactive-chat-online')).toBeVisible();
            await expect(proactiveChatElement.getByTestId('proactive-chat-online')).toHaveCSS(
                'background-color',
                _helpers.COLOUR_UQ_PURPLE,
            );
            await proactiveChatElement.getByTestId('proactive-chat-online').hover();
            await expect(proactiveChatElement.getByTestId('proactive-chat-online')).toHaveCSS(
                'background-color',
                'rgb(255, 255, 255)',
            );

            await proactiveChatElement.getByTestId('proactive-chat-online').click();

            // now proactive dialog shows
            await expect(proactiveChatElement.getByTestId('popupIsOpen')).toBeVisible();
        });
    });

    test.describe('when offline', () => {
        test('Navigates to chatbot when offline', async ({ page }) => {
            await page.goto('http://localhost:8080/index-chat-slow.html?chatstatusoffline=true');
            await page.setViewportSize({ width: 1280, height: 900 });
            const proactiveChatElement = page.locator('proactive-chat');

            // click minimised icon
            await proactiveChatElement.getByTestId('proactive-chat-offline').click();

            // click "ask library chatbot" button
            await expect(
                proactiveChatElement.locator('button', { hasText: /Ask Library Chatbot/ }).first(),
            ).toBeVisible();
            await proactiveChatElement
                .locator('button', { hasText: /Ask Library Chatbot/ })
                .first()
                .click();

            // iframe is open
            await expect(proactiveChatElement.getByTestId('chatbot-iframe')).toBeVisible();
            const chatbotIframe = await proactiveChatElement.getByTestId('chatbot-iframe').boundingBox();
            await expect(chatbotIframe.height).toBeGreaterThan(400);
        });

        test('Navigates to contact us from proactive "Leave a question" button when offline', async ({ page }) => {
            await page.goto('http://localhost:8080/index-chat-fast.html?chatstatusoffline=true');
            const proactiveChatElement = page.locator('proactive-chat');

            await expect(
                proactiveChatElement.getByRole('button', { name: 'No staff available to chat - Leave a question' }),
            ).toBeVisible();

            await proactiveChatElement
                .getByRole('button', { name: 'No staff available to chat - Leave a question' })
                .click();

            // expected page loads in new tab
            const newTabPromise = page.waitForEvent('popup');
            const newTab = await newTabPromise;
            await newTab.waitForLoadState();
            await expect(newTab).toHaveURL('https://support.my.uq.edu.au/app/library/contact');
        });

        test('Navigates to contact us from iframe "Leave a question" button when offline', async ({
            page,
            context,
        }) => {
            await page.goto('http://localhost:8080/index-chat-fast.html?chatstatusoffline=true');
            const proactiveChatElement = page.locator('proactive-chat');

            await assertHideCookieUnset(context);
            await assertPopupIsOpen(page);

            await proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }).click();

            await proactiveChatElement.getByRole('button', { name: 'Staff unavailable - leave a question' }).click();

            // expected page loads in new tab
            const newTabPromise = page.waitForEvent('popup');
            const newTab = await newTabPromise;
            await newTab.waitForLoadState();
            await expect(newTab).toHaveURL('https://support.my.uq.edu.au/app/library/contact');
        });
    });

    test('Displays as offline when chat status api is 403', async ({ page }) => {
        await page.goto('http://localhost:8080/index-chat-slow.html?user=errorUser');
        await page.setViewportSize({ width: 1280, height: 900 });
        const proactiveChatElement = page.locator('proactive-chat');

        // "online Minimised" button is hidden
        await expect(proactiveChatElement.getByTestId('proactive-chat-online')).not.toBeVisible();
        await expect(proactiveChatElement.getByTestId('proactive-chat-online')).toHaveCSS('display', 'none');

        // "offline Minimised" button shows
        await expect(proactiveChatElement.getByTestId('proactive-chat-offline')).toBeVisible();
        await expect(proactiveChatElement.getByTestId('proactive-chat-offline')).not.toHaveCSS('display', 'none');
        await expect(proactiveChatElement.getByTestId('proactive-chat-offline')).toHaveCSS(
            'background-color',
            COLOUR_UQ_GREY300,
        );
        await expect(proactiveChatElement.getByTestId('proactive-chat-offline').locator('..')).toHaveCSS(
            'right',
            '16px',
        );
    });

    test.describe('when inserting proactive chat within the body of the page', () => {
        test.skip('should load crm correctly', async ({ page }) => {
            await page.goto('http://localhost:8080/index-drupalcontactus.html');
            const inlineProactiveChatElement = page.locator('proactive-chat[display="inline"]');

            await inlineProactiveChatElement.getByTestId('crm-chat-button').click();

            // expected page loads in new tab
            const newTabPromise = page.waitForEvent('popup');
            const newTab = await newTabPromise;
            await newTab.waitForLoadState();
            await expect(newTab).toHaveURL(
                'https://uqcurrent.crm.test.uq.edu.au/app/chat/chat_launch_lib/p/45?email=vanilla@example.uq.edu.au&name=Vanilla',
            );
        });
        test('should load chatbot correctly', async ({ page, context }) => {
            await page.goto('http://localhost:8080/index-drupalcontactus.html');
            await page.setViewportSize({ width: 1280, height: 900 });
            const inlineProactiveChatElement = page.locator('proactive-chat[display="inline"]');
            const proactiveChatElement = page.locator('proactive-chat:not([display="inline"])');

            await assertHideCookieUnset(context);
            await expect(inlineProactiveChatElement.getByTestId('popupIsOpen')).toBeVisible();
            await expect(inlineProactiveChatElement.getByTestId('popupIsOpen')).toHaveClass(/show/);

            await expect(
                inlineProactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }),
            ).toBeVisible();
            await inlineProactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }).click();

            await expect(proactiveChatElement.getByTestId('chatbot-iframe')).toBeVisible(); // well, at least we know the iframe reaches the page!
            const chatbotIframe = await proactiveChatElement.getByTestId('chatbot-iframe').boundingBox();
            await expect(chatbotIframe.height).toBeGreaterThan(400);

            // can close iframe
            await expect(proactiveChatElement.getByTestId('closeIframeButton')).toBeVisible();
            await proactiveChatElement.getByTestId('closeIframeButton').click();

            // once the chatbot is closed, the minimised icon appears
            await expect(proactiveChatElement.getByTestId('proactive-chat-online')).toBeVisible();
        });
        test('should handle after hours', async ({ page, context }) => {
            await page.goto('http://localhost:8080/index-drupalcontactus.html?chatstatusoffline=true');
            await page.setViewportSize({ width: 1280, height: 900 });
            const inlineProactiveChatElement = page.locator('proactive-chat[display="inline"]');

            await assertHideCookieUnset(context);
            await expect(inlineProactiveChatElement.getByTestId('popupIsOpen')).toBeVisible();
            await expect(inlineProactiveChatElement.getByTestId('popupIsOpen')).toHaveClass(/show/);

            await expect(
                inlineProactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }),
            ).toBeVisible();

            await inlineProactiveChatElement
                .getByRole('button', { name: 'No staff available to chat - Leave a question' })
                .click();

            // expected page loads in new tab
            const newTabPromise = page.waitForEvent('popup');
            const newTab = await newTabPromise;
            await newTab.waitForLoadState();
            await expect(newTab).toHaveURL('https://support.my.uq.edu.au/app/library/contact');
        });
    });
    test.describe('when chatbot is known to be unavailable', () => {
        test('gives a link to CRM chat when askus is online', async ({ page }) => {
            await page.goto('http://localhost:8080/index-app-nochatbot.html');
            await page.setViewportSize({ width: 1280, height: 900 });
            const proactiveChatElement = page.locator('proactive-chat');

            await expect(proactiveChatElement.getByTestId('proactive-chat-online')).toBeVisible();
            await proactiveChatElement.getByTestId('proactive-chat-online').click();

            await expect(proactiveChatElement.getByTestId('crm-chat-button')).toBeVisible();
            await expect(proactiveChatElement.getByTestId('crm-chat-button')).toHaveCSS(
                'background-color',
                _helpers.COLOUR_UQ_PURPLE,
            );
            await expect(
                proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }),
            ).not.toBeVisible();
        });
        test('gives a link to CRM contact form when askus is offline', async ({ page }) => {
            await page.goto('http://localhost:8080/index-app-nochatbot.html?chatstatusoffline=true');
            await page.setViewportSize({ width: 1280, height: 900 });
            const proactiveChatElement = page.locator('proactive-chat');

            await expect(proactiveChatElement.getByTestId('proactive-chat-offline')).toBeVisible();
            await proactiveChatElement.getByTestId('proactive-chat-offline').click();

            await expect(
                proactiveChatElement.getByRole('button', { name: 'No staff available to chat - Leave a question' }),
            ).toBeVisible();
            await expect(
                proactiveChatElement.getByRole('button', { name: 'No staff available to chat - Leave a question' }),
            ).toHaveCSS('background-color', _helpers.COLOUR_UQ_PURPLE);
            await expect(
                proactiveChatElement.getByRole('button', { name: 'Ask Library Chat Bot a question' }),
            ).not.toBeVisible();
        });
    });
});
