import overrides from './css/overrides.css';
import { searchPortalLocale } from './searchPortal.locale';
import { throttle } from 'throttle-debounce';
import ApiAccess from '../ApiAccess/ApiAccess';
import { cookieNotFound, getCookieValue, setCookie } from '../helpers/cookie';

const template = document.createElement('template');
template.innerHTML = `
    <style>${overrides.toString()}</style>
    <div id="primo-search" class="MuiPaper-root MuiCard-root libraryCard StandardCard MuiPaper-elevation1 MuiPaper-rounded" data-testid="primo-search" role="region" aria-live="polite">
        <div class="MuiCardContent-root libraryContent" data-testid="primo-search-content">
            <form id="search-portal-form" class="searchForm">
                <div class="MuiFormControl-root searchPanel" style="margin-bottom: -0.75rem; padding-top: 1rem;">
                    <label id="primo-search-select-label" class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-animated MuiInputLabel-shrink MuiFormLabel-filled" data-shrink="true">Search</label>
                </div>
                <div id="search-parent" class="searchPanel MuiGrid-container MuiGrid-spacing-xs-1 MuiGrid-align-items-xs-flex-end">
                    <div id="search-portal-select" class="MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-auto">
                        <div class="MuiFormControl-root portaltype-dropdown-container">
                            <div id="portaltype-dropdown" data-testid="portaltype-current-wrapper" class="search-type-button MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl">
                                <div class="search-type-button MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiInputBase-input MuiInput-input" tabindex="0" role="button" aria-haspopup="listbox" aria-labelledby="primo-search-select-label" data-testid="primo-search-select">
                                    <svg data-testid="portaltype-current-svg" class="search-type-button MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                        <path id="portaltype-current-icon" class="search-type-button" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path>
                                    </svg>&nbsp;<span id="portaltype-current-label" class="search-type-button" data-testid="portaltype-current-label">Library</span>
                                    <input id="portaltype-current-value" type="hidden" name="portaltype">
                                </div>
                                <!-- input field probable unused -->
                                <input id="search-portal-input" type="hidden" data-testid="primo-search-select-input" value="0">
                                <svg class="MuiSvgIcon-root MuiSelect-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M7 10l5 5 5-5z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div id="input-field-wrapper" class="MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-true">
                        <div id="primo-search-autocomplete" class="MuiAutocomplete-root" role="combobox" aria-expanded="false" data-testid="primo-search-autocomplete">
                            <div class="MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth">
                                <div class="MuiInputBase-root MuiInput-root MuiInput-underline MuiAutocomplete-inputRoot MuiInputBase-fullWidth MuiInput-fullWidth MuiInputBase-formControl MuiInput-formControl MuiInputBase-adornedEnd">
                                    <input id="current-inputfield" name="currentInputfield" aria-invalid="false" autocomplete="off" placeholder="Find books, articles, databases, Library guides &amp; more" type="search" class="MuiInputBase-input MuiInput-input selectInput MuiAutocomplete-input MuiAutocomplete-inputFocused MuiInputBase-inputAdornedEnd MuiInputBase-inputTypeSearch MuiInput-inputTypeSearch" aria-autocomplete="list" autocapitalize="none" spellcheck="false" aria-label="Enter your search terms" data-testid="primo-search-autocomplete-input" value="">
                                    <div class="MuiAutocomplete-endAdornment"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="MuiGrid-item MuiGrid-grid-xs-auto utilityarea">
                        <div class="MuiGrid-container">
                            <div class="MuiGrid-item MuiGrid-grid-xs-auto">
                                <button id="clear-search-term" class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall" tabindex="0" type="button" title="Clear your search term" data-testid="primo-search-autocomplete-voice-clear">
                                    <span class="MuiIconButton-label">
                                        <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                                        </svg>
                                    </span>
                                    <span class="MuiTouchRipple-root"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-auto">
                        <button id="primo-search-submit" class="MuiButtonBase-root MuiButton-root MuiButton-contained searchButton MuiButton-containedPrimary MuiButton-containedSizeLarge MuiButton-sizeLarge MuiButton-fullWidth" tabindex="0" type="submit" data-testid="primo-search-submit" value="Submit" title="Perform your search">
                            <span class="MuiButton-label">
                                <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                                </svg>
                            </span>
                            <span class="MuiTouchRipple-root"></span>
                        </button>
                    </div>
                </div>
                <div id="footerLinks" class="searchPanel MuiGrid-container MuiFormControlMuiGrid-spacing-xs-2" data-testid="primo-search-links">
                </div>
            </form>
        </div>
    </div>
`;

const PRIMO_LIBRARY_SEARCH = '0';
const PRIMO_BOOKS_SEARCH = '1';
const PRIMO_JOURNAL_ARTICLES_SEARCH = '2';
const PRIMO_VIDEO_AUDIO_SEARCH = '3';
const PRIMO_JOURNALS_SEARCH = '4';
const PRIMO_PHYSICAL_ITEMS_SEARCH = '5';
// const PRIMO_DATABASE_SEARCH = '6';
const EXAM_SEARCH_TYPE = '7';
const COURSE_RESOURCE_SEARCH_TYPE = '8';

const REMEMBER_COOKIE_ID = 'rememberSearchType';

class SearchPortal extends HTMLElement {
    constructor() {
        super();

        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));

        this.addListeners(shadowDOM);

        const useSearchType = this.getOpeningSearchType();
        this.setSearchTypeButton(shadowDOM, useSearchType);

        this.createPortalTypeSelector(shadowDOM);

        this.addListeners = this.addListeners.bind(this);
        this.appendFooterLinks = this.appendFooterLinks.bind(this);
        this.createFooterLink = this.createFooterLink.bind(this);
        this.createPortalTypeSelectionEntry = this.createPortalTypeSelectionEntry.bind(this);
        this.createPortalTypeSelector = this.createPortalTypeSelector.bind(this);
        this.getOpeningSearchType = this.getOpeningSearchType.bind(this);
        this.isPortalTypeDropDownOpen = this.isPortalTypeDropDownOpen.bind(this);
        this.listenForClicks = this.listenForClicks.bind(this);
        this.setSearchTypeButton = this.setSearchTypeButton.bind(this);
        this.showHidePortalTypeDropdown = this.showHidePortalTypeDropdown.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
    }

    async getPrimoSuggestions(keyword) {
        await new ApiAccess()
            .loadPrimoSuggestions(keyword)
            .then((suggestions) => {
                console.log('getPrimoSuggestions: received ', suggestions);
                this.loadSuggestionsIntoPage(suggestions);
            })
            .catch((e) => {
                console.log('getPrimoSuggestions, error: ', e);
            });
    }

    async getExamPaperSuggestions(keyword) {
        await new ApiAccess()
            .loadExamPaperSuggestions(keyword)
            .then((suggestions) => {
                console.log('loadExamPaperSuggestions: received ', suggestions);
                this.loadSuggestionsIntoPage(suggestions, 'courseid');
            })
            .catch((e) => {
                console.log('getExamPaperSuggestions, error: ', e);
            });
    }

    async getLearningResourceSuggestions(keyword) {
        await new ApiAccess()
            .loadHomepageCourseReadingListsSuggestions(keyword)
            .then((suggestions) => {
                console.log('loadHomepageCourseReadingListsSuggestions: received ', suggestions);
                this.loadSuggestionsIntoPage(suggestions, 'name');
            })
            .catch((e) => {
                console.log('getLearningResourceSuggestions, error: ', e);
            });
    }

    /**
     *
     * @param suggestions
     * @param urlsource - some apis need a non displayed value to build the url. This tells them what field to use
     */
    loadSuggestionsIntoPage(suggestions, urlsource = 'text') {
        const shadowDOM = document.querySelector('search-portal').shadowRoot;

        const suggestionParent = !!shadowDOM && shadowDOM.getElementById('search-portal-form');

        document.addEventListener('click', this.listenForClicks);
        console.log('added listenForSuggestionListClick');

        /* istanbul ignore else  */
        if (!!suggestionParent && !!suggestions && suggestions.length > 0) {
            let ul = suggestionParent.querySelector('#search-portal-autocomplete-listbox');
            if (!ul) {
                ul = document.createElement('ul');
                !!ul && (ul.className = 'MuiAutocomplete-listbox');
                !!ul && ul.setAttribute('id', 'search-portal-autocomplete-listbox');
                !!ul && ul.setAttribute('data-testid', 'primo-search-autocomplete-listbox');
                !!ul && ul.setAttribute('role', 'listbox');
                !!ul && ul.setAttribute('aria-labelledby', 'primo-search-select-label');
                !!ul && ul.setAttribute('aria-label', 'Suggestion list');
            } else {
                // clear pre-existing suggestions
                ul.innerHTML = '';
            }

            const searchType = !!shadowDOM && shadowDOM.getElementById('portaltype-current-value');
            // searchType.value returns 0,1, ... 8; ie the current dropdown id
            let type =
                !!searchPortalLocale.typeSelect?.items &&
                searchPortalLocale.typeSelect.items.filter((item, index) => {
                    return item.selectId === searchType.value;
                });
            !!type && type.length > 0 && (type = type.shift());

            // loop through suggestions
            suggestions.forEach((suggestion, index) => {
                const suggestiondisplay = document.createElement('li');

                /* istanbul ignore else  */
                if (!!suggestiondisplay && !!suggestion.text && !!suggestion[urlsource]) {
                    const text = document.createTextNode(suggestion.text);

                    const encodedSearchTerm = encodeURIComponent(suggestion[urlsource]);
                    const link = type.link
                        .replace('[keyword]', encodedSearchTerm)
                        .replace('[keyword]', encodedSearchTerm); // database search has two instances of keyword
                    const anchor = document.createElement('a');
                    !!anchor && !!link && !!text && (anchor.href = link);
                    !!anchor && !!link && !!text && anchor.appendChild(text);
                    !!anchor && (anchor.className = 'MuiPaper-root suggestion-link');

                    !!suggestion && suggestiondisplay.setAttribute('tabindex', '-1');
                    !!suggestion && suggestiondisplay.setAttribute('role', 'option');
                    !!suggestion && suggestiondisplay.setAttribute('id', `primo-search-autocomplete-option-${index}`);
                    !!suggestion && suggestiondisplay.setAttribute('data-option-index', index);
                    !!suggestion && suggestiondisplay.setAttribute('aria-disabled', 'false');
                    !!suggestion && suggestiondisplay.setAttribute('aria-selected', 'false');
                    !!suggestion && (suggestiondisplay.className = 'MuiAutocomplete-option');

                    !!anchor && suggestiondisplay.appendChild(anchor);

                    ul.appendChild(suggestiondisplay);
                }
            });

            let listContainer = !!shadowDOM && shadowDOM.getElementById('suggestion-parent');
            if (!listContainer) {
                listContainer = document.createElement('div');
                !!listContainer && listContainer.setAttribute('id', `suggestion-parent`);
                !!listContainer &&
                    (listContainer.className =
                        'MuiPaper-root MuiAutocomplete-paper MuiPaper-elevation1 MuiPaper-rounded suggestionList');
            }
            !!listContainer && !!ul && listContainer.appendChild(ul);

            // set the top left corner & width of the suggestion list to match the placement of the input field
            const portalTypeContainer = !!shadowDOM && shadowDOM.getElementById('portaltype-dropdown');
            const inputFieldWrapper = !!shadowDOM && shadowDOM.getElementById('input-field-wrapper');
            const leftPx = portalTypeContainer.offsetWidth - 170; // this number simply works
            !!portalTypeContainer && !!listContainer && (listContainer.style.left = `${leftPx}px`);
            !!inputFieldWrapper &&
                !!listContainer &&
                (listContainer.style.width = `${inputFieldWrapper.offsetWidth}px`);

            !!listContainer && suggestionParent.appendChild(listContainer);
        }
    }

    /**
     * add listeners as required by the page
     * @param shadowDOM
     */
    addListeners(shadowDOM) {
        const that = this;

        function submitHandler() {
            return function (e) {
                e.preventDefault();

                const charactersBefore = (string, separator) => {
                    if (!!string && string.indexOf(separator) === -1) {
                        return string.trim();
                    }
                    return string.substr(0, string.indexOf(separator));
                };

                const formData = !!e && !!e.target && new FormData(e.target);
                const formObject = !!formData && Object.fromEntries(formData);

                if (!!formObject.currentInputfield) {
                    const matches = searchPortalLocale.typeSelect.items.filter((element) => {
                        return parseInt(element.selectId, 10) === parseInt(formObject.portaltype, 10);
                    });
                    const searchType = matches.length > 0 ? matches[0] : false;
                    const keyword = formObject.currentInputfield;
                    const link = searchType.link.replace('[keyword]', keyword).replace('[keyword]', keyword); // database search has two instances of keyword

                    // close the dropdown (because the window takes a moment to reload and it just looks weird)
                    that.clearSearchResults(shadowDOM); // check this one

                    window.location.assign(link);
                }

                return false;
            };
        }

        const theform = !!shadowDOM && shadowDOM.getElementById('search-portal-form');
        !!theform && theform.addEventListener('submit', submitHandler());

        const inputField = !!shadowDOM && shadowDOM.getElementById('current-inputfield');
        !!inputField &&
            inputField.addEventListener('keydown', function (e) {
                that.getSuggestions(shadowDOM);
            });
        !!inputField &&
            inputField.addEventListener('keyup', function (e) {
                that.getSuggestions(shadowDOM);
            });
        !!inputField &&
            inputField.addEventListener('onpaste', function (e) {
                that.getSuggestions(shadowDOM);
            });

        // open and close the dropdown when the search-type button is clicked
        const searchPortalSelector = !!shadowDOM && shadowDOM.getElementById('search-portal-select');
        console.log('searchPortalSelector addEventListener');
        !!searchPortalSelector &&
            searchPortalSelector.addEventListener('click', function (e) {
                console.log('searchPortalSelector click');
                that.showHidePortalTypeDropdown(shadowDOM);
                if (!that.isPortalTypeDropDownOpen(shadowDOM)) {
                    console.log('drop down has been closed');
                    // that.clearSearchResults(shadowDOM);
                    // that.getSuggestions(shadowDOM);
                } else {
                    console.log('drop down has been opened');
                }
            });

        function clearSearchTerm() {
            const inputField = !!shadowDOM && shadowDOM.getElementById('current-inputfield');
            !!inputField && (inputField.value = '');
        }
        const clearButton = !!shadowDOM && shadowDOM.getElementById('clear-search-term');
        !!clearButton &&
            clearButton.addEventListener('click', function (e) {
                clearSearchTerm();
                that.clearSearchResults(shadowDOM);
            });
    }

    getSuggestions(shadowDOM) {
        const that = this;

        // there have been cases where someone has put a book on the corner of a keyboard,
        // which sends thousands of requests to the server - block this
        // length has to be 4, because subjects like FREN3111 have 3 repeating numbers...
        function isRepeatingString(searchString) {
            if (searchString.length <= 4) {
                return false;
            }
            const lastChar = searchString.charAt(searchString.length - 1);
            const char2 = searchString.charAt(searchString.length - 2);
            const char3 = searchString.charAt(searchString.length - 3);
            const char4 = searchString.charAt(searchString.length - 4);
            const char5 = searchString.charAt(searchString.length - 5);

            return lastChar === char2 && lastChar === char3 && lastChar === char4 && lastChar === char5;
        }

        const throttledPrimoLoadSuggestions = throttle(3100, (newValue) => this.getPrimoSuggestions(newValue));
        const throttledExamLoadSuggestions = throttle(3100, (newValue) => this.getExamPaperSuggestions(newValue));
        const throttledReadingListLoadSuggestions = throttle(3100, (newValue) =>
            this.getLearningResourceSuggestions(newValue),
        );

        const focusOnSearchInput = () => {
            setTimeout(() => {
                const inputField = !!shadowDOM && shadowDOM.getElementById('current-inputfield');
                !!inputField && inputField.focus();
            }, 200);
        };

        const searchType = !!shadowDOM && shadowDOM.getElementById('portaltype-current-value');

        const inputField = !!shadowDOM && shadowDOM.getElementById('current-inputfield');

        if (!!inputField.value && inputField.value.length > 3 && !isRepeatingString(inputField.value)) {
            const PRIMO_SEARCH_TYPES = [
                PRIMO_LIBRARY_SEARCH,
                PRIMO_BOOKS_SEARCH,
                PRIMO_JOURNAL_ARTICLES_SEARCH,
                PRIMO_VIDEO_AUDIO_SEARCH,
                PRIMO_JOURNALS_SEARCH,
                PRIMO_PHYSICAL_ITEMS_SEARCH,
            ];

            // const firstSuggestion = !!shadowDOM && shadowDOM.getElementById('primo-search-autocomplete-option-0');
            // console.log('firstSuggestion = ', firstSuggestion);
            // console.log('prevInput.value = ', prevInput.value, '; inputField.value = ', inputField.value);
            // if (!!firstSuggestion) {
            //     console.log('firstSuggestion = ', firstSuggestion);
            //     // dont re-search, we dont need to hit the api again
            //     console.log('dont call the api if we already have the results');
            //     // dont call the api if we already have the results
            // } else
            if (PRIMO_SEARCH_TYPES.includes(searchType.value)) {
                console.log('do a primo search for ', inputField.value, ' on search type ', searchType.value);
                throttledPrimoLoadSuggestions(inputField.value);
            } else if (searchType.value === EXAM_SEARCH_TYPE) {
                console.log('do an exam search');
                throttledExamLoadSuggestions(inputField.value);
            } else if (searchType.value === COURSE_RESOURCE_SEARCH_TYPE) {
                console.log('do a course resource search');
                throttledReadingListLoadSuggestions(inputField.value);
            } else {
                console.log('do a ? did not recognise searchType.value = ', searchType.value);
            }
            focusOnSearchInput();
        } else {
            // actions.clearPrimoSuggestions();
        }
        // }
    }

    /**
     * When we have dropdowns we have to listen for clicks on the rest of the page so we close the dropdown when the user "clicks away"
     * We have 2 dropdowns.
     * Complicatedly track whether the click is in one of the dropdowns here
     * @param e
     */
    listenForClicks(e) {
        const that = this;
        const shadowDOM = document.querySelector('search-portal').shadowRoot;
        const portalTypeDropdown = shadowDOM.getElementById('portal-type-selector');
        console.log('listenForSearchTypeClick: a click on body, but is it in the dropdown?');

        const eventTarget = !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];
        // const eventTargetClass = !!eventTarget && eventTarget.hasAttribute('class') && !!eventTarget && eventTarget.getAttribute('class');
        const eventTargetId = !!eventTarget && eventTarget.hasAttribute('id') && eventTarget.getAttribute('id');

        console.log("click on e.composedPath()[0].getAttribute('class') = ", e.composedPath()[0].getAttribute('class'));
        e.composedPath()[0].getAttribute('class') === null && console.log(e.composedPath());
        if (!!eventTarget && eventTarget.classList.contains('search-type-button')) {
            // user has clicked on the closed Search Type selector
            console.log('click detector case ONE');
            // that.clearSearchResults(shadowDOM);
            // that.showHidePortalTypeDropdown(shadowDOM);
            return;
        } else if (!!eventTarget && eventTarget.classList.contains('suggestion-link')) {
            console.log('click detector case TWO');
            // a click on a suggestion dropdown item - clean up, but the click itself is handled as an anchor href
            console.log('SuggestionLink Clicked inside!');

            document.removeEventListener('click', that.listenForClicks);
            console.log('1 SuggestionLink removed listenForSuggestionListClick'); // if this doesnt happen then the removal failed
            return;
            //
            // } else if (!!eventTarget && eventTarget.classList.contains('search-type-button')) {
            //     console.log('click detector case THREE');
            //     // user has clicked open the search type selector
            //     that.clearSearchResults(shadowDOM);
            //     return;
        } else if (!!eventTargetId && eventTargetId.startsWith('portalTypeSelectionEntry-')) {
            console.log('click detector case FOUR');
            // user has selected a search type from the open search type dropdown
            // clean up - the click itself is handled elsewhere
            console.log('SearchType Clicked inside!');

            // if (that.isPortalTypeDropDownOpen(shadowDOM)) {
            console.log('search type selector is open');
            that.closeSearchTypeSelector(portalTypeDropdown, 'portalTypeSelectorDisplayed');

            const inputField = !!shadowDOM && shadowDOM.getElementById('current-inputfield');
            !!inputField && inputField.focus();

            // console.log('remove any current suggestion list');
            // let ul = shadowDOM.querySelector('#search-portal-autocomplete-listbox');
            // !!ul && (ul.innerHTML = '');

            that.clearSearchResults(shadowDOM);
            that.getSuggestions(shadowDOM);
            // } else {
            //     console.log('search type selector is closed');
            //     that.clearSearchResults(shadowDOM);
            // }

            const searchType = !!shadowDOM && shadowDOM.getElementById('portaltype-current-value');
            console.log('XXXX store search type as ', searchType.value);
            that.rememberSearchTypeChoice(searchType.value);

            document.removeEventListener('click', that.listenForClicks);
            console.log('SearchType removed listenForClicks'); // if this doesnt happen then the removal failed

            return;
        }
        console.log('click detector case FIVE');
        // user has clicked outside the dropdowns - close if open

        // This is a click outside.
        console.log('SearchType Clicked outside!');
        !!portalTypeDropdown && that.closeSearchTypeSelector(portalTypeDropdown, 'portalTypeSelectorDisplayed');

        // const shadowDOM = document.querySelector('search-portal').shadowRoot;
        that.clearSearchResults(shadowDOM);

        // dropdowns closed so remove listener
        document.removeEventListener('click', that.listenForClicks);
        console.log('2 SuggestionLink removed listenForClicks'); // if this doesnt happen then the removal failed
    }

    getOpeningSearchType() {
        if (cookieNotFound(REMEMBER_COOKIE_ID)) {
            return PRIMO_LIBRARY_SEARCH;
        }
        return getCookieValue(REMEMBER_COOKIE_ID);
    }

    rememberSearchTypeChoice(searchType) {
        //set cookie for 1 hours
        const numHours = 1;
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + numHours * 60 * 60 * 1000);

        setCookie(REMEMBER_COOKIE_ID, searchType, expiryDate);
    }

    isPortalTypeDropDownOpen(shadowDOM) {
        const portalTypeDropdown = !!shadowDOM && shadowDOM.getElementById('portal-type-selector');
        return !!portalTypeDropdown && !portalTypeDropdown.classList.contains('hidden');
    }

    showHidePortalTypeDropdown(shadowDOM) {
        const portalTypeDropdown = !!shadowDOM && shadowDOM.getElementById('portal-type-selector');

        // then display the dropdown
        !!portalTypeDropdown && this.toggleVisibility(portalTypeDropdown, 'portalTypeSelectorDisplayed');

        // if we are showing the dropdown,
        // set the top of the dropdown so the current element matches up with the underlying button
        if (this.isPortalTypeDropDownOpen(shadowDOM)) {
            // get the currrently displayed label
            const portalTypeCurrentLabel = !!shadowDOM && shadowDOM.getElementById('portaltype-current-label');
            // problem matching the '&amp;" in the video label
            const portalTypeCurrentLabelText =
                !!portalTypeCurrentLabel && portalTypeCurrentLabel.innerHTML.replace('&amp;', '_');
            let matchingID = 0;
            !!searchPortalLocale.typeSelect?.items &&
                searchPortalLocale.typeSelect.items.forEach((item, index) => {
                    item.name.replace('&', '_') === portalTypeCurrentLabelText && (matchingID = index);
                });

            const offsetPx = 15;
            const negativeHeightOfRowPx = -40;
            const newTopValue = matchingID * negativeHeightOfRowPx - offsetPx;
            !!matchingID && !!portalTypeDropdown && (portalTypeDropdown.style.top = `${newTopValue}px`);

            document.addEventListener('click', this.listenForClicks);
            console.log('added listenForSearchTypeClick');
        }
    }

    clearSearchResults(shadowDOM) {
        // const firstSuggestion = !!shadowDOM && shadowDOM.getElementById('primo-search-autocomplete-option-0');
        // console.log('clearSearchResults firstSuggestion = ', firstSuggestion);

        console.log('clearSearchResults clearing search result list');
        // if (!firstSuggestion) {
        const searchResults = !!shadowDOM && shadowDOM.getElementById('search-portal-autocomplete-listbox');
        !!searchResults && searchResults.remove();
        // } else {
        //     console.log('nothing to clear');
        // }
    }

    /**
     * show hide an element
     * if it has `hidden' class, replace it with the supplied class name
     */
    toggleVisibility(selector, displayStyle) {
        const showByClassname = !!selector && selector.className.replace(' hidden', ` ${displayStyle}`);
        const hideByClassname = !!selector && selector.className.replace(` ${displayStyle}`, ' hidden');
        !!selector && selector.classList.contains('hidden')
            ? !!showByClassname && (selector.className = showByClassname)
            : !!hideByClassname && (selector.className = hideByClassname);
    }

    closeSearchTypeSelector(selector, displayStyle) {
        const hideByClassname = !!selector && selector.className.replace(` ${displayStyle}`, ' hidden');
        !!selector &&
            !selector.classList.contains('hidden') &&
            !!hideByClassname &&
            (selector.className = hideByClassname);
    }

    createPortalTypeSelectionEntry(button, index, shadowDOM) {
        const that = this;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        !!path && (path.id = `portalTypeSelectionEntry-path-${index}`);
        !!path && path.setAttribute('d', button.iconPath);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        !!svg && (svg.id = `portalTypeSelectionEntry-svg-${index}`);
        !!svg && svg.setAttribute('class', 'MuiSvgIcon-root MuiSvgIcon-colorSecondary');
        !!svg && svg.setAttribute('focusable', 'false');
        !!svg && svg.setAttribute('viewBox', '0 0 24 24');
        !!svg && svg.setAttribute('ariaHidden', 'true');
        !!svg && !!path && svg.appendChild(path);

        const label = document.createElement('span');
        !!label && (label.id = `portalTypeSelectionEntry-${index}`);
        label.innerHTML = button.name;

        const li = document.createElement('li');
        !!li &&
            (li.className =
                // `portalTypeSelectionEntry MuiButtonBase-root MuiListItem-root MuiMenuItem-root Mui-selected MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button`);
                `portalTypeSelectionEntry portalTypeSelectionEntry-${index} MuiButtonBase-root MuiListItem-root MuiMenuItem-root Mui-selected MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button`);
        !!li && li.setAttribute('tabindex', '0');
        !!li && li.setAttribute('role', 'button');
        !!li && li.setAttribute('aria-disabled', 'false');
        !!li && li.setAttribute('data-testid', `primo-search-item-${index}`);
        !!li && li.setAttribute('data-value', index);
        !!li && !!svg && li.appendChild(svg);
        !!li && !!svg && li.appendChild(label);

        !!li &&
            li.addEventListener('click', function (e) {
                that.setSearchTypeButton(shadowDOM, index);
                that.appendFooterLinks(shadowDOM, index);
                that.showHidePortalTypeDropdown(shadowDOM);
                // We need to clear the search results even if we only swap between primo searches
                // because the link out in the search list will change
                that.clearSearchResults(shadowDOM);
                // if search term not blank, reload suggestions
                that.getSuggestions(shadowDOM);
            });

        return li;
    }

    setSearchTypeButton(shadowDOM, searchType = 0) {
        const portalTypeContainer = !!shadowDOM && shadowDOM.getElementById('portaltype-dropdown');

        const useSearchType = parseInt(searchType, 10);

        // put the icon on the display
        const portalTypeCurrentIcon = !!shadowDOM && shadowDOM.getElementById('portaltype-current-icon');
        !!portalTypeCurrentIcon &&
            !!searchPortalLocale.typeSelect?.items[useSearchType]?.iconPath &&
            portalTypeCurrentIcon.setAttribute('d', searchPortalLocale.typeSelect.items[useSearchType].iconPath);

        // put the text label on the display
        const portalTypeCurrentLabel = !!shadowDOM && shadowDOM.getElementById('portaltype-current-label');
        !!portalTypeCurrentLabel &&
            !!searchPortalLocale.typeSelect?.items[useSearchType]?.name &&
            (portalTypeCurrentLabel.innerHTML = searchPortalLocale.typeSelect.items[useSearchType].name);

        const portalTypeCurrentSave = !!shadowDOM && shadowDOM.getElementById('portaltype-current-value');
        !!portalTypeCurrentSave &&
            !!searchPortalLocale.typeSelect?.items[useSearchType]?.selectId &&
            (portalTypeCurrentSave.value = searchPortalLocale.typeSelect.items[useSearchType].selectId);

        // supply the placeholder text
        const inputField = !!shadowDOM && shadowDOM.getElementById('current-inputfield');
        !!inputField &&
            !!searchPortalLocale.typeSelect?.items[useSearchType]?.placeholder &&
            (inputField.placeholder = searchPortalLocale.typeSelect.items[useSearchType].placeholder);

        // add an extra class to the button to say which label it is currently showing
        // this is used by the css to make the dropdown highlight the matching label
        // remove any previous label - looks like we cant regexp to match a classname, we'll have to loop over the label.items length
        if (!!searchPortalLocale.typeSelect.items && searchPortalLocale.typeSelect.items.length > 0) {
            for (let ii = 0; ii < searchPortalLocale.typeSelect.items.length; ii++) {
                const testClassName = `label-${ii}-button`;

                if (portalTypeContainer.classList.contains(testClassName)) {
                    portalTypeContainer.className = portalTypeContainer.className.replace(testClassName, '').trim();
                    break;
                }
            }
        }
        const newClass = `label-${useSearchType}-button`;
        portalTypeContainer.className = `${portalTypeContainer.className} ${newClass}`;

        this.appendFooterLinks(shadowDOM, useSearchType);
    }

    createPortalTypeSelector(shadowDOM, searchType = 0) {
        const useSearchType = parseInt(searchType, 10);

        const portalTypeDropdown = document.createElement('ul');
        // !!portalTypeDropdown && (portalTypeDropdown.id = 'portal-type-selector');
        !!portalTypeDropdown &&
            (portalTypeDropdown.className =
                'MuiList-root MuiMenu-list MuiList-padding MuiPaper-elevation8 portalTypeSelector');
        !!portalTypeDropdown && portalTypeDropdown.setAttribute('role', 'listbox');
        !!portalTypeDropdown && portalTypeDropdown.setAttribute('tabindex', '-1');
        !!portalTypeDropdown && portalTypeDropdown.setAttribute('aria-labelledby', 'primo-search-select-label');

        // add the footer links for this searchtype
        !!portalTypeDropdown &&
            searchPortalLocale.typeSelect?.items.forEach((entry, index) => {
                const container = this.createPortalTypeSelectionEntry(entry, index, shadowDOM);
                !!container && portalTypeDropdown.appendChild(container);
            });

        const portalTypeSelectorContainer = document.createElement('div');
        !!portalTypeSelectorContainer && (portalTypeSelectorContainer.id = 'portal-type-selector');
        !!portalTypeSelectorContainer &&
            (portalTypeSelectorContainer.className = `MuiPaper-root MuiMenu-paper MuiPaper-elevation8 MuiPaper-rounded hidden`);
        !!portalTypeSelectorContainer && portalTypeSelectorContainer.setAttribute('tabindex', '-1');
        !!portalTypeSelectorContainer &&
            portalTypeSelectorContainer.setAttribute('data-testid', 'portal-type-selector');
        !!portalTypeSelectorContainer &&
            !!portalTypeDropdown &&
            portalTypeSelectorContainer.appendChild(portalTypeDropdown);
        const portalTypeContainer = !!shadowDOM && shadowDOM.getElementById('portaltype-dropdown');
        !!portalTypeContainer &&
            !!portalTypeSelectorContainer &&
            portalTypeContainer.appendChild(portalTypeSelectorContainer);
    }

    createFooterLink(link, index) {
        const displayLabel = document.createTextNode(link.label);

        const anchor = document.createElement('a');
        !!anchor && (anchor.href = link.linkto);
        !!anchor && (anchor.rel = 'noreferrer');
        !!anchor && (anchor.ariaLabel = link.label);
        anchor.appendChild(displayLabel);

        const container = document.createElement('div');
        !!container && (container.className = 'searchUnderlinks MuiGrid-item MuiGrid-grid-xs-auto');
        !!container && container.setAttribute('data-testid', `primo-search-links-${index}`);
        !!container && !!anchor && container.appendChild(anchor);
        return container;
    }

    appendFooterLinks(shadowDOM, searchType = 0) {
        const footerLinkContainer = !!shadowDOM && shadowDOM.getElementById('footerLinks');
        // clear current footer links
        !!footerLinkContainer && (footerLinkContainer.innerHTML = '');
        // add the footer links for this searchtype
        !!footerLinkContainer &&
            searchPortalLocale.links.forEach((link, index) => {
                if (link.display.includes(searchType)) {
                    const container = this.createFooterLink(link, index);
                    !!container && footerLinkContainer.appendChild(container);
                }
            });
    }
}

export default SearchPortal;
