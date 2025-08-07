import { test, expect } from '@playwright/test';
import { assertAccessibility } from '../lib/axe';

test.describe('Search Portal', () => {
    /**
     * Different search types have a different number of links in the footer area.
     * Checking the number of links confirms that the links change when we change search types
     * @param page
     * @param expectedLinkCount
     * @returns {Promise<void>}
     */
    async function assertHasCorrectNumberOfFooterLinks(page, expectedLinkCount) {
        await expect
            .poll(async () => page.locator('search-portal').getByTestId('footer-links').locator(':scope > div').count())
            .toEqual(expectedLinkCount);
    }

    async function openSearchTypeDropdown(searchPortalElement) {
        await expect(searchPortalElement.getByTestId('component-title')).toBeVisible();
        await expect(searchPortalElement.getByTestId('search-type-selector')).toBeVisible();
        await searchPortalElement.getByTestId('search-type-selector').click();
    }

    async function typeTextStringIntoInputField(searchPortalElement, text, numberOfResults = null) {
        await expect(searchPortalElement.getByTestId('input-field')).toBeVisible();
        await searchPortalElement.getByTestId('input-field').focus();
        await searchPortalElement.getByTestId('input-field').pressSequentially(text); // don't use fill, app has to respond to the keystrokes

        if (!!numberOfResults) {
            // the dropdown is now open & there will be search suggestions
            await expect
                .poll(async () => searchPortalElement.getByTestId('autocomplete-listbox').locator('li').count())
                .toEqual(numberOfResults);
        }
    }

    test.describe('Search Portal', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/');
        });
        test('the search dropdown has the expected children', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            const searchPortalElement = page.locator('search-portal');
            await expect(searchPortalElement.getByTestId('component-title')).toBeVisible();

            // on first load, the library drop down displays "All", for search everything
            await expect(searchPortalElement.getByTestId('search-type-selector')).toBeVisible();
            await expect(
                searchPortalElement.getByTestId('portal-type-current-label').filter({ hasText: 'All' }),
            ).toBeVisible();
            await assertHasCorrectNumberOfFooterLinks(page, 3);

            // there are the correct number of options in the search dropdown
            await searchPortalElement.getByTestId('search-type-selector').click();
            await expect
                .poll(async () =>
                    searchPortalElement.getByTestId('portal-type-wrapper-child').locator('button').count(),
                )
                .toEqual(9);
        });
        test.describe('accessibility', () => {
            test('at initial load', async ({ page }) => {
                const searchPortalElement = page.locator('search-portal');

                await expect(searchPortalElement.getByTestId('component-title')).toBeVisible();

                await assertAccessibility(page, 'search-portal');
            });

            test('when searching', async ({ page }) => {
                const searchPortalElement = page.locator('search-portal');

                await expect(searchPortalElement.getByTestId('input-field')).toBeVisible();
                await typeTextStringIntoInputField(searchPortalElement, 'beard');

                await assertAccessibility(page, 'search-portal');
            });
        });

        test('Books search should have the expected items', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            const searchPortalElement = page.locator('search-portal');

            await expect(searchPortalElement.getByTestId('component-title')).toBeVisible();

            // choose Books in search portal dropdown
            await searchPortalElement.getByTestId('search-type-selector').click();
            await searchPortalElement.getByTestId('portal-search-type-books').click();
            await expect(
                searchPortalElement.getByTestId('portal-type-current-label').filter({ hasText: 'Books' }),
            ).toBeVisible();

            await typeTextStringIntoInputField(searchPortalElement, 'beard', 10);

            await assertHasCorrectNumberOfFooterLinks(page, 3);
        });

        test('clear button clears input field', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            const searchPortalElement = page.locator('search-portal');

            await expect(searchPortalElement.getByTestId('component-title')).toBeVisible();

            // choose Books in search portal dropdown
            await searchPortalElement.getByTestId('search-type-selector').click();
            await searchPortalElement.getByTestId('portal-search-type-books').click();
            await expect(
                searchPortalElement.getByTestId('portal-type-current-label').filter({ hasText: 'Books' }),
            ).toBeVisible();

            await typeTextStringIntoInputField(searchPortalElement, 'beard', 10);
            await expect(searchPortalElement.getByTestId('input-field')).toHaveValue('beard');
            await expect(searchPortalElement.getByTestId('input-field-clear')).toBeVisible();
            await searchPortalElement.getByTestId('input-field-clear').click();
            await expect(searchPortalElement.getByTestId('input-field')).toHaveValue('');
            await expect(searchPortalElement.getByTestId('autocomplete-listbox')).not.toBeVisible();
        });

        test('escape key clears input field', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            const searchPortalElement = page.locator('search-portal');

            await expect(searchPortalElement.getByTestId('component-title')).toBeVisible();

            // choose Books in search portal dropdown
            await searchPortalElement.getByTestId('search-type-selector').click();
            await searchPortalElement.getByTestId('portal-search-type-books').click();
            await expect(
                searchPortalElement.getByTestId('portal-type-current-label').filter({ hasText: 'Books' }),
            ).toBeVisible();

            await assertHasCorrectNumberOfFooterLinks(page, 3);

            // escape key clears field
            await typeTextStringIntoInputField(searchPortalElement, 'beard', 10);
            await expect(searchPortalElement.getByTestId('input-field')).toHaveValue('beard');
            await searchPortalElement.getByTestId('input-field').press('Escape');
            await expect(searchPortalElement.getByTestId('input-field')).toHaveValue('');
            await expect(searchPortalElement.getByTestId('autocomplete-listbox')).not.toBeVisible();
        });

        test('Journal articles search should have the expected items', async ({ page }) => {
            await page.route('https://search.library.uq.edu.au/**', async (route) => {
                await route.fulfill({ body: 'user is on a Primo result page' });
            });

            await page.setViewportSize({ width: 1300, height: 1000 });
            const searchPortalElement = page.locator('search-portal');

            await openSearchTypeDropdown(searchPortalElement);
            // choose Journal articles type
            await searchPortalElement.locator('button[data-testid="portal-search-type-journal-articles"]').click();
            await expect(searchPortalElement.getByText(/Journal articles/).first()).toBeVisible();

            await assertHasCorrectNumberOfFooterLinks(page, 3);

            // typing in the text area shows the correct entries from the api
            await searchPortalElement.getByTestId('input-field').press('Escape');
            await typeTextStringIntoInputField(searchPortalElement, 'beard', 10);

            // the user clicks the button to load the search
            await searchPortalElement.getByTestId('search-portal-submit').click();
            await expect(
                page
                    .locator('body')
                    .getByText(/user is on a Primo result page/)
                    .first(),
            ).toBeVisible();
        });

        test('Databases should have the expected items', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            const searchPortalElement = page.locator('search-portal');

            await openSearchTypeDropdown(searchPortalElement);
            await searchPortalElement.getByTestId('portal-search-type-databases').click();
            await expect(searchPortalElement.getByTestId('portal-type-current-label')).toBeVisible();
            await expect(searchPortalElement.getByTestId('portal-type-current-label')).toHaveText('Databases');

            await assertHasCorrectNumberOfFooterLinks(page, 1);

            //  no suggestion api available
            await searchPortalElement.getByTestId('input-field').press('Escape');
            await typeTextStringIntoInputField(searchPortalElement, 'history');
            await expect(searchPortalElement.getByTestId('autocomplete-listbox')).not.toBeVisible();
        });

        test('Exams should have the expected items', async ({ page }) => {
            await page.route('https://www.library.uq.edu.au/**', async (route) => {
                await route.fulfill({ body: 'user visits library page' });
            });
            const searchPortalElement = page.locator('search-portal');

            await openSearchTypeDropdown(searchPortalElement);
            await searchPortalElement.getByTestId('portal-search-type-past-exam-papers').click();
            await expect(searchPortalElement.getByTestId('portal-type-current-label')).toBeVisible();
            await expect(searchPortalElement.getByTestId('portal-type-current-label')).toHaveText('Past exam papers');

            await assertHasCorrectNumberOfFooterLinks(page, 1);

            // typing in the exams text area shows the correct entries from the api
            await searchPortalElement.getByTestId('input-field').press('Escape');
            await typeTextStringIntoInputField(searchPortalElement, 'PHIL', 3);

            await expect(searchPortalElement.getByTestId('suggestion-link-0')).toHaveAttribute(
                'href',
                /https:\/\/www.library.uq.edu.au\/exams\/course\//,
            );

            await searchPortalElement.getByTestId('suggestion-link-1').click();
            await expect(page.getByText('user visits library page')).toBeVisible();
        });

        test('Course reading lists should have the expected items', async ({ page }) => {
            await page.route('https://uq.rl.talis.com/search.html**', async (route) => {
                await route.fulfill({ body: 'user visits talis page' });
            });
            const searchPortalElement = page.locator('search-portal');

            await openSearchTypeDropdown(searchPortalElement);
            await searchPortalElement.getByTestId('portal-search-type-course-reading-lists').click();
            await expect(searchPortalElement.getByTestId('portal-type-current-label')).toBeVisible();
            await expect(searchPortalElement.getByTestId('portal-type-current-label')).toHaveText(
                'Course reading lists',
            );

            await assertHasCorrectNumberOfFooterLinks(page, 1);

            // typing in the exams text area shows the correct entries from the api
            await searchPortalElement.getByTestId('input-field').press('Escape');
            await typeTextStringIntoInputField(searchPortalElement, 'PHIL', 3);

            await expect(searchPortalElement.getByTestId('suggestion-link-0')).toHaveAttribute(
                'href',
                /https:\/\/uq.rl.talis.com\/search.html/,
            );

            await searchPortalElement.getByTestId('suggestion-link-1').click();
            await expect(page.getByText('user visits talis page')).toBeVisible();
        });

        test('When the search type is changed the search suggestions reload', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            const searchPortalElement = page.locator('search-portal');

            await expect(searchPortalElement.getByTestId('component-title')).toBeVisible();

            // load a search against the Library search type
            await typeTextStringIntoInputField(searchPortalElement, 'beard');
            // the suggestion list is open and has all-type links
            await expect
                .poll(async () => searchPortalElement.getByTestId('autocomplete-listbox').locator('li').count())
                .toBe(10); // same as lower down
            await expect(searchPortalElement.getByTestId('suggestion-link-0')).toHaveAttribute(
                'href',
                /rtype,exclude,reviews,lk/,
            ); // look for the part that is specific to the Library search

            // change to a different search type
            await searchPortalElement.getByTestId('search-type-selector').click();
            // await expect(searchPortalElement.getByTestId('autocomplete-listbox')).not.toBeVisible();
            // await expect(searchPortalElement.getByTestId('portal-search-type-books')).toBeVisible();
            await searchPortalElement.getByTestId('portal-search-type-journal-articles').click();

            // the suggestions reload automatically and have journalarticle-type links now
            await expect(searchPortalElement.getByTestId('input-field')).toBeFocused();
            await expect
                .poll(async () => searchPortalElement.getByTestId('autocomplete-listbox').locator('li').count())
                .toBe(10);
            await expect(searchPortalElement.getByTestId('suggestion-link-0')).toHaveAttribute(
                'href',
                /facet=rtype,include,articles/,
            ); // look for the part that is specific to the Book search
        });

        test('When the user clicks elsewhere on the page the search type dropdown will close', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            const searchPortalElement = page.locator('search-portal');

            await openSearchTypeDropdown(searchPortalElement);
            await expect(searchPortalElement.getByTestId('portal-search-type-all')).toBeVisible();

            // click somewhere on the page outside the Search type dropdown
            await page.getByTestId('random-page-element').click();

            await expect(searchPortalElement.getByTestId('portal-search-type-all')).not.toBeVisible();
        });

        test('When the user clicks elsewhere on the page the suggestion dropdown will close', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            const searchPortalElement = page.locator('search-portal');

            // type a search query - the drop down opens
            await typeTextStringIntoInputField(searchPortalElement, 'beard');
            await expect
                .poll(async () => searchPortalElement.getByTestId('autocomplete-listbox').locator('li').count())
                .toBe(10); // same as lower down

            // click somewhere on the page outside the Search type dropdown
            await page.getByTestId('random-page-element').click();

            await expect(searchPortalElement.getByTestId('autocomplete-listbox')).not.toBeVisible();
        });

        test("the user's search type selection is remembered", async ({ page }) => {
            const searchPortalElement = page.locator('search-portal');

            await searchPortalElement.getByTestId('search-type-selector').click();
            await expect(searchPortalElement.getByTestId('portal-search-type-journal-articles')).toBeVisible();
            await searchPortalElement.getByTestId('portal-search-type-journal-articles').click();
            await expect(
                searchPortalElement.getByTestId('portal-type-current-label').filter({ hasText: 'Journal articles' }),
            ).toBeVisible();

            // open a new window and the search type is saved
            await page.goto('/');
            await page.setViewportSize({ width: 1300, height: 1000 });
            {
                const searchPortalElement = page.locator('search-portal');
                await expect(searchPortalElement.getByText(/Journal articles/).first()).toBeVisible();
            }
        });

        // a repeating string does not send to the api - avoid slamming api because of eg a book on the keyboard
        test('a repeating string returns no results', async ({ page }) => {
            const searchPortalElement = page.locator('search-portal');

            await expect(searchPortalElement.getByTestId('component-title')).toBeVisible();
            await expect(searchPortalElement.getByTestId('input-field')).toBeVisible();

            // enter a repeating string
            await typeTextStringIntoInputField(searchPortalElement, 'DDDDD');
            await expect(searchPortalElement.getByTestId('autocomplete-listbox')).not.toBeVisible();
        });

        test('contains the correct mechanism for showing restrictions on use', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            const searchPortalElement = page.locator('search-portal');
            await expect(searchPortalElement.getByTestId('restrictions-accordian-controller')).toBeVisible();
            await expect(searchPortalElement.getByTestId('restrictions-accordian-controller')).toHaveText(
                'Restrictions on use',
            );
            await expect(searchPortalElement.getByTestId('restrictions-accordian-content')).not.toBeVisible();

            await searchPortalElement.getByTestId('restrictions-accordian-controller').click();
            await expect(searchPortalElement.getByTestId('restrictions-accordian-content')).toBeVisible();
            await expect(searchPortalElement.getByTestId('restrictions-accordian-content')).toContainText(
                'The use of AI tools with Library resources is prohibited unless expressly permitted.',
            );

            // and it closes
            await searchPortalElement.getByTestId('restrictions-accordian-controller').click();
            await expect(searchPortalElement.getByTestId('restrictions-accordian-content')).not.toBeVisible();
        });

        test('clicking the submit button goes to the external site', async ({ page }) => {
            await page.route('https://search.library.uq.edu.au/**', async (route) => {
                await route.fulfill({ body: 'user is on a Primo result page' });
            });

            const searchPortalElement = page.locator('search-portal');

            await typeTextStringIntoInputField(searchPortalElement, 'beard', 10);

            await searchPortalElement.getByTestId('search-portal-submit').click();
            await expect(
                page
                    .locator('body')
                    .getByText(/user is on a Primo result page/)
                    .first(),
            ).toBeVisible();
        });

        test('the mobile view shows the results list properly', async ({ page }) => {
            await page.setViewportSize({ width: 320, height: 480 });
            const searchPortalElement = page.locator('search-portal');

            await typeTextStringIntoInputField(searchPortalElement, 'beard', 10);
            await expect(searchPortalElement.getByTestId('suggestion-link-0')).toBeVisible();
            await expect(searchPortalElement.getByTestId('search-portal-suggestion-parent')).toHaveCSS(
                'left',
                '-203px',
            );
        });

        test('if a suggestion api fails we just dont get a suggestion list - primo', async ({ page }) => {
            await page.goto('http://localhost:8080/?user=errorUser');
            const searchPortalElement = page.locator('search-portal');

            await searchPortalElement.getByTestId('search-type-selector').click();
            await searchPortalElement.getByTestId('portal-search-type-books').click();
            await typeTextStringIntoInputField(searchPortalElement, 'PHIL');

            await expect(page.getByTestId('search-portal-suggestion-parent')).not.toBeVisible();
        });

        test('if a suggestion api fails we just dont get a suggestion list - exam papers', async ({ page }) => {
            await page.goto('http://localhost:8080/?user=errorUser');
            await page.setViewportSize({ width: 1300, height: 1000 });
            const searchPortalElement = page.locator('search-portal');
            await searchPortalElement.getByTestId('search-type-selector').click();
            await searchPortalElement.getByTestId('portal-search-type-past-exam-papers').click();
            await typeTextStringIntoInputField(searchPortalElement, 'PHIL');

            await page.waitForTimeout(500);
            await expect(page.locator('[data-testid="search-portal-suggestion-parent"]')).not.toBeVisible();
        });

        test('if a suggestion api fails we just dont get a suggestion list - talis', async ({ page }) => {
            await page.goto('http://localhost:8080/?user=errorUser');
            await page.setViewportSize({ width: 1300, height: 1000 });
            {
                const searchPortalElement = page.locator('search-portal');
                await searchPortalElement.getByTestId('search-type-selector').click();
                await searchPortalElement.getByTestId('portal-search-type-course-reading-lists').click();
                await typeTextStringIntoInputField(searchPortalElement, 'PHIL');
            }
            await page.waitForTimeout(500);
            await expect(page.locator('[data-testid="search-portal-suggestion-parent"]')).not.toBeVisible();
        });
    });

    test.describe('keyboard actions', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/');
        });
        test('the user can use the keyboard to navigate between suggestion items', async ({ page }) => {
            const searchPortalElement = page.locator('search-portal');

            // the user can key from the search term to the first suggestions
            await typeTextStringIntoInputField(searchPortalElement, 'beard', 10);
            page.keyboard.press('ArrowDown');
            await expect(searchPortalElement.getByTestId('suggestion-link-0')).toBeFocused();

            // focus on Nth suggestion then arrow down, and focus should be on #N+1
            await searchPortalElement.getByTestId('suggestion-link-1').focus();
            await page.keyboard.press('ArrowDown');
            await expect(searchPortalElement.getByTestId('suggestion-link-2')).toBeFocused();

            // focus on Nth suggestion then arrow up, and focus should be on N-1
            await searchPortalElement.getByTestId('suggestion-link-6').focus();
            await page.keyboard.press('ArrowUp');
            await expect(searchPortalElement.getByTestId('suggestion-link-5')).toBeFocused();

            // focus on suggestion 1 then arrow up, and focus should be on the input field
            await searchPortalElement.getByTestId('suggestion-link-0').focus();
            await page.keyboard.press('ArrowUp');
            await expect(searchPortalElement.getByTestId('input-field')).toBeFocused();

            // focus on last suggestion then tab and focus should be on the cancel button
            await searchPortalElement.getByTestId('suggestion-link-9').focus();
            await page.keyboard.press('Tab');
            await expect(searchPortalElement.getByTestId('input-field-clear')).toBeFocused();

            // focus on a suggestion and hit clear button and suggestions are cleared
            await searchPortalElement.getByTitle('Clear your search term').click();
            await typeTextStringIntoInputField(searchPortalElement, 'beard');
            await searchPortalElement.getByTestId('suggestion-link-0').focus();
            await page.keyboard.press('Escape');
            await expect(searchPortalElement.getByTestId('autocomplete-listbox')).not.toBeVisible();
            await expect(searchPortalElement.getByTestId('input-field')).toHaveValue('');
        });

        test('the user can use the keyboard to navigate to a suggestion link', async ({ page }) => {
            await page.route('https://search.library.uq.edu.au/**', async (route) => {
                await route.fulfill({ body: 'user is on a Primo result page' });
            });

            const searchPortalElement = page.locator('search-portal');

            // the enter key will navigate to the suggestion link
            await page.keyboard.press('Escape');
            await typeTextStringIntoInputField(searchPortalElement, 'beard', 10);
            await expect(searchPortalElement.getByTestId('suggestion-link-2')).toHaveAttribute(
                'href',
                /facet=rtype,exclude,newspaper_articles,lk&facet=rtype,exclude,reviews,lk/,
            );
            await expect(searchPortalElement.getByTestId('suggestion-link-2')).toHaveAttribute(
                'href',
                /query=any,contains,beards%20massage/,
            );
            await page.keyboard.press('Enter');
            await expect(
                page
                    .locator('body')
                    .getByText(/user is on a Primo result page/)
                    .first(),
            ).toBeVisible();
        });

        test('the user can use the keyboard to navigate the search type dropdown', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            const searchPortalElement = page.locator('search-portal');

            // arrow down from nth item goes to item n+1
            await searchPortalElement.getByTestId('search-type-selector').click(); // drop down opens
            await searchPortalElement.getByTestId('portal-search-type-books').focus();
            await page.keyboard.press('ArrowDown');
            await expect(searchPortalElement.getByTestId('portal-search-type-journal-articles')).toBeFocused();

            // arrow up from nth item goes to item n-1
            await searchPortalElement.getByTestId('portal-search-type-journals').focus();
            await page.keyboard.press('ArrowUp');
            await expect(searchPortalElement.getByTestId('portal-search-type-video-and-audio')).toBeFocused();

            // tab from final item goes to next field
            await searchPortalElement.getByTestId('portal-search-type-course-reading-lists').focus();
            await page.keyboard.press('Tab');
            await expect(searchPortalElement.getByTestId('input-field')).toBeFocused();

            // the user types a search on 'Library' (we are still on "All" - we never actually chose one of the options)
            await typeTextStringIntoInputField(searchPortalElement, 'beard', 10);
            await expect(searchPortalElement.getByTestId('suggestion-link-0')).toHaveAttribute(
                'href',
                /facet=rtype,exclude,newspaper_articles,lk&facet=rtype,exclude,reviews,lk/,
            );

            // while the search results are still open, the user changes search type
            await searchPortalElement.getByTestId('search-type-selector').click(); // drop down opens
            // choose a different search type
            await searchPortalElement.getByTestId('portal-search-type-video-and-audio').focus();
            await page.keyboard.press('Enter');
            // and the search suggestions should update without further user action to the new search results
            await expect.poll(async () => searchPortalElement.locator('li').count()).toBe(10);
            await expect(searchPortalElement.getByTestId('suggestion-link-0')).toHaveAttribute(
                'href',
                /rtype,include,audios/,
            );
        });

        test('the user can use the keyboard to control the input text field', async ({ page }) => {
            const searchPortalElement = page.locator('search-portal');

            await typeTextStringIntoInputField(searchPortalElement, 'beard', 10);
            await expect(searchPortalElement.getByTestId('autocomplete-listbox')).toBeVisible();
            await searchPortalElement.getByTestId('input-field').focus();
            await page.keyboard.press('Escape');
            await expect(searchPortalElement.getByTestId('autocomplete-listbox')).not.toBeVisible();
            await expect(searchPortalElement.getByTestId('input-field')).toHaveValue('');
        });
    });
});
