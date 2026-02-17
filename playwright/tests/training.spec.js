import { test, expect } from '@playwright/test';
import { assertAccessibility } from '../lib/axe';

const uqpurple = 'rgb(81, 36, 122)'; // #51247a

const EVENT_UQ_R_USERGROUP_UQRUG = (prefix) => `${prefix}-3455330`;
const EVENT_PREMIER_PRO_VIDEO_EDITING_BASICS = (prefix) => `${prefix}-3437655`;

test.describe('Training', () => {
    async function openTheByWeekDropdown(trainingFilter, page) {
        await expect(trainingFilter.getByTestId('training-filter-week-list')).toHaveClass(/hidden/);
        await expect(trainingFilter.getByTestId('training-filter-week-label')).toBeVisible();
        await expect(trainingFilter.getByTestId('training-filter-week-container')).toBeVisible();
        await trainingFilter.getByTestId('training-filter-week-container').focus();

        await page.keyboard.press('Enter');
        await expect(trainingFilter.getByTestId('training-filter-week-list')).not.toHaveClass(/hidden/);
        await expect
            .poll(async () => trainingFilter.getByTestId('training-filter-week-list').locator('button').count())
            .toBe(15);
    }

    async function openTheByCampusDropdownByKeyboard(trainingFilter, page) {
        await expect(trainingFilter.getByTestId('training-filter-campus-list')).not.toBeVisible();
        await expect(trainingFilter.getByTestId('training-filter-campus-list')).toHaveClass(/hidden/);

        await expect(trainingFilter.getByTestId('training-filter-campus-container')).toBeVisible();
        // an enter-key click on the campus parent opens the dropdown
        await trainingFilter.getByTestId('training-filter-campus-container').focus();
        await page.keyboard.press('Enter');

        await expect(trainingFilter.getByTestId('training-filter-campus-list')).not.toHaveClass(/hidden/);
        await expect
            .poll(async () => trainingFilter.getByTestId('training-filter-campus-list').locator('button').count())
            .toBe(3);
    }

    test.describe('Miscellaneous checks', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('http://localhost:8080/index-training.html');
        });
        test('Passes accessibility', async ({ page }) => {
            const trainingElement = page.locator('library-training[hide-filter]');

            await expect(trainingElement.getByTestId('training-event-detail-toggle-3428487')).toBeVisible();

            await assertAccessibility(page, 'library-training', {
                // because we have more than one library-training instance on this test page,
                // it is complaining about uniquesness - multiple instances would never happen in actual use
                disabledRules: ['landmark-unique'],
            });
        });

        test('hides filter and category title on attributes set', async ({ page }) => {
            const trainingElement = page.getByTestId('hide-filter-test').locator('library-training[hide-filter]');
            await expect(trainingElement.locator('training-filter')).not.toBeVisible();

            await expect(trainingElement.locator('training-list')).toBeVisible();
            const trainingList = trainingElement.locator('training-list');

            await expect(trainingList.getByTestId('category-top-0').locator('h3')).toHaveClass(/visually-hidden/);
        });
    });

    test.describe('List component', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('http://localhost:8080/index-training.html');
        });
        test('toggles full list of rows on button click', async ({ page }) => {
            await page.goto('http://localhost:8080/index-training.html');
            await page.setViewportSize({ width: 1280, height: 900 });
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');

            await expect(trainingElement.locator('training-list')).toBeVisible();
            const trainingList = trainingElement.locator('training-list');

            // first 5 are visible
            await expect(trainingList.getByTestId('training-event-detail-toggle-3428487')).toBeVisible(); // Python with Spyder: Introduction to Data Science
            await expect(
                trainingList.getByTestId(EVENT_PREMIER_PRO_VIDEO_EDITING_BASICS('training-event-detail-toggle')),
            ).toBeVisible();
            await expect(
                trainingList.getByTestId(EVENT_UQ_R_USERGROUP_UQRUG('training-event-detail-toggle')),
            ).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437656')).toBeVisible(); // 'NVivo: Next Steps');
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437658')).toBeVisible(); // 'Introduction to Adobe Illustrator');
            // 6th onward hidden
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437657')).not.toBeVisible(); // Introduction to the Unix Shell
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437659')).not.toBeVisible(); // Excel: processing data

            // click the Show more to expand the displayed events
            await expect(trainingList.getByTestId('training-events-toggle-full-list').first()).toBeVisible();
            await expect(trainingList.getByTestId('training-events-toggle-full-list').first()).toHaveText('Show more');
            await trainingList.getByTestId('training-events-toggle-full-list').first().click();

            // many, many now visible
            await expect(trainingList.getByTestId('training-event-detail-toggle-3428487')).toBeVisible(); // Python with Spyder: Introduction to Data Science
            await expect(
                trainingList.getByTestId(EVENT_PREMIER_PRO_VIDEO_EDITING_BASICS('training-event-detail-toggle')),
            ).toBeVisible();
            await expect(
                trainingList.getByTestId(EVENT_UQ_R_USERGROUP_UQRUG('training-event-detail-toggle')),
            ).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437656')).toBeVisible(); // 'NVivo: Next Steps');
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437658')).toBeVisible(); // 'Introduction to Adobe Illustrator');
            // 6th onward now visible
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437657')).toBeVisible(); // Introduction to the Unix Shell
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437659')).toBeVisible(); // Excel: processing data

            // click the Show more to collapse the displayed events
            await expect(trainingList.getByTestId('training-events-toggle-full-list').first()).toBeVisible();
            await expect(trainingList.getByTestId('training-events-toggle-full-list').first()).toHaveText('Show less');
            await trainingList.getByTestId('training-events-toggle-full-list').first().click();

            // only 5 now visible
            await expect(trainingList.getByTestId('training-event-detail-toggle-3428487')).toBeVisible(); // Python with Spyder: Introduction to Data Science
            await expect(
                trainingList.getByTestId(EVENT_PREMIER_PRO_VIDEO_EDITING_BASICS('training-event-detail-toggle')),
            ).toBeVisible();
            await expect(
                trainingList.getByTestId(EVENT_UQ_R_USERGROUP_UQRUG('training-event-detail-toggle')),
            ).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437656')).toBeVisible(); // 'NVivo: Next Steps');
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437658')).toBeVisible(); // 'Introduction to Adobe Illustrator');
            // 6th onward now hidden
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437657')).not.toBeVisible(); // Introduction to the Unix Shell
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437659')).not.toBeVisible(); // Excel: processing data
        });

        test('shows a multi day event', async ({ page }) => {
            await page.goto('http://localhost:8080/index.html');

            await expect(page.locator('library-training')).toBeVisible();
            const trainingElement = page.locator('library-training');
            await expect(trainingElement.locator('training-list')).toBeVisible();

            const trainingList = trainingElement.locator('training-list');
            await expect(trainingList.getByTestId('event-dateRange-3462236')).toBeVisible();

            await trainingList.locator('[data-testid="event-dateRange-3462236"]').scrollIntoViewIfNeeded();

            const trainingToggle = trainingList.getByTestId('training-event-detail-toggle-3462236');
            await expect(trainingToggle.getByTestId('event-dateRange-3462236')).toBeVisible();
            await expect(trainingToggle.getByTestId('event-dateRange-3462236')).toContainText('Jun 1');
            await expect(trainingToggle.getByTestId('event-dateRange-3462236')).toContainText('Jun 3');
        });

        test("online events don't reveal the url", async ({ page }) => {
            await page.goto('http://localhost:8080/index.html');

            await expect(page.locator('library-training')).toBeVisible();
            const trainingElement = page.locator('library-training');
            await expect(trainingElement.locator('training-list')).toBeVisible();

            const trainingList = trainingElement.locator('training-list');
            await expect(trainingList.getByTestId(EVENT_UQ_R_USERGROUP_UQRUG('event-venue'))).toBeVisible();
            await expect(trainingList.getByTestId(EVENT_UQ_R_USERGROUP_UQRUG('event-venue'))).toContainText(
                'Online, Zoom',
            );
        });
    });

    test.describe('Details component', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('http://localhost:8080/index-training.html');
            await page.waitForLoadState('networkidle');
        });
        test('loads basic training details', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');

            await expect(trainingElement.locator('training-list')).toBeVisible();
            const trainingList = trainingElement.locator('training-list');

            await expect(trainingList.getByTestId('training-event-detail-toggle-3428487')).toBeVisible();
            await trainingList.getByTestId('training-event-detail-toggle-3428487').click();
            await expect(trainingList.getByTestId('training-event-detail-3428487')).toBeVisible();

            const trainingDetail = trainingList.getByTestId('training-event-detail-3428487');
            await expect(trainingDetail.getByTestId('training-details-location-details')).toBeVisible();
            await expect(trainingDetail.getByTestId('training-details-location-details')).toHaveText('Online, Zoom');
        });

        test('the places remaining text is always correct', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingComponent = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingComponent.locator('training-list')).toBeVisible();

            const trainingList = trainingComponent.locator('training-list');
            await trainingList.getByTestId(EVENT_UQ_R_USERGROUP_UQRUG('training-event-detail-toggle')).click(); // open detail item
            await expect(trainingList.getByTestId(EVENT_UQ_R_USERGROUP_UQRUG('training-event-detail'))).toBeVisible();
            const trainingDetailElement1 = trainingList.getByTestId(
                EVENT_UQ_R_USERGROUP_UQRUG('training-event-detail-content'),
            );
            await expect(trainingDetailElement1.locator('#bookingText')).toHaveText('Booking is not required');
            await trainingList.getByTestId(EVENT_UQ_R_USERGROUP_UQRUG('training-event-detail-toggle')).click(); // close detail item

            await trainingList
                .getByTestId(EVENT_PREMIER_PRO_VIDEO_EDITING_BASICS('training-event-detail-toggle'))
                .click(); // open detail item
            await expect(
                trainingList.getByTestId(EVENT_PREMIER_PRO_VIDEO_EDITING_BASICS('training-event-detail')),
            ).toBeVisible();
            const trainingDetailElement2 = trainingList.getByTestId(
                EVENT_PREMIER_PRO_VIDEO_EDITING_BASICS('training-event-detail-content'),
            );
            await expect(trainingDetailElement2.locator('#bookingText')).toHaveText(
                'Class is full. Register for waitlist',
            );
            await trainingList
                .getByTestId(EVENT_PREMIER_PRO_VIDEO_EDITING_BASICS('training-event-detail-toggle'))
                .click(); // close detail item

            await trainingList.getByTestId('training-event-detail-toggle-3428487').click(); // open detail item
            await expect(trainingList.getByTestId('training-event-detail-3428487')).toBeVisible();
            const trainingDetailElement3 = trainingList.getByTestId('training-event-detail-content-3428487');
            await expect(trainingDetailElement3.locator('#bookingText')).toHaveText('Places still available');
        });

        test('has correct details for em user with st lucia training and non-booking course', async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            await expect(
                page.locator('training-detail[data-testid="training-event-detail-content-2824657"]'),
            ).toBeVisible();
            const trainingElement = page.locator(
                'training-detail[data-testid="training-event-detail-content-2824657"]',
            );
            await expect(
                trainingElement.getByText(/At the end of this session, class participants will be able to/).first(),
            ).toBeVisible();
            await expect(trainingElement.getByText(/Tuesday 24 November 2020/).first()).toBeVisible();
            await expect(trainingElement.getByText(/10am/).first()).toBeVisible();
            await expect(trainingElement.getByText(/11\.30am/).first()).toBeVisible();
            await expect(trainingElement.getByText(/St Lucia, Duhig Tower \(2\), 02-D501/).first()).toBeVisible();
            await expect(trainingElement.getByTestId('training-details-location-details').locator('a')).toHaveAttribute(
                'href',
                'https://maps.uq.edu.au/?zoom=19&campusId=406&lat=-27.4966319&lng=153.0144148&zLevel=1',
            );
            await expect(trainingElement.getByText(/Booking is not required/).first()).toBeVisible();
        });

        test('has correct details for uq user with toowoomba training and bookable course can visit studenthub', async ({
            page,
            context,
        }) => {
            await context.route('https://studenthub.uq.edu.au/**', async (route) => {
                await route.fulfill({
                    body: `studenthub loaded`,
                });
            });

            await expect(
                page.locator(
                    'div[data-testid="detail-unit-test"] training-detail[data-testid="training-event-detail-content-3455330"]',
                ),
            ).toBeVisible();
            const trainingElement = page.locator(
                'div[data-testid="detail-unit-test"] training-detail[data-testid="training-event-detail-content-3455330"]',
            );

            await expect(trainingElement.getByText(/Toowoomba Rural Clinic/).first()).toBeVisible();
            await expect(trainingElement.getByTestId('training-details-location-details').locator('a')).toHaveAttribute(
                'href',
                'https://www.google.com/maps/search/?api=1&query=Toowoomba%20Rural%20Clinical%20School%2C%20152%20West%20Street%2C%20South%20Toowoomba%20QLD%2C%20Australia',
            );
            await expect(trainingElement.getByText(/Places still available/).first()).toBeVisible();

            await expect(trainingElement.getByTestId('training-details-book-training-button')).toBeVisible();
            const bookTrainingButton = trainingElement.getByTestId('training-details-book-training-button');
            const pagePromise = context.waitForEvent('page');
            await bookTrainingButton.click();

            const newPage = await pagePromise;
            await newPage.waitForLoadState('networkidle');
            const bodyText = await newPage.locator('body').textContent();
            expect(bodyText).toContain('studenthub loaded');
        });

        test('has correct details for logged out user with unidentifiable location and full course', async ({
            page,
            context,
        }) => {
            await context.route('https://studenthub.uq.edu.au/**', async (route) => {
                await route.fulfill({
                    body: `studenthub loaded`,
                });
            });

            await expect(
                page.locator('training-detail[data-testid="training-event-detail-content-3455331"]'),
            ).toBeVisible();
            const trainingElement = page.locator(
                'training-detail[data-testid="training-event-detail-content-3455331"]',
            );

            await expect(
                trainingElement.getByTestId('training-details-location-details').filter({ hasText: 'Townsville' }),
            ).toBeVisible();
            await expect(
                trainingElement.getByTestId('training-details-location-details').locator('a'),
            ).not.toBeVisible();
            await expect(
                trainingElement
                    .getByTestId('training-details-booking-text')
                    .filter({ hasText: 'Class is full. Register for waitlist' }),
            ).toBeVisible();
            await expect(trainingElement.getByTestId('training-details-book-training-button')).toBeVisible();
            const pagePromise = context.waitForEvent('page');
            await trainingElement.getByTestId('training-details-book-training-button').click();

            const newPage = await pagePromise;
            await newPage.waitForLoadState('networkidle');
            const bodyText = await newPage.locator('body').textContent();
            expect(bodyText).toContain('studenthub loaded');
        });
        test('shows a multi day event', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-list')).toBeVisible();
            const trainingListElement = trainingElement.locator('training-list');

            await trainingListElement.getByTestId('training-event-detail-toggle-3462236').click();
            await expect(trainingListElement.getByTestId('training-event-detail-content-3462236')).toBeVisible();
            await trainingListElement.getByTestId('training-event-detail-content-3462236').scrollIntoViewIfNeeded();
            const trainingDetail = trainingListElement.getByTestId('training-event-detail-content-3462236');
            await expect(trainingDetail.getByText(/Online, Zoom/).first()).toBeVisible();
            await expect(trainingDetail.getByTestId('training-details-full-date')).toBeVisible();
            await expect(trainingDetail.getByTestId('training-details-full-date')).toBeVisible();
            await expect(trainingDetail.getByText(/Tuesday 1 June 2021 - Thursday 3 June 2021/).first()).toBeVisible();
            await expect(trainingDetail.getByTestId('training-details-start-time')).toBeVisible();
            await expect(trainingDetail.getByTestId('training-details-start-time')).toBeVisible();
            await expect(trainingDetail.getByText(/10am/).first()).toBeVisible();
            await expect(trainingDetail.getByTestId('training-details-end-time')).toBeVisible();
            await expect(trainingDetail.getByTestId('training-details-end-time')).toBeVisible();
            await expect(trainingDetail.getByText(/4pm/).first()).toBeVisible();
        });

        test("online events don't reveal the url", async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-list')).toBeVisible();

            const trainingList = trainingElement.locator('training-list');
            await trainingList.getByTestId(EVENT_UQ_R_USERGROUP_UQRUG('training-event-detail-toggle')).click(); // open detail item
            await expect(trainingList.getByTestId(EVENT_UQ_R_USERGROUP_UQRUG('training-event-detail'))).toBeVisible();

            await trainingList
                .getByTestId(EVENT_UQ_R_USERGROUP_UQRUG('training-event-detail'))
                .getByTestId('training-details-location-details')
                .scrollIntoViewIfNeeded();
            await expect(
                trainingList
                    .getByTestId(EVENT_UQ_R_USERGROUP_UQRUG('training-event-detail'))
                    .getByTestId('training-details-location-details'),
            ).toBeVisible();
            await expect(
                trainingList
                    .getByTestId(EVENT_UQ_R_USERGROUP_UQRUG('training-event-detail'))
                    .getByTestId('training-details-location-details'),
            ).toContainText('Online, Zoom');
        });

        test('offline events show a map link', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-list')).toBeVisible();

            const trainingList = trainingElement.locator('training-list');
            await trainingList
                .getByTestId(EVENT_PREMIER_PRO_VIDEO_EDITING_BASICS('training-event-detail-toggle'))
                .click(); // open detail item
            await expect(
                trainingList.getByTestId(EVENT_PREMIER_PRO_VIDEO_EDITING_BASICS('training-event-detail')),
            ).toBeVisible();

            await trainingList
                .getByTestId(EVENT_PREMIER_PRO_VIDEO_EDITING_BASICS('training-event-detail'))
                .getByTestId('training-details-location-details')
                .scrollIntoViewIfNeeded();
            await expect(
                trainingList
                    .getByTestId(EVENT_PREMIER_PRO_VIDEO_EDITING_BASICS('training-event-detail'))
                    .getByTestId('training-details-location-details'),
            ).toBeVisible();
            await expect(
                trainingList
                    .getByTestId(EVENT_PREMIER_PRO_VIDEO_EDITING_BASICS('training-event-detail'))
                    .getByTestId('training-details-location-details')
                    .locator('a'),
            ).toContainText('St Lucia, Duhig Tower (2), 02-D501');
        });

        test('Correct error shows when an empty result is return by Training api', async ({ page }) => {
            await page.goto('http://localhost:8080/index-training.html?user=emptyUser');
            await page.setViewportSize({ width: 1280, height: 900 });
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();

            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.filter({ hasText: 'No classes scheduled; check back soon.' })).toBeVisible();
        });

        test('Correct error shows when Training api doesnt load', async ({ page }) => {
            await page.goto('http://localhost:8080/index-training.html?user=errorUser');
            await page.setViewportSize({ width: 1280, height: 900 });
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(
                trainingElement.filter({
                    hasText: 'Something went wrong. Please refresh the page to see upcoming courses.',
                }),
            ).toBeVisible();
        });
    });

    test.describe('Training filters', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('http://localhost:8080/index-training.html');
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('Training filter is accessible', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();

            const trainingFilterElement = page.locator('training-filter[id="unwrappedFilter"]');
            await expect(trainingFilterElement.filter({ hasText: 'Filter events' })).toBeVisible();
            await expect(trainingFilterElement.filter({ hasText: 'By keyword' })).toBeVisible();
            await expect(trainingFilterElement.filter({ hasText: 'By campus' })).toBeVisible();
            await expect(trainingFilterElement.filter({ hasText: 'By week' })).toBeVisible();

            await page.waitForTimeout(1000);
            await assertAccessibility(page, 'training-filter[id="unwrappedFilter"]');
        });
        test('user can select a chip and it will filter correctly, simple example', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-list')).toBeVisible();
            const trainingListElement = trainingElement.locator('training-list');
            const trainingFilterElement = trainingElement.locator('training-filter');

            await expect(trainingListElement.locator('h4').first()).toContainText(
                'Python with Spyder: Introduction to Data Science',
            );

            // this test is dependent on the chips currently in the system
            await trainingFilterElement.getByText(/Excel/).first().click();

            await expect(trainingListElement.locator('h4').first()).toContainText('Excel: processing data');
        });
        test('user can select a chip and it will filter correctly, example with space to remove', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-list')).toBeVisible();
            const trainingListElement = trainingElement.locator('training-list');
            const trainingFilterElement = trainingElement.locator('training-filter');

            // currently the first child is a Python event
            await expect(
                trainingListElement.getByTestId('training-event-category-0').locator('h4').first(),
            ).toContainText('Python with Spyder: Introduction to Data Science');

            // this test is dependent on the chips currently in the system
            await trainingFilterElement
                .getByTestId('training-filter-popular-events-creating-a-structured-thesis')
                .click();

            // after choosing a chip, the first event has changed
            await expect(
                trainingListElement.getByTestId('training-event-category-0').locator('h4').first(),
            ).toContainText('Word: Creating a Structured Thesis (CaST)');
        });
        test('user can enter a keyword', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();

            const trainingFilter = trainingElement.locator('training-filter');
            await trainingFilter.getByTestId('training-filter-keyword-entry').pressSequentially('excel');
            await expect(trainingFilter.getByTestId('training-filter-keyword-entry')).toHaveValue('excel');
            // the placeholder has moved up, proxied by "color has changed"
            await expect(trainingFilter.getByTestId('training-filter-keyword-label')).toHaveCSS('color', uqpurple);
            await expect(page.url()).toEqual(
                'http://localhost:8080/index-training.html#keyword=excel;campus=;weekstart=',
            );

            // the user can use the escape key to clear the input field
            await page.keyboard.press('Escape');
            await expect(trainingElement.getByTestId('training-filter-keyword-entry')).toHaveValue('');
            await expect(page.url()).toEqual('http://localhost:8080/index-training.html#keyword=;campus=;weekstart=');
        });
        test('user can search for a term that is only in the summary', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();

            const trainingFilter = trainingElement.locator('training-filter');
            await trainingFilter.getByTestId('training-filter-keyword-entry').pressSequentially('introductory');
            await expect(trainingFilter.getByTestId('training-filter-keyword-entry')).toHaveValue('introductory');
            const trainingList = trainingElement.locator('training-list');
            // this event would not be visible if it weren't checking the summary - the keyword is only in the summary
            await expect(trainingList.getByTestId('training-event-detail-toggle-3428487')).toBeVisible(); // Python with Spyder: Introduction to Data Science has 'introductory'
            // sanity check:
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437655')).not.toBeVisible(); // Premiere Pro: Video Editing Basics doesn't have 'introductory' anywhere
        });
        test('user can search for a term that is only in the details', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();

            const trainingFilter = trainingElement.locator('training-filter');
            await trainingFilter.getByTestId('training-filter-keyword-entry').pressSequentially('workspace');
            await expect(trainingFilter.getByTestId('training-filter-keyword-entry')).toHaveValue('workspace');
            const trainingList = trainingElement.locator('training-list');
            // this event would not be visible if it weren't checking the details - the keyword is only in the details
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437655')).toBeVisible(); // Premiere Pro: Video Editing Basics has 'workspace'
            // sanity check:
            await expect(trainingList.getByTestId('training-event-detail-toggle-3428487')).not.toBeVisible(); // Python with Spyder: Introduction to Data Science doesn't have 'workspace' anywhere
        });
        test('user can search for a term that is only in the name', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();

            const trainingFilter = trainingElement.locator('training-filter');
            await trainingFilter.getByTestId('training-filter-keyword-entry').pressSequentially('extraword');
            await expect(trainingFilter.getByTestId('training-filter-keyword-entry')).toHaveValue('extraword');
            const trainingList = trainingElement.locator('training-list');
            // this event would not be visible if it weren't checking the name - the keyword is only in the name
            await expect(trainingList.getByTestId('training-event-detail-toggle-3428493')).toBeVisible(); // Python data transformation and visualisation with pandas extraword has 'extraword'
            // sanity check:
            await expect(trainingList.getByTestId('training-event-detail-toggle-3428487')).not.toBeVisible(); // Python with Spyder: Introduction to Data Science doesn't have 'extraword' anywhere
        });
        test('user can select a campus', async ({ page }) => {
            const trainingElement = page.locator('library-training[id="test-with-filter"]');

            await expect(trainingElement.locator('training-filter')).toBeVisible();
            await trainingElement.getByTestId('training-filter-campus-label').click();
            await trainingElement.getByTestId('training-filter-campus-select-2').click();
            await expect(trainingElement.getByText(/St Lucia/).first()).toBeVisible();

            // the placeholder has moved up, proxied by "color has changed"
            await expect(trainingElement.getByTestId('training-filter-campus-label')).toHaveCSS('color', uqpurple);
            await expect(page.url()).toEqual(
                'http://localhost:8080/index-training.html#keyword=;campus=St%2520Lucia;weekstart=',
            );

            await trainingElement.getByTestId('training-filter-campus-label').click();
            await trainingElement.getByTestId('training-filter-campus-select-0').click();
            await expect(trainingElement.getByText(/All locations/).first()).toBeVisible();

            // the placeholder has moved up, proxied by "color has changed"
            await expect(trainingElement.getByTestId('training-filter-campus-label')).toHaveCSS('color', uqpurple);
            await expect(page.url()).toEqual(
                'http://localhost:8080/index-training.html#keyword=;campus=all;weekstart=',
            );
        });
        test('Online events show when Online campus filter is selected', async ({ page }) => {
            await page.goto('http://localhost:8080/index-training.html#keyword=;campus=;weekstart=');

            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.getByTestId('event-venue-3455330').getByText(/Online, Zoom/)).toBeVisible();

            await page.locator('#test-with-filter').getByTestId('training-filter-campus-label').click();
            await page.getByTestId('training-filter-campus-select-1').click();

            // this element shows after filter selector because we changed its campus to "Online":
            await expect(trainingElement.getByTestId('event-venue-3455330').getByText(/Online, Zoom/)).toBeVisible();
        });
        test('user can clear campus selector field', async ({ page }) => {
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();

            const trainingFilterElement = trainingElement.locator('training-filter');

            await trainingFilterElement.getByTestId('training-filter-campus-label').click();
            await expect(
                trainingFilterElement.getByTestId('training-filter-campus-list').locator('button'),
            ).toHaveCount(3);

            // a click elsewhere closes the dropdown
            await page.getByTestId('random-page-element').click();
            await expect(trainingFilterElement.getByTestId('training-filter-campus-list')).toHaveClass(/hidden/);
            await expect(trainingFilterElement.getByTestId('training-filter-campus-list')).not.toBeVisible();
        });

        test('user can select a week', async ({ page }) => {
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();
            const trainingFilter = trainingElement.locator('training-filter');
            await trainingFilter.getByTestId('training-filter-week-label').click();
            await trainingFilter.getByTestId('training-filter-select-week-0').click();
            await expect(trainingFilter.getByTestId('training-filter-week-container')).toHaveText(/All available/);
            // the placeholder has moved up, proxied by "color has changed"
            await expect(trainingFilter.getByTestId('training-filter-week-label')).toHaveCSS('color', uqpurple);
            await expect(page.url()).toEqual(
                'http://localhost:8080/index-training.html#keyword=;campus=;weekstart=all',
            );

            const trainingList = trainingElement.locator('training-list');
            await expect(trainingList).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-3428487')).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-3428487')).toBeVisible();
            await expect(
                trainingList.getByText(/Python with Spyder: Introduction to Data Science/).first(),
            ).toBeVisible();
            await expect(
                trainingList.getByTestId(EVENT_PREMIER_PRO_VIDEO_EDITING_BASICS('training-event-detail-toggle')),
            ).toBeVisible();
            await expect(
                trainingList.getByTestId(EVENT_PREMIER_PRO_VIDEO_EDITING_BASICS('training-event-detail-toggle')),
            ).toBeVisible();
            await expect(trainingList.getByText(/Premiere Pro: Video Editing Basics/).first()).toBeVisible();
            await expect(
                trainingList.getByTestId(EVENT_UQ_R_USERGROUP_UQRUG('training-event-detail-toggle')),
            ).toBeVisible();
            await expect(
                trainingList.getByTestId(EVENT_UQ_R_USERGROUP_UQRUG('training-event-detail-toggle')),
            ).toBeVisible();
            await expect(trainingList.getByText(/UQ R User Group \(UQRUG\)/).first()).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437656')).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437656')).toBeVisible();
            await expect(trainingList.getByText(/NVivo: Next Steps/).first()).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437658')).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-3437658')).toBeVisible();
            await expect(trainingList.getByText(/Introduction to Adobe Illustrator/).first()).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-3462236')).toBeVisible();
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3462236')).toBeVisible();
            await expect(
                trainingList.getByText(/Preparing to use an online invigilated\/supervised examination/).first(),
            ).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-3411674')).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-3411674')).toBeVisible();
            await expect(trainingList.getByText(/Managing sensitive data/).first()).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-3450085')).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-3450085')).toBeVisible();
            await expect(trainingList.getByText(/Publishing your datasets with UQRDM/).first()).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-2891495')).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-2891495')).toBeVisible();
            await expect(
                trainingList.getByText(/Introduction to Digital Research Notebook \(LabArchives\)/).first(),
            ).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-2890738')).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-2890738')).toBeVisible();
            await expect(
                trainingList
                    .getByText(/UQRDM for research students - how to use it to help with managing research data/)
                    .first(),
            ).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-3415855')).toBeVisible();
            await expect(trainingList.getByTestId('training-event-detail-toggle-3415855')).toBeVisible();
            await expect(trainingList.getByText(/UQRDM Q&A session/).first()).toBeVisible();

            await expect(trainingElement.locator('training-filter')).toBeVisible();

            await trainingFilter.getByTestId('training-filter-week-label').click();
            await trainingFilter.locator('[data-testid="training-filter-select-week-10"]').click();
            await expect(trainingFilter.getByTestId('training-filter-week-container')).toHaveText(/2 Aug - 8 Aug /);

            // the placeholder has moved up, proxied by "color has changed"
            await expect(trainingFilter.getByTestId('training-filter-week-label')).toHaveCSS('color', uqpurple);

            await expect(trainingList).toBeVisible();

            // no events show for this date
            await expect(trainingElement.getByTestId('training-list')).toBeVisible();
            await expect(trainingElement.getByTestId('training-list')).toBeEmpty();

            // show that changing dates shows the right items
            await expect(trainingElement.locator('training-filter')).toBeVisible();

            await expect(page.url()).toEqual(
                'http://localhost:8080/index-training.html#keyword=;campus=;weekstart=2021-08-02',
            );

            await expect(trainingElement.locator('training-filter')).toBeVisible();

            await trainingFilter.getByTestId('training-filter-week-label').click();
            await trainingFilter.getByTestId('training-filter-select-week-4').click();
            await expect(trainingFilter.getByTestId('training-filter-week-container')).toHaveText(/21 June - 27 June/);

            await expect(trainingList).toBeVisible();

            // many hidden
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3428487')).not.toBeVisible(); // Python with Spyder: Introduction to Data Science
            await expect(
                trainingElement.getByTestId(EVENT_PREMIER_PRO_VIDEO_EDITING_BASICS('training-event-detail-toggle')),
            ).not.toBeVisible(); // 'Premiere Pro: Video Editing Basics');
            await expect(
                trainingElement.getByTestId(EVENT_UQ_R_USERGROUP_UQRUG('training-event-detail-toggle')),
            ).not.toBeVisible(); // 'UQ R User Group (UQRUG)');
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3437656')).not.toBeVisible(); // 'NVivo: Next Steps');
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3437658')).not.toBeVisible(); // 'Introduction to Adobe Illustrator');
            // others appear
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3450064')).toBeVisible();
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3450064')).toBeVisible();
            await expect(
                trainingElement.getByText(/Kaltura Capture: Desktop Recording software/).first(),
            ).toBeVisible();
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3450065')).toBeVisible();
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3450065')).toBeVisible();
            await expect(
                trainingElement.getByText(/R data manipulation with RStudio and dplyr: introduction/).first(),
            ).toBeVisible();
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3450066')).toBeVisible();
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3450066')).toBeVisible();
            await expect(
                trainingElement.getByText(/Word: Creating a Structured Thesis \(CaST\)/).first(),
            ).toBeVisible();
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3450067')).toBeVisible();
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3450067')).toBeVisible();
            await expect(
                trainingElement.getByText(/Python with Spyder: Introduction to Data Science/).first(),
            ).toBeVisible();
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3430859')).toBeVisible();
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3430859')).toBeVisible();
            await expect(trainingElement.getByText(/EndNote 20: getting started/).first()).toBeVisible();
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3462236')).not.toBeVisible(); // 'Preparing to use an online invigilated/supervised examination');
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3411674')).not.toBeVisible(); // 'Managing sensitive data');
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3450085')).not.toBeVisible(); // 'Publishing your datasets with UQRDM');
            await expect(trainingElement.getByTestId('training-event-detail-toggle-2891495')).not.toBeVisible(); // 'Introduction to Digital Research Notebook (LabArchives)');
            await expect(trainingElement.getByTestId('training-event-detail-toggle-2890738')).toBeVisible();
            await expect(trainingElement.getByTestId('training-event-detail-toggle-2890738')).toBeVisible();
            await expect(
                trainingElement
                    .getByText(/UQRDM for research students - how to use it to help with managing research data/)
                    .first(),
            ).toBeVisible();
            await expect(trainingElement.getByTestId('training-event-detail-toggle-3415855')).not.toBeVisible(); // 'UQRDM Q&A session');
        });
        test('user can clear week selector field', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();

            const trainingFilter = trainingElement.locator('training-filter');
            await trainingFilter.getByTestId('training-filter-week-label').click();
            await expect(trainingFilter.getByTestId('training-filter-week-list')).not.toHaveClass(/hidden/);
            await expect
                .poll(async () => trainingFilter.getByTestId('training-filter-week-list').locator('button').count())
                .toBe(15);

            // click somewhere on the page outside the week type dropdown
            await page.getByTestId('random-page-element').click();
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            await expect(trainingFilter.getByTestId('training-filter-week-list')).toHaveClass(/hidden/);
        });
        test('user can select multiple elements', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();
            const trainingFilterElement = trainingElement.locator('training-filter');

            // the two dropdowns don't stay open at the same time
            await expect(trainingFilterElement.getByTestId('training-filter-week-label')).toBeVisible();
            await trainingFilterElement.getByTestId('training-filter-week-label').click(); // open the week list
            await expect(trainingFilterElement.getByTestId('training-filter-select-week-0')).toBeVisible(); // week list shows
            await expect(trainingFilterElement.getByTestId('training-filter-campus-select-0')).not.toBeVisible(); // campus list is closed
            await trainingFilterElement.getByTestId('training-filter-campus-label').click(); // open the campus list
            await expect(trainingFilterElement.getByTestId('training-filter-campus-select-0')).toBeVisible(); // campus list is open
            await expect(trainingFilterElement.getByTestId('training-filter-select-week-0')).not.toBeVisible(); // week list has closed
            await trainingFilterElement.getByTestId('training-filter-week-label').click(); // reopen the week list
            await expect(trainingFilterElement.getByTestId('training-filter-select-week-0')).toBeVisible(); // campus list has closed
            await expect(trainingFilterElement.getByTestId('training-filter-campus-select-0')).not.toBeVisible(); // week list is open

            await trainingFilterElement.getByTestId('training-filter-select-week-0').click(); // select a week for the next step of the test
            await trainingFilterElement.getByTestId('training-filter-campus-label').click();
            await trainingFilterElement.getByTestId('training-filter-campus-select-0').click();
            await trainingFilterElement.getByTestId('training-filter-popular-events-excel').click();
            await expect(page.url()).toEqual(
                'http://localhost:8080/index-training.html#keyword=Excel;campus=all;weekstart=all',
            );
        });
        test('user can clear other fields', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();

            const trainingFilter = trainingElement.locator('training-filter');
            await trainingFilter.getByTestId('training-filter-popular-events-excel').click();
            await expect(page.url()).toEqual(
                'http://localhost:8080/index-training.html#keyword=Excel;campus=;weekstart=',
            );
            await trainingFilter.locator('[data-testid="training-filter-clear-keyword"]').click();
            await expect(page.url()).toEqual('http://localhost:8080/index-training.html#keyword=;campus=;weekstart=');
        });
        test('uses url parameters', async ({ page }) => {
            // what we get with nothing in the url
            await page.goto('http://localhost:8080/index-training.html#keyword=;campus=;weekstart=');
            const trainingList = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingList.getByTestId('training-event-detail-toggle-3428487')).toBeVisible(); // Python with Spyder: Introduction to Data Science

            // what we get when the url restricts campus

            await page.goto('http://localhost:8080/index-training.html#keyword=;campus=St%2520Lucia;weekstart=');
            const trainingList2 = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingList2.getByTestId('training-event-detail-toggle-3428487')).not.toBeVisible(); // Python with Spyder: Introduction to Data Science}
        });
        test('sends to GTM', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();

            const trainingFilter = trainingElement.locator('training-filter');
            await expect(trainingFilter.getByTestId('training-filter-keyword-entry')).toBeVisible();

            const dataFromDataLayer = await page.evaluate(() => {
                return window.dataLayer;
            });
            await expect(dataFromDataLayer).toEqual(undefined);

            await trainingFilter.getByTestId('training-filter-keyword-entry').pressSequentially('excel');
            await expect(page.url()).toEqual(
                'http://localhost:8080/index-training.html#keyword=excel;campus=;weekstart=',
            );

            // click away from the keyword input field, as that is when we send the keyword
            await page.getByTestId('random-page-element').click();

            const dataFromDataLayer1 = await page.evaluate(() => {
                return window.dataLayer;
            });
            await expect(dataFromDataLayer1?.length).toEqual(1);
        });
    });

    test.describe('Filter component keyboard navigation', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('http://localhost:8080/index-training.html');
        });
        test('the user can use the keyboard to navigate the keyword field', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();
            {
                const trainingFilter = trainingElement.locator('training-filter');

                // can clear text with the escape key
                await expect(trainingFilter.getByTestId('training-filter-keyword-entry')).toBeVisible();

                let keyword = 'e';
                await trainingFilter.getByTestId('training-filter-keyword-entry').pressSequentially(keyword);
                await expect(page.url()).toEqual(
                    `http://localhost:8080/index-training.html#keyword=${keyword};campus=;weekstart=`,
                );

                await page.keyboard.press('Escape');
                await expect(page.url()).toEqual(
                    'http://localhost:8080/index-training.html#keyword=;campus=;weekstart=',
                );
            }
        });
        test('the user can tab from the keyword entry field to the keyword clear button', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();
            {
                const trainingFilter = trainingElement.locator('training-filter');

                // can clear text with 'enter' click on the clear button
                await expect(trainingFilter.getByTestId('training-filter-keyword-entry')).toBeVisible();
                await trainingFilter.getByTestId('training-filter-keyword-entry').focus();

                await page.keyboard.press('Tab');
                await expect(trainingFilter.getByTestId('training-filter-clear-keyword')).toBeFocused();
            }
        });
        test('the user can use the keyboard for the keyword clear button', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();
            const trainingFilter = trainingElement.locator('training-filter');
            await expect(page.url()).toEqual('http://localhost:8080/index-training.html#keyword=;campus=;weekstart=');

            await trainingFilter.getByTestId('training-filter-keyword-entry').pressSequentially('e');
            await expect(page.url()).toEqual('http://localhost:8080/index-training.html#keyword=e;campus=;weekstart=');

            // can clear text with 'enter' click on the clear button
            await trainingFilter.getByTestId('training-filter-clear-keyword').focus();
            await page.keyboard.press('Enter');
            await expect(page.url()).toEqual('http://localhost:8080/index-training.html#keyword=;campus=;weekstart=');
        });
        test('the user can tab from the keyword to the campus dropdown', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();
            const trainingFilter = trainingElement.locator('training-filter');
            await trainingFilter.getByTestId('training-filter-clear-keyword').focus();

            // tabs to next field
            await page.keyboard.press('Tab');
            await expect(trainingFilter.getByTestId('training-filter-campus-container').first()).toBeFocused();
        });
        test('the user can use the keyboard to open and close the campus dropdown ', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();

            const trainingFilter = trainingElement.locator('training-filter');

            await openTheByCampusDropdownByKeyboard(trainingFilter, page);

            // close campus dropdown
            await trainingFilter.getByTestId('training-filter-campus-container').focus();
            await page.keyboard.press('Escape');
            await expect(trainingFilter.getByTestId('training-filter-campus-list')).toHaveClass(/hidden/);
        });
        test('user can use the arrow keys to navigate up and down the campus dropdown', async ({ page }) => {
            await page.goto('http://localhost:8080/index-training.html');
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();
            const trainingFilterElement = trainingElement.locator('training-filter');

            await openTheByCampusDropdownByKeyboard(trainingFilterElement, page);

            // arrow up and down robustly working (its actually easy to muck this up, so maintain, despite it seeming overkill)
            // await trainingFilterElement.getByTestId('training-filter-campus-label').focus();
            await page.keyboard.press('ArrowDown');
            await expect(trainingFilterElement.getByTestId('training-filter-campus-select-0')).toBeFocused();

            await page.keyboard.press('ArrowDown');
            await expect(trainingFilterElement.getByTestId('training-filter-campus-select-1')).toBeFocused();

            await page.keyboard.press('ArrowDown');
            await expect(trainingFilterElement.getByTestId('training-filter-campus-select-2')).toBeFocused();

            await page.keyboard.press('ArrowDown');
            // it is circular - we are back to 0
            await expect(trainingFilterElement.getByTestId('training-filter-campus-select-0')).toBeFocused();

            await trainingFilterElement.getByTestId('training-filter-campus-select-2').focus();

            await page.keyboard.press('ArrowUp');
            await expect(trainingFilterElement.getByTestId('training-filter-campus-select-1')).toBeFocused();

            await page.keyboard.press('ArrowUp');
            await expect(trainingFilterElement.getByTestId('training-filter-campus-select-0')).toBeFocused();

            await page.keyboard.press('ArrowUp');
            // and we are back on the parent campus button
            await expect(trainingFilterElement.getByTestId('training-filter-campus-container')).toBeFocused();
        });
        test('user can tab from campus dropdown button to week dropdown button', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();

            const trainingFilter = trainingElement.locator('training-filter');
            await expect(trainingFilter.getByTestId('training-filter-campus-dropdown')).toBeVisible();
            await trainingFilter.getByTestId('training-filter-campus-container').focus();
            // await trainingFilter.getByTestId('training-filter-campus-dropdown').waitForTimeout(1500);
            await page.keyboard.press('Tab');
            await expect(trainingFilter.getByTestId('training-filter-week-container')).toBeFocused();
        });
        test('the user can use the keyboard to open and close the week dropdown', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');

            await expect(trainingElement.locator('training-filter')).toBeVisible();
            const trainingFilter = trainingElement.locator('training-filter');

            // a enter-key click on the week parent opens the dropdown
            await expect(trainingFilter.getByTestId('training-filter-week-list')).not.toBeVisible();
            await expect(trainingFilter.getByTestId('training-filter-week-list')).toHaveClass(/hidden/);

            await openTheByWeekDropdown(trainingFilter, page);

            // close week dropdown
            await page.keyboard.press('Escape');
            await expect(trainingFilter.getByTestId('training-filter-week-list')).toHaveClass(/hidden/);
        });
        test('user can use the arrow keys to navigate up and down the week dropdown', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();

            const trainingFilter = trainingElement.locator('training-filter');

            // arrow up and down robustly working(its actually easy to muck this up, so leave it, despite it seeming overkill)
            await openTheByWeekDropdown(trainingFilter, page);

            await trainingFilter.getByTestId('training-filter-week-label').focus();

            await page.keyboard.press('ArrowDown');
            await expect(trainingFilter.getByTestId('training-filter-select-week-0')).toBeFocused();

            await page.keyboard.press('ArrowDown');
            await expect(trainingFilter.getByTestId('training-filter-select-week-1')).toBeFocused();

            await page.keyboard.press('ArrowDown');
            await expect(trainingFilter.getByTestId('training-filter-select-week-2')).toBeFocused();

            await page.keyboard.press('ArrowDown');
            await expect(trainingFilter.getByTestId('training-filter-select-week-3')).toBeFocused();

            await page.keyboard.press('ArrowUp');
            await expect(trainingFilter.getByTestId('training-filter-select-week-2')).toBeFocused();

            await page.keyboard.press('ArrowUp');
            await expect(trainingFilter.getByTestId('training-filter-select-week-1')).toBeFocused();

            await page.keyboard.press('ArrowUp');
            await expect(trainingFilter.getByTestId('training-filter-select-week-0')).toBeFocused();

            await page.keyboard.press('ArrowUp');
            await expect(trainingFilter.getByTestId('training-filter-week-container')).toBeFocused();

            // final entry in dropdown doesn't arrow further
            await trainingFilter.getByTestId('training-filter-select-week-14').focus();
            await page.keyboard.press('ArrowDown');
            await expect(trainingFilter.getByTestId('training-filter-select-week-14')).toBeFocused();
        });
        test('uthe user can tab from the week dropdown to the quick links', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');
            await expect(trainingElement.locator('training-filter')).toBeVisible();

            const trainingFilter = trainingElement.locator('training-filter');

            // arrow up and down robustly working(its actually easy to muck this up, so leave it, despite it seeming overkill)
            await openTheByWeekDropdown(trainingFilter, page);

            await trainingFilter.getByTestId('training-filter-select-week-14').focus();

            await page.keyboard.press('Tab');
            // it tabs to the first button in the quicklinks
            await expect(trainingFilter.getByTestId('filter-quicklinks').locator('button').first()).toBeFocused();
        });
        test('user can back tab from the week dropdown button to the campus dropdown button', async ({ page }) => {
            await expect(page.locator('library-training[id="test-with-filter"]')).toBeVisible();
            const trainingElement = page.locator('library-training[id="test-with-filter"]');

            await expect(trainingElement.locator('training-filter')).toBeVisible();
            const trainingFilter = trainingElement.locator('training-filter');

            await expect(trainingFilter.getByTestId('training-filter-week-container')).toBeVisible();
            await trainingFilter.getByTestId('training-filter-week-container').focus();
            await page.keyboard.press('Shift+Tab');

            await expect(trainingFilter.getByTestId('training-filter-campus-container')).toBeFocused();
        });
    });
});
