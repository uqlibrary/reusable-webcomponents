import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('Space Availability widget', () => {
    const assertLayout = async (page, direction = 'row') => {
        const first = page.locator('space-availability[id="7877"]');
        const second = page.locator('space-availability[id="7878"]');

        const firstBox = await first.boundingBox();
        const secondBox = await second.boundingBox();

        if (direction === 'row') {
            // same row
            expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(5);
            // side-by-side, not stacked/overlapping
            expect(secondBox.x).toBeGreaterThanOrEqual(firstBox.x + firstBox.width);
        } else if (direction === 'column') {
            // left-aligned to the same column
            expect(Math.abs(firstBox.x - secondBox.x)).toBeLessThan(5);
            // stacked, not side-by-side/overlapping
            expect(secondBox.y).toBeGreaterThanOrEqual(firstBox.y + firstBox.height);
        }
    };

    const installApiCallCounter = async (page) => {
        await page.evaluate(() => {
            const service = window.spaceAvailabilityDataService;

            if (!window.__spaceAvailabilityOriginalApiCallback) {
                window.__spaceAvailabilityOriginalApiCallback = service.apiCallback;
                window.__spaceAvailabilityPollCount = 0;

                service.apiCallback = async (...args) => {
                    window.__spaceAvailabilityPollCount += 1;
                    return window.__spaceAvailabilityOriginalApiCallback(...args);
                };
            }
        });
    };

    const resetApiCallCounter = async (page) => {
        await page.evaluate(() => {
            window.__spaceAvailabilityPollCount = 0;
        });
    };

    const assertApiWasCalled = async (page, times = 1, timeout = 3 * 60 * 1000, called = true) => {
        await installApiCallCounter(page);
        await resetApiCallCounter(page);

        await page.clock.fastForward(timeout);

        await expect.poll(() => page.evaluate(() => window.__spaceAvailabilityPollCount)).toBe(called ? times : 0);
    };

    const assertApiWasNotCalled = async (page, timeout = 3 * 60 * 1000) => {
        await assertApiWasCalled(page, 0, timeout, false);
    };

    test.describe('multiple instances per page', () => {
        test.beforeEach(async ({ page, context }) => {
            await page.clock.install();
            await context.clearCookies();
            await context.addCookies([
                { name: 'UQ_PROACTIVE_CHAT', value: 'hidden', path: '/', domain: 'localhost:8080' },
            ]);

            await page.goto('http://localhost:8080/src/SpaceAvailability/example.html');
        });

        test('should display multiple instances correctly at 1280px wide', async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            await expect(page.locator('space-availability')).toHaveCount(9);
            await assertAccessibility(page, '.space-availability-wrapper');

            let spaceAvailability = page.locator('space-availability[id="7877"]');
            await expect(spaceAvailability.locator('.space-availability__title')).toHaveText('Architecture and Music');
            await expect(spaceAvailability.locator('.space-availability__subtitle')).toHaveText('105 seats');
            await expect(spaceAvailability.locator('.space-availability__chart_label')).toHaveText('14% of capacity');
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveClass(
                /space-availability__bar_green/,
            );
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveAttribute(
                'style',
                'width: 14%;',
            );
            await expect(spaceAvailability.locator('#spaceAvailabilityTimerControl')).toHaveAttribute(
                'aria-pressed',
                'false',
            );

            spaceAvailability = page.locator('space-availability[id="7878"]');
            await expect(spaceAvailability.locator('.space-availability__title')).toHaveText('Biological Sciences');
            await expect(spaceAvailability.locator('.space-availability__subtitle')).toHaveText('595 seats');
            await expect(spaceAvailability.locator('.space-availability__chart_label')).toHaveText('42% of capacity');
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveClass(
                /space-availability__bar_green/,
            );
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveAttribute(
                'style',
                'width: 42%;',
            );
            await expect(spaceAvailability.locator('#spaceAvailabilityTimerControl')).toHaveAttribute(
                'aria-pressed',
                'false',
            );

            spaceAvailability = page.locator('space-availability[id="7665"]');
            await expect(spaceAvailability.locator('.space-availability__title')).toHaveText('Central');
            await expect(spaceAvailability.locator('.space-availability__subtitle')).toHaveText('770 seats');
            await expect(spaceAvailability.locator('.space-availability__chart_label')).toHaveText('71% of capacity');
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveClass(
                /space-availability__bar_yellow/,
            );
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveAttribute(
                'style',
                'width: 71%;',
            );
            await expect(spaceAvailability.locator('#spaceAvailabilityTimerControl')).toHaveAttribute(
                'aria-pressed',
                'false',
            );

            spaceAvailability = page.locator('space-availability[id="7879"]');
            await expect(spaceAvailability.locator('.space-availability__title')).toHaveText(
                'Dorothy Hill Engineering and Sciences',
            );
            await expect(spaceAvailability.locator('.space-availability__subtitle')).toHaveText('315 seats');
            await expect(spaceAvailability.locator('.space-availability__chart_label')).toHaveText('95% of capacity');
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveClass(
                /space-availability__bar_red/,
            );
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveAttribute(
                'style',
                'width: 95%;',
            );
            await expect(spaceAvailability.locator('#spaceAvailabilityTimerControl')).toHaveAttribute(
                'aria-pressed',
                'false',
            );

            // assert side-by-side
            await assertLayout(page, 'row');

            // assert API was called after standard interval
            await assertApiWasCalled(page);
        });

        test('should display multiple instances correctly at 320px wide', async ({ page }) => {
            await page.setViewportSize({ width: 320, height: 900 });
            await expect(page.locator('space-availability')).toHaveCount(9);
            await assertAccessibility(page, '.space-availability-wrapper');

            let spaceAvailability = page.locator('space-availability[id="7877"]');
            await expect(spaceAvailability.locator('.space-availability__title')).toHaveText('Architecture and Music');
            await expect(spaceAvailability.locator('.space-availability__subtitle')).toHaveText('105 seats');
            await expect(spaceAvailability.locator('.space-availability__chart_label')).toHaveText('14% of capacity');
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveClass(
                /space-availability__bar_green/,
            );
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveAttribute(
                'style',
                'width: 14%;',
            );
            await expect(spaceAvailability.locator('#spaceAvailabilityTimerControl')).toHaveAttribute(
                'aria-pressed',
                'false',
            );

            spaceAvailability = page.locator('space-availability[id="7878"]');
            await expect(spaceAvailability.locator('.space-availability__title')).toHaveText('Biological Sciences');
            await expect(spaceAvailability.locator('.space-availability__subtitle')).toHaveText('595 seats');
            await expect(spaceAvailability.locator('.space-availability__chart_label')).toHaveText('42% of capacity');
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveClass(
                /space-availability__bar_green/,
            );
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveAttribute(
                'style',
                'width: 42%;',
            );
            await expect(spaceAvailability.locator('#spaceAvailabilityTimerControl')).toHaveAttribute(
                'aria-pressed',
                'false',
            );

            spaceAvailability = page.locator('space-availability[id="7665"]');
            await expect(spaceAvailability.locator('.space-availability__title')).toHaveText('Central');
            await expect(spaceAvailability.locator('.space-availability__subtitle')).toHaveText('770 seats');
            await expect(spaceAvailability.locator('.space-availability__chart_label')).toHaveText('71% of capacity');
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveClass(
                /space-availability__bar_yellow/,
            );
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveAttribute(
                'style',
                'width: 71%;',
            );
            await expect(spaceAvailability.locator('#spaceAvailabilityTimerControl')).toHaveAttribute(
                'aria-pressed',
                'false',
            );

            spaceAvailability = page.locator('space-availability[id="7879"]');
            await expect(spaceAvailability.locator('.space-availability__title')).toHaveText(
                'Dorothy Hill Engineering and Sciences',
            );
            await expect(spaceAvailability.locator('.space-availability__subtitle')).toHaveText('315 seats');
            await expect(spaceAvailability.locator('.space-availability__chart_label')).toHaveText('95% of capacity');
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveClass(
                /space-availability__bar_red/,
            );
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveAttribute(
                'style',
                'width: 95%;',
            );
            await expect(spaceAvailability.locator('#spaceAvailabilityTimerControl')).toHaveAttribute(
                'aria-pressed',
                'false',
            );

            // assert stacked layout
            await assertLayout(page, 'column');

            // assert API was called after standard interval
            await assertApiWasCalled(page);
        });

        test('should handle pause button being pressed', async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            await expect(page.locator('space-availability')).toHaveCount(9);

            const spaceAvailability1 = page.locator('space-availability[id="7877"]');
            const spaceAvailability2 = page.locator('space-availability[id="7878"]');
            const spaceAvailability3 = page.locator('space-availability[id="7665"]');

            // the accessibility pause button is hidden by default, so force the first
            // button to appear by removing the hidden class. This should allow us
            // to press the button without issue (note: force:true didnt work here)
            const spaceAvailability1ButtonWrapper = spaceAvailability1.locator('.space-availability__timer_control');
            await spaceAvailability1ButtonWrapper.evaluate((el) => {
                el.classList.remove('visually-hidden');
            });

            const pauseButton1 = spaceAvailability1.locator('#spaceAvailabilityTimerControl');
            const pauseButton2 = spaceAvailability2.locator('#spaceAvailabilityTimerControl');
            const pauseButton3 = spaceAvailability3.locator('#spaceAvailabilityTimerControl');
            await expect(pauseButton1).toHaveAttribute('aria-pressed', 'false');
            await expect(pauseButton2).toHaveAttribute('aria-pressed', 'false');
            await expect(pauseButton3).toHaveAttribute('aria-pressed', 'false');

            await assertApiWasCalled(page);

            await pauseButton1.click();
            await expect(pauseButton1).toHaveAttribute('aria-pressed', 'true');
            await expect(pauseButton2).toHaveAttribute('aria-pressed', 'true');
            await expect(pauseButton3).toHaveAttribute('aria-pressed', 'true');

            await assertAccessibility(page, '.space-availability-wrapper');

            // assert API was not called
            await assertApiWasNotCalled(page);

            await pauseButton1.click();
            await expect(pauseButton1).toHaveAttribute('aria-pressed', 'false');
            await expect(pauseButton2).toHaveAttribute('aria-pressed', 'false');
            await expect(pauseButton3).toHaveAttribute('aria-pressed', 'false');

            // assert API was once again called
            await assertApiWasCalled(page);
        });
    });

    test.describe('single instances per page', () => {
        test.beforeEach(async ({ page, context }) => {
            await page.clock.install();
            await context.clearCookies();
            await context.addCookies([
                { name: 'UQ_PROACTIVE_CHAT', value: 'hidden', path: '/', domain: 'localhost:8080' },
            ]);

            await page.goto('http://localhost:8080/src/SpaceAvailability/example2.html');
        });

        test('should display single instances correctly at 1280px wide', async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            await expect(page.locator('space-availability')).toHaveCount(1);
            await assertAccessibility(page, '.space-availability-wrapper');

            const spaceAvailability = page.locator('space-availability[id="7665"]');
            await expect(spaceAvailability.locator('.space-availability__title')).toHaveText('Central');
            await expect(spaceAvailability.locator('.space-availability__subtitle')).toHaveText('770 seats');
            await expect(spaceAvailability.locator('.space-availability__chart_label')).toHaveText('71% of capacity');
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveClass(
                /space-availability__bar_yellow/,
            );
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveAttribute(
                'style',
                'width: 71%;',
            );
            await expect(spaceAvailability.locator('#spaceAvailabilityTimerControl')).toHaveAttribute(
                'aria-pressed',
                'false',
            );

            // assert API was called after standard interval
            await assertApiWasCalled(page);
        });

        test('should display single instances correctly at 320px wide', async ({ page }) => {
            await page.setViewportSize({ width: 320, height: 900 });
            await expect(page.locator('space-availability')).toHaveCount(1);
            await assertAccessibility(page, '.space-availability-wrapper');

            const spaceAvailability = page.locator('space-availability[id="7665"]');
            await expect(spaceAvailability.locator('.space-availability__title')).toHaveText('Central');
            await expect(spaceAvailability.locator('.space-availability__subtitle')).toHaveText('770 seats');
            await expect(spaceAvailability.locator('.space-availability__chart_label')).toHaveText('71% of capacity');
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveClass(
                /space-availability__bar_yellow/,
            );
            await expect(spaceAvailability.locator('.space-availability__chart_bar')).toHaveAttribute(
                'style',
                'width: 71%;',
            );
            await expect(spaceAvailability.locator('#spaceAvailabilityTimerControl')).toHaveAttribute(
                'aria-pressed',
                'false',
            );

            // assert API was called after standard interval
            await assertApiWasCalled(page);
        });

        test('should handle pause button being pressed', async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            await expect(page.locator('space-availability')).toHaveCount(1);

            const spaceAvailability = page.locator('space-availability[id="7665"]');

            // the accessibility pause button is hidden by default, so force the first
            // button to appear by removing the hidden class. This should allow us
            // to press the button without issue (note: force:true didnt work here)
            const spaceAvailabilityButtonWrapper = spaceAvailability.locator('.space-availability__timer_control');
            await spaceAvailabilityButtonWrapper.evaluate((el) => {
                el.classList.remove('visually-hidden');
            });

            const pauseButton = spaceAvailability.locator('#spaceAvailabilityTimerControl');
            await expect(pauseButton).toHaveAttribute('aria-pressed', 'false');

            await assertApiWasCalled(page);

            await pauseButton.click();
            await expect(pauseButton).toHaveAttribute('aria-pressed', 'true');

            await assertAccessibility(page, '.space-availability-wrapper');

            // assert API was not called
            await assertApiWasNotCalled(page);

            await pauseButton.click();
            await expect(pauseButton).toHaveAttribute('aria-pressed', 'false');

            // assert API was once again called
            await assertApiWasCalled(page);
        });
    });
});
