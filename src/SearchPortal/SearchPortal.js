import overrides from './css/overrides.css';
import { searchPortalLocale } from './searchPortal.locale';
import { throttle } from 'throttle-debounce';
import ApiAccess from '../ApiAccess/ApiAccess';
import { cookieNotFound, getCookieValue, setCookie } from '../helpers/cookie';
import {
    isArrowDownKeyPressed,
    isArrowUpKeyPressed,
    isEscapeKeyPressed,
    isReturnKeyPressed,
    isTabKeyPressed,
} from '../helpers/keyDetection';

const template = document.createElement('template');
template.innerHTML = `
    <style>${overrides.toString()}</style>
    <div id="search-portal" class="MuiPaper-root MuiCard-root libraryCard StandardCard MuiPaper-elevation1 MuiPaper-rounded" data-testid="primo-search" data-analyticsid="primo-search" data-analyticsid="primo-search" role="region" aria-live="polite">
        <div class="MuiCardContent-root libraryContent" data-testid="primo-search-content" data-analyticsid="primo-search-content">
            <form id="primo-search-form" class="searchForm" role="search">
                <div class="MuiFormControl-root searchPanel" style="margin-bottom: -0.75rem; padding-top: 1rem;">
                    <h2 id="search-portal-type-select-label" class="searchPortalLabel MuiFormLabel-root MuiInputLabel-root MuiInputLabel-animated MuiInputLabel-shrink MuiFormLabel-filled" data-shrink="true" aria-label="Search UQ Library">Library Search</h2>
                </div>
                <div id="search-parent" class="searchPanel MuiGrid-container MuiGrid-spacing-xs-1 MuiGrid-align-items-xs-flex-end">
                    <div id="search-portal-type-select" class="MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-auto">
                        <div class="MuiFormControl-root portaltype-dropdown-container">
                            <div id="portaltype-dropdown" data-testid="search-portal-type-select-wrapper" class="search-type-button MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl">
                                <button type="button" class="search-type-button MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiInputBase-input MuiInput-input" tabindex="0" aria-labelledby="search-portal-type-select-label" data-testid="primo-search-select" data-analyticsid="primo-search-select">
                                    <svg data-testid="portaltype-current-svg" class="search-type-button MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                        <path id="portaltype-current-icon" class="search-type-button" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path>
                                    </svg>&nbsp;<span id="portaltype-current-label" class="search-type-button" data-testid="portaltype-current-label">Library</span>
                                    <input data-testid="primo-search-select-input" data-analyticsid="primo-search-select-input" id="search-type-current-value" type="hidden" name="portaltype">
                                </button>
                                <svg class="MuiSvgIcon-root MuiSelect-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M7 10l5 5 5-5z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div id="input-field-wrapper" class="MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-true">
                        <div id="search-portal-autocomplete" class="MuiAutocomplete-root" data-testid="primo-search-autocomplete" data-analyticsid="primo-search-autocomplete">
                            <div class="MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth">
                                <div id="inputFieldParent" role="combobox" aria-expanded="false" aria-controls="search-portal-autocomplete-listbox" class="MuiInputBase-root MuiInput-root MuiInput-underline MuiAutocomplete-inputRoot MuiInputBase-fullWidth MuiInput-fullWidth MuiInputBase-formControl MuiInput-formControl MuiInputBase-adornedEnd">
                                    <!--  aria-controls="search-portal-autocomplete-listbox" invalid per AXE --> 
                                    <input type="text" id="current-inputfield" name="currentInputfield" aria-invalid="false" autocomplete="off" placeholder="Find books, articles, databases, Library guides &amp; more" type="search" class="MuiInputBase-input MuiInput-input selectInput MuiAutocomplete-input MuiAutocomplete-inputFocused MuiInputBase-inputAdornedEnd MuiInputBase-inputTypeSearch MuiInput-inputTypeSearch" aria-autocomplete="list" autocapitalize="none" spellcheck="false" aria-label="Enter your search terms" data-testid="primo-search-autocomplete-input" data-analyticsid="primo-search-autocomplete-input" value="">
                                    <div class="MuiAutocomplete-endAdornment"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="clearButton" class="MuiGrid-item MuiGrid-grid-xs-auto utilityarea">
                        <div class="MuiGrid-container">
                            <div class="MuiGrid-item MuiGrid-grid-xs-auto">
                                <button type="button" id="clear-search-term" class="clear-search-term MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall" tabindex="0" type="button" title="Clear your search term" data-testid="primo-search-autocomplete-voice-clear" data-analyticsid="primo-search-autocomplete-voice-clear">
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
                        <button id="search-portal-submit" class="MuiButtonBase-root MuiButton-root MuiButton-contained searchButton MuiButton-containedPrimary MuiButton-containedSizeLarge MuiButton-sizeLarge MuiButton-fullWidth" tabindex="0" type="submit" data-testid="primo-search-submit" data-analyticsid="primo-search-submit" value="Submit" title="Perform your search">
                            <span class="MuiButton-label">
                                <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                                </svg>
                            </span>
                            <span class="MuiTouchRipple-root"></span>
                        </button>
                    </div>
                </div>
                <p class="cultural-advice">
                    <span><a id="cultural-advice-statement-link" href="https://web.library.uq.edu.au/collections/culturally-sensitive-collections">Culturally sensitive collections</a> - </span>
                    Aboriginal and Torres Strait Islander peoples are advised that our collections and sites may contain images, voices or names of persons now deceased. Information may be culturally sensitive for some individuals and communities.
                </p>
                <p class="restrictions-use">
                    <span>
                        <a id="restrictions-on-use-link" href="https://web.library.uq.edu.au/about-us/policies-guidelines#collection-notice">Restrictions on Use</a> - 
                    </span>
                    Your use of Library resources must comply with UQ policies, copyright law, and all resource specific licence terms. The use of AI tools with Library resources is prohibited unless expressly permitted.
                </p>
                <div id="footer-links" class="searchPanel MuiGrid-container MuiFormControlMuiGrid-spacing-xs-2" data-testid="primo-search-links" data-analyticsid="primo-search-links">
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

        this.addListeners();

        const useSearchType = this.getOpeningSearchType();
        this.setSearchTypeButton(useSearchType);

        this.createPortalTypeSelector();

        this.addListeners = this.addListeners.bind(this);
        this.appendFooterLinks = this.appendFooterLinks.bind(this);
        this.createFooterLink = this.createFooterLink.bind(this);
        this.createPortalTypeSelectionEntry = this.createPortalTypeSelectionEntry.bind(this);
        this.createPortalTypeSelector = this.createPortalTypeSelector.bind(this);
        this.getExamPaperSuggestions = this.getExamPaperSuggestions.bind(this);
        this.getLearningResourceSuggestions = this.getLearningResourceSuggestions.bind(this);
        this.getOpeningSearchType = this.getOpeningSearchType.bind(this);
        this.getPrimoSuggestions = this.getPrimoSuggestions.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
        this.loadSuggestionsIntoPage = this.loadSuggestionsIntoPage.bind(this);
        this.isPortalTypeDropDownOpen = this.isPortalTypeDropDownOpen.bind(this);
        this.listenForMouseClicks = this.listenForMouseClicks.bind(this);
        this.sendSubmitToGTM = this.sendSubmitToGTM.bind(this);
        this.setSearchTypeButton = this.setSearchTypeButton.bind(this);
        this.showHidePortalTypeDropdown = this.showHidePortalTypeDropdown.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
    }

    async getPrimoSuggestions(keyword) {
        await new ApiAccess()
            .loadPrimoSuggestions(keyword)
            .then((suggestions) => {
                /* istanbul ignore else */
                this.loadSuggestionsIntoPage(suggestions);
            })
            /* istanbul ignore next */
            .catch((e) => {
                console.log('getPrimoSuggestions, error: ', e);
            });
    }

    async getExamPaperSuggestions(keyword) {
        await new ApiAccess()
            .loadExamPaperSuggestions(keyword)
            .then((suggestions) => {
                /* istanbul ignore else */
                this.loadSuggestionsIntoPage(suggestions, 'courseid');
            })
            /* istanbul ignore next */
            .catch(
                /* istanbul ignore next */ (e) => {
                    console.log('getExamPaperSuggestions, error: ', e);
                },
            );
    }

    /* istanbul ignore next */
    async getLearningResourceSuggestions(keyword) {
        await new ApiAccess()
            .loadHomepageCourseReadingListsSuggestions(keyword)
            .then((suggestions) => {
                this.loadSuggestionsIntoPage(suggestions, 'name');
            })
            /* istanbul ignore next */
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
        const that = this;
        const suggestionListSibling = that.shadowRoot.getElementById('input-field-wrapper');

        // look for clicks outside the page because this dropdown should close when that happens
        document.addEventListener('click', this.listenForMouseClicks);

        /* istanbul ignore else */
        if (!!suggestionListSibling && !!suggestions && suggestions.length > 0) {
            const inputFieldParent = that.shadowRoot.getElementById('inputFieldParent');
            !!inputFieldParent && inputFieldParent.setAttribute('aria-expanded', 'true');

            let ul = that.shadowRoot.getElementById('search-portal-autocomplete-listbox');
            if (!ul) {
                ul = document.createElement('ul');
                !!ul && (ul.className = 'MuiAutocomplete-listbox');
                !!ul && ul.setAttribute('id', 'search-portal-autocomplete-listbox');
                !!ul && ul.setAttribute('data-testid', 'primo-search-autocomplete-listbox');
                !!ul && ul.setAttribute('data-analyticsid', 'primo-search-autocomplete-listbox');
                !!ul && ul.setAttribute('role', 'listbox');
                !!ul && ul.setAttribute('aria-label', 'Suggestions');
            } else {
                // clear pre-existing suggestions
                ul.innerHTML = '';
            }

            const searchType = that.shadowRoot.getElementById('search-type-current-value');
            // searchType.value returns 0,1, ... 8; ie the current dropdown id
            let type =
                !!searchPortalLocale.typeSelect &&
                !!searchPortalLocale.typeSelect.items &&
                searchPortalLocale.typeSelect.items.filter((item, index) => {
                    return item.selectId === searchType.value;
                });
            !!type && type.length > 0 && (type = type.shift());

            // loop through suggestions
            suggestions.forEach((suggestion, index) => {
                const suggestiondisplay = document.createElement('li');

                /* istanbul ignore else */
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
                    !!anchor && anchor.setAttribute('id', `suggestion-link-${index}`);
                    !!anchor && anchor.setAttribute('data-testid', 'primo-search-submit');
                    !!anchor && anchor.setAttribute('data-analyticsid', 'primo-search-submit');
                    !!anchor && anchor.setAttribute('tabindex', '0');
                    !!anchor && anchor.setAttribute('role', 'option');
                    !!anchor && anchor.setAttribute('aria-disabled', 'false');
                    !!anchor && anchor.setAttribute('aria-selected', 'false');
                    !!anchor &&
                        anchor.addEventListener('click', function (e) {
                            that.sendSubmitToGTM(e); // submit the GTM info, then carry on to the normal href navigation
                        });
                    !!anchor &&
                        anchor.addEventListener('keydown', function (e) {
                            const eventTarget =
                                !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];
                            const eventTargetId =
                                !!eventTarget && eventTarget.hasAttribute('id') && eventTarget.getAttribute('id');
                            const keyNumeric = e.charCode || e.keyCode;
                            const keyChar = e.key || e.code;
                            if (isArrowDownKeyPressed(e)) {
                                e.preventDefault();
                                const currentId = eventTargetId.replace('suggestion-link-', '');
                                const nextId = parseInt(currentId, 10) + 1;

                                const nextElement = that.shadowRoot.getElementById(`suggestion-link-${nextId}`);
                                !!nextElement && nextElement.focus();
                            } else if (isArrowUpKeyPressed(e)) {
                                e.preventDefault();
                                const currentId = eventTargetId.replace('suggestion-link-', '');
                                if (currentId === '0') {
                                    const prevElement = that.shadowRoot.getElementById('current-inputfield');
                                    !!prevElement && prevElement.focus();
                                } else {
                                    const prevId = parseInt(currentId, 10) - 1;
                                    const prevElement = that.shadowRoot.getElementById(`suggestion-link-${prevId}`);
                                    !!prevElement && prevElement.focus();
                                }
                            } /* istanbul ignore else */ else if (isEscapeKeyPressed(e)) {
                                const inputField = that.shadowRoot.getElementById('current-inputfield');
                                !!inputField && (inputField.value = '');
                                !!inputField && inputField.focus();
                                that.clearSearchResults();
                            } else if (isReturnKeyPressed(e)) {
                                // dont prevent default
                            } else {
                                e.preventDefault();
                            }
                        });

                    !!suggestion && suggestiondisplay.setAttribute('role', 'presentation');
                    !!suggestion && suggestiondisplay.setAttribute('id', `search-portal-autocomplete-option-${index}`);
                    !!suggestion &&
                        suggestiondisplay.setAttribute('data-testid', `search-portal-autocomplete-option-${index}`);
                    !!suggestion && suggestiondisplay.setAttribute('data-option-index', index);
                    !!suggestion && (suggestiondisplay.className = 'MuiAutocomplete-option');
                    suggestiondisplay.addEventListener('keydown', function (e) {
                        const eventTarget = !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];
                        const eventTargetId =
                            !!eventTarget && eventTarget.hasAttribute('id') && eventTarget.getAttribute('id');
                        if (isTabKeyPressed(e)) {
                            // user has tabbed off end of list - close suggestions dropdown list and focus on next element
                            index === suggestions.length - 1 && that.clearSearchResults();
                            const clearButton = that.shadowRoot.getElementById('clear-search-term');
                            !!clearButton && clearButton.focus();
                        }
                    });

                    !!anchor && suggestiondisplay.appendChild(anchor);

                    ul.appendChild(suggestiondisplay);
                }
            });

            let listContainer = that.shadowRoot.getElementById('suggestion-parent');
            if (!listContainer) {
                listContainer = document.createElement('div');
                !!listContainer && listContainer.setAttribute('id', 'suggestion-parent');
                !!listContainer && listContainer.setAttribute('data-testid', 'search-portal-suggestion-parent');
                !!listContainer &&
                    (listContainer.className =
                        'MuiPaper-root MuiAutocomplete-paper MuiPaper-elevation1 MuiPaper-rounded suggestionList');
            }
            !!listContainer && !!ul && listContainer.appendChild(ul);

            // unclear why the else isnt covered - it is called by test 'the mobile view moves over the results list'
            /* istanbul ignore else */
            if (document.body.clientWidth > 959.95) {
                // set the top left corner & width of the suggestion list to match the placement & width of the input field on desktop size
                // no way to do inline styles with a media query, sadly
                const portalTypeContainer = that.shadowRoot.getElementById('portaltype-dropdown');
                const inputFieldWrapper = that.shadowRoot.getElementById('input-field-wrapper');
                const leftPx = portalTypeContainer.offsetWidth - 170; // this number simply works
                !!portalTypeContainer && !!listContainer && (listContainer.style.left = `${leftPx}px`);
                !!inputFieldWrapper &&
                    !!listContainer &&
                    (listContainer.style.width = `${inputFieldWrapper.offsetWidth}px`);
            }

            // add the suggestion list in between the input field and the clear button, so we can tab to it
            const searchContainer = that.shadowRoot.getElementById('search-parent');
            const clearButton = that.shadowRoot.getElementById('clearButton');
            !!clearButton && !!searchContainer && searchContainer.insertBefore(listContainer, clearButton);
        }
    }

    /**
     * add listeners as required by the page
     */
    addListeners() {
        const that = this;

        function submitHandler() {
            return function (e) {
                /* istanbul ignore else */

                if (!!e) {
                    e.preventDefault();
                }

                // close the dropdown (because the window takes a moment to reload and it just looks weird)
                that.clearSearchResults();

                const formData = !!e && !!e.target && new FormData(e.target);
                const formObject = !!formData && Object.fromEntries(formData);

                /* istanbul ignore else */
                if (!!formObject.currentInputfield) {
                    that.sendSubmitToGTM(e);

                    const matches = searchPortalLocale.typeSelect.items.filter((element) => {
                        return element.selectId === formObject.portaltype;
                    });
                    const searchType = matches.length > 0 ? matches[0] : /* istanbul ignore next */ false;
                    const keyword = encodeURIComponent(formObject.currentInputfield);
                    const link =
                        !!searchType &&
                        !!searchType.link &&
                        searchType.link.replace('[keyword]', keyword).replace('[keyword]', keyword); // database search has two instances of keyword

                    window.location.assign(link);
                }

                return false;
            };
        }

        const theform = that.shadowRoot.getElementById('primo-search-form');
        !!theform && theform.addEventListener('submit', submitHandler());

        const inputField = that.shadowRoot.getElementById('current-inputfield');

        !!inputField &&
            inputField.addEventListener('keydown', function (e) {
                if (isEscapeKeyPressed(e)) {
                    clearSearchTerm();
                    that.clearSearchResults();
                } else if (isArrowDownKeyPressed(e)) {
                    // down arrow pressed when in input field
                    e.preventDefault();
                    const nextElement = that.shadowRoot.getElementById(`suggestion-link-0`);
                    !!nextElement && nextElement.focus();
                }
            });
        !!inputField &&
            inputField.addEventListener('keyup', function (e) {
                that.getSuggestions();
            });
        /* istanbul ignore next */
        !!inputField &&
            inputField.addEventListener('onpaste', function (e) {
                /* istanbul ignore next */
                that.getSuggestions();
            });

        // open and close the dropdown when the search-type button is clicked
        const searchPortalSelector = that.shadowRoot.getElementById('search-portal-type-select');
        !!searchPortalSelector &&
            searchPortalSelector.addEventListener('click', function (e) {
                that.showHidePortalTypeDropdown();
                /* istanbul ignore else */
                if (!!that.isPortalTypeDropDownOpen()) {
                    that.clearSearchResults();
                }
            });

        function clearSearchTerm() {
            const inputField = that.shadowRoot.getElementById('current-inputfield');
            !!inputField && (inputField.value = '');
            !!inputField && inputField.focus();
        }
        const clearButton = that.shadowRoot.getElementById('clear-search-term');
        !!clearButton &&
            clearButton.addEventListener('click', function (e) {
                clearSearchTerm();
                that.clearSearchResults();
            });

        // add click handler to cultural advice link for gtm tracking
        const CaAnchor = this.shadowRoot.getElementById('cultural-advice-statement-link');
        CaAnchor.addEventListener(
            'click',
            /* istanbul ignore next */ function (e) {
                /* istanbul ignore next */
                that.sendSubmitToGTM(e); // submit the GTM info
            },
        );
    }

    /**
     * Events aren't sending properly to GTM, so we force them manually here
     * @param formObject
     */
    sendSubmitToGTM(formObject) {
        window.dataLayer = window.dataLayer || []; // for tests

        let gtmItems;
        const portaltype = this.shadowRoot.getElementById('search-type-current-value').value;
        const userHasSubmittedForm =
            !!formObject &&
            !!formObject.target &&
            !!formObject.target.id &&
            formObject.target.id === 'primo-search-form';
        const userHasClickedCulturalAdviceLink =
            !!formObject &&
            !!formObject.target &&
            !!formObject.target.id &&
            formObject.target.id === 'cultural-advice-statement-link';
        const userHasClickedFooterLink =
            !!formObject &&
            !!formObject.target &&
            !!formObject.target.id &&
            formObject.target.id.startsWith('search-portal-footerlink-');
        if (userHasSubmittedForm) {
            const userSearchTerm = this.shadowRoot.getElementById('current-inputfield').value;
            gtmItems = {
                event: 'gtm.formSubmit',
                'gtm.elementId': 'primo-search-form',
                'gtm.element.elements.primo-search-autocomplete.value': userSearchTerm,
                'gtm.element.elements.primo-search-select-input.value': portaltype,
            };
        } /* istanbul ignore next */ else if (userHasClickedFooterLink || userHasClickedCulturalAdviceLink) {
            // the user has clicked a link that we have attached a click handler to
            const linkLabel = !!formObject && !!formObject.target && formObject.target.innerHTML;
            gtmItems = {
                event: 'gtm.linkClick',
                'gtm.elementId': formObject.target.id,
                'gtm.element': linkLabel,
            };
        } else {
            // the user has clicked on a link in the suggestion dropdown
            const suggestionText = !!formObject && !!formObject.target && formObject.target.innerHTML;
            gtmItems = {
                event: 'gtm.formSubmit',
                'gtm.elementId': 'primo-search-form',
                'gtm.element.elements.primo-search-autocomplete.value': suggestionText,
                'gtm.element.elements.primo-search-select-input.value': portaltype,
            };
        }
        window.dataLayer.push(gtmItems);
    }

    getSuggestions() {
        const that = this;

        // there have been cases where someone has put a book on the corner of a keyboard,
        // which sends thousands of requests to the server - block this
        // length has to be 5, because subjects like FREN1111 have 4 repeating numbers...
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

        const searchType = that.shadowRoot.getElementById('search-type-current-value');

        const inputField = that.shadowRoot.getElementById('current-inputfield');

        if (!!inputField.value && inputField.value.length > 3 && !isRepeatingString(inputField.value)) {
            const PRIMO_SEARCH_TYPES = [
                PRIMO_LIBRARY_SEARCH,
                PRIMO_BOOKS_SEARCH,
                PRIMO_JOURNAL_ARTICLES_SEARCH,
                PRIMO_VIDEO_AUDIO_SEARCH,
                PRIMO_JOURNALS_SEARCH,
                PRIMO_PHYSICAL_ITEMS_SEARCH,
            ];

            if (PRIMO_SEARCH_TYPES.includes(searchType.value)) {
                throttledPrimoLoadSuggestions(inputField.value);
            } else if (searchType.value === EXAM_SEARCH_TYPE) {
                throttledExamLoadSuggestions(inputField.value);
            } else if (searchType.value === COURSE_RESOURCE_SEARCH_TYPE) {
                throttledReadingListLoadSuggestions(inputField.value);
            }
        }
    }

    /**
     * When we have dropdowns we have to listen for clicks on the rest of the page so we close the dropdown when the user "clicks away"
     * We have 2 dropdowns.
     * Complicatedly track whether the click is in one of the dropdowns here
     * @param e
     */
    listenForMouseClicks(e) {
        const that = this;
        const portalTypeDropdown = that.shadowRoot.getElementById('portal-type-selector');

        const eventTarget = !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];
        const eventTargetId = !!eventTarget && eventTarget.hasAttribute('id') && eventTarget.getAttribute('id');

        if (!!eventTarget && eventTarget.classList.contains('search-type-button')) {
            // user has clicked on the closed Search Type selector
            // put focus on the currently selected search type
            const portalTypeContainer = that.shadowRoot.getElementById('portaltype-dropdown');
            let classname = portalTypeContainer.className.match(/label-(.*)/);
            !!classname && classname.length > 0 && (classname = classname[0]);
            let classnameid = !!classname && classname.match('label-(.*)-button');
            !!classnameid && classnameid.length > 1 && (classnameid = classnameid[1]);
            const dropdownId =
                !!classnameid && that.shadowRoot.getElementById(`search-portal-type-select-item-${classnameid}`);
            !!dropdownId && dropdownId.focus();

            return;
        } else if (!!eventTarget && eventTarget.classList.contains('suggestion-link')) {
            // a click on a suggestion dropdown item - clean up, but the click itself is handled as an anchor href
            document.removeEventListener('click', that.listenForMouseClicks);
            return;
        } else if (!!eventTargetId && eventTargetId.startsWith('portalTypeSelectionEntry-')) {
            // user has selected a search type from the open search type dropdown
            // clean up - the click itself is handled elsewhere

            that.closeSearchTypeSelector(portalTypeDropdown, 'portalTypeSelectorDisplayed');

            const inputField = that.shadowRoot.getElementById('current-inputfield');
            !!inputField && inputField.focus();

            that.clearSearchResults();
            that.getSuggestions();

            const searchType = that.shadowRoot.getElementById('search-type-current-value');
            that.rememberSearchTypeChoice(searchType.value);

            return;
        }
        // user has clicked outside the dropdowns - close if open
        !!portalTypeDropdown && that.closeSearchTypeSelector(portalTypeDropdown, 'portalTypeSelectorDisplayed');

        that.clearSearchResults();

        // dropdowns closed so remove listener
        document.removeEventListener('click', that.listenForMouseClicks);
    }

    getOpeningSearchType() {
        if (cookieNotFound(REMEMBER_COOKIE_ID)) {
            return PRIMO_LIBRARY_SEARCH;
        }
        return getCookieValue(REMEMBER_COOKIE_ID);
    }

    rememberSearchTypeChoice(searchType) {
        const numHours = 1;
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + numHours * 60 * 60 * 1000);

        setCookie(REMEMBER_COOKIE_ID, searchType, expiryDate);
    }

    isPortalTypeDropDownOpen() {
        const portalTypeDropdown = this.shadowRoot.getElementById('portal-type-selector');
        return !!portalTypeDropdown && !portalTypeDropdown.classList.contains('hidden');
    }

    showHidePortalTypeDropdown() {
        const portalTypeDropdown = this.shadowRoot.getElementById('portal-type-selector');

        // then display the dropdown
        !!portalTypeDropdown && this.toggleVisibility(portalTypeDropdown, 'portalTypeSelectorDisplayed');

        // if we are showing the dropdown,
        // set the top of the dropdown so the current element matches up with the underlying button
        if (this.isPortalTypeDropDownOpen()) {
            // get the currrently displayed label
            const portalTypeCurrentLabel = this.shadowRoot.getElementById('portaltype-current-label');
            // problem matching the '&amp;" in the video label
            const portalTypeCurrentLabelText =
                !!portalTypeCurrentLabel && portalTypeCurrentLabel.innerHTML.replace('&amp;', '_');
            let matchingID = 0;
            !!searchPortalLocale.typeSelect &&
                !!searchPortalLocale.typeSelect.items &&
                searchPortalLocale.typeSelect.items.forEach((item, index) => {
                    item.name.replace('&', '_') === portalTypeCurrentLabelText && (matchingID = index);
                });

            const offsetPx = 15;
            const negativeHeightOfRowPx = -40;
            const newTopValue = matchingID * negativeHeightOfRowPx - offsetPx;
            !!matchingID && !!portalTypeDropdown && (portalTypeDropdown.style.top = `${newTopValue}px`);

            document.addEventListener('click', this.listenForMouseClicks);
        }
    }

    clearSearchResults() {
        const inputFieldParent = this.shadowRoot.getElementById('inputFieldParent');
        !!inputFieldParent && inputFieldParent.setAttribute('aria-expanded', 'false');

        const searchResults = this.shadowRoot.getElementById('search-portal-autocomplete-listbox');
        !!searchResults && searchResults.remove();
    }

    /**
     * show hide an element
     * if it has `hidden' class, replace it with the supplied class name
     */
    toggleVisibility(selector, displayStyle) {
        const showByClassname = !!selector && selector.className.replace(' hidden', ` ${displayStyle}`);
        const hideByClassname = !!selector && selector.className.replace(` ${displayStyle}`, ' hidden');
        if (!!selector && selector.classList.contains('hidden')) {
            !!showByClassname && (selector.className = showByClassname);
            !!showByClassname && selector.setAttribute('tabindex', '0');
        } else {
            !!hideByClassname && (selector.className = hideByClassname);
            !!showByClassname && selector.setAttribute('tabindex', '-1');
        }
    }

    closeSearchTypeSelector(selector, displayStyle) {
        const hideByClassname = !!selector && selector.className.replace(` ${displayStyle}`, ' hidden');
        !!selector &&
            !selector.classList.contains('hidden') &&
            !!hideByClassname &&
            (selector.className = hideByClassname);
    }

    createPortalTypeSelectionEntry(entry, index) {
        const that = this;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        !!path && (path.id = `portalTypeSelectionEntry-path-${index}`);
        !!path && path.setAttribute('d', entry.iconPath);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        !!svg && (svg.id = `portalTypeSelectionEntry-svg-${index}`);
        !!svg && svg.setAttribute('class', 'MuiSvgIcon-root MuiSvgIcon-colorSecondary');
        !!svg && svg.setAttribute('focusable', 'false');
        !!svg && svg.setAttribute('viewBox', '0 0 24 24');
        !!svg && svg.setAttribute('ariaHidden', 'true');
        !!svg && !!path && svg.appendChild(path);

        const label = document.createElement('span');
        !!label && (label.id = `portalTypeSelectionEntry-${index}`);
        !!label && label.setAttribute('data-testid', `search-type-selection-${index}`);
        label.innerHTML = entry.name;

        const button = document.createElement('button');
        !!button &&
            (button.className = `portalTypeSelectionEntry portalTypeSelectionEntry-${index} MuiButtonBase-root MuiListItem-root MuiMenuItem-root Mui-selected MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button`);
        !!button && button.setAttribute('type', 'button');
        !!button && button.setAttribute('tabindex', '0');
        !!button && button.setAttribute('role', 'option');
        !!button && button.setAttribute('aria-label', `Search in ${entry.name}`);
        !!button && button.setAttribute('id', `search-portal-type-select-item-${index}`);
        !!button && button.setAttribute('data-testid', `primo-search-item-${index}`);
        !!button && button.setAttribute('data-analyticsid', `primo-search-item-${index}`);
        !!button && button.setAttribute('data-primo-search-form', `primo-search-item-${index}`);
        !!button && !!svg && button.appendChild(svg);
        !!button && !!svg && button.appendChild(label);

        function handleSearchTypeSelection() {
            that.setSearchTypeButton(index);
            that.appendFooterLinks(index);
            that.showHidePortalTypeDropdown();
            // We need to clear the search results even if we only swap between primo searches
            // because the link out in the search list will change
            that.clearSearchResults();

            // if search term not blank, reload suggestions
            that.getSuggestions();

            const inputField = that.shadowRoot.getElementById('current-inputfield');
            !!inputField && inputField.value !== '' && that.getSuggestions();
            !!inputField && inputField.focus();
        }

        !!button &&
            button.addEventListener('click', function (e) {
                handleSearchTypeSelection();
            });
        button.addEventListener('keydown', function (e) {
            const eventTarget = !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];
            const eventTargetId = !!eventTarget && eventTarget.hasAttribute('id') && eventTarget.getAttribute('id');
            // Odd. Windows wants search-portal-type-select-item but OSX wants portalTypeSelectionEntry
            const currentIdRaw = eventTargetId.startsWith('portalTypeSelectionEntry-')
                ? /* istanbul ignore next */ eventTargetId.replace('portalTypeSelectionEntry-', '')
                : !!eventTargetId && eventTargetId.replace('search-portal-type-select-item-', '');
            const currentId = !!currentIdRaw && parseInt(currentIdRaw, 10);
            if (isReturnKeyPressed(e)) {
                handleSearchTypeSelection();
                e.preventDefault(); // otherwise form submits
            } else if (isArrowDownKeyPressed(e)) {
                e.preventDefault();
                const nextElement = that.shadowRoot.getElementById(`search-portal-type-select-item-${currentId + 1}`);
                !!nextElement && nextElement.focus();
            } /* istanbul ignore else */ else if (isArrowUpKeyPressed(e)) {
                e.preventDefault();
                /* istanbul ignore else */
                if (currentIdRaw !== '0') {
                    const prevElement = that.shadowRoot.getElementById(
                        `search-portal-type-select-item-${currentId - 1}`,
                    );
                    !!prevElement && prevElement.focus();
                }
            } else if (isTabKeyPressed(e)) {
                const eventTarget = !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];
                const lastId = searchPortalLocale.typeSelect.items.length - 1;
                const finalEntry = `portalTypeSelectionEntry-${lastId}`;
                if (!!eventTarget && eventTarget.classList.contains(finalEntry)) {
                    // user has tabbed off end of list - close search type dropdown list
                    const portalTypeDropdown = that.shadowRoot.getElementById('portal-type-selector');
                    !!portalTypeDropdown &&
                        that.closeSearchTypeSelector(portalTypeDropdown, 'portalTypeSelectorDisplayed');
                }
            }
        });

        return button;
    }

    setSearchTypeButton(searchType) {
        const portalTypeContainer = this.shadowRoot.getElementById('portaltype-dropdown');

        const useSearchType = parseInt(searchType, 10);

        // put the icon on the display
        const portalTypeCurrentIcon = this.shadowRoot.getElementById('portaltype-current-icon');
        !!portalTypeCurrentIcon &&
            !!searchPortalLocale.typeSelect &&
            !!searchPortalLocale.typeSelect.items[useSearchType] &&
            !!searchPortalLocale.typeSelect.items[useSearchType].iconPath &&
            portalTypeCurrentIcon.setAttribute('d', searchPortalLocale.typeSelect.items[useSearchType].iconPath);

        // put the text label on the display
        const portalTypeCurrentLabel = this.shadowRoot.getElementById('portaltype-current-label');
        !!portalTypeCurrentLabel &&
            !!searchPortalLocale.typeSelect &&
            !!searchPortalLocale.typeSelect.items[useSearchType] &&
            !!searchPortalLocale.typeSelect.items[useSearchType].name &&
            (portalTypeCurrentLabel.innerHTML = searchPortalLocale.typeSelect.items[useSearchType].name);

        const portalTypeCurrentSave = this.shadowRoot.getElementById('search-type-current-value');
        !!portalTypeCurrentSave &&
            !!searchPortalLocale.typeSelect &&
            !!searchPortalLocale.typeSelect.items[useSearchType] &&
            !!searchPortalLocale.typeSelect.items[useSearchType].selectId &&
            (portalTypeCurrentSave.value = searchPortalLocale.typeSelect.items[useSearchType].selectId);

        // supply the placeholder text
        const inputField = this.shadowRoot.getElementById('current-inputfield');
        !!inputField &&
            !!searchPortalLocale.typeSelect &&
            !!searchPortalLocale.typeSelect.items[useSearchType] &&
            !!searchPortalLocale.typeSelect.items[useSearchType].placeholder &&
            (inputField.placeholder = searchPortalLocale.typeSelect.items[useSearchType].placeholder);

        // add an extra class to the button to say which label it is currently showing
        // this is used by the css to make the dropdown highlight the matching label
        // remove any previous label - looks like we cant regexp to match a classname, we'll have to loop over the label.items length
        /* istanbul ignore else */
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

        this.appendFooterLinks(useSearchType);
    }

    createPortalTypeSelector(searchType = 0) {
        const useSearchType = parseInt(searchType, 10);

        const portalTypeDropdown = document.createElement('div');
        !!portalTypeDropdown &&
            (portalTypeDropdown.className =
                'MuiList-root MuiMenu-list MuiList-padding MuiPaper-elevation8 portalTypeSelector');
        !!portalTypeDropdown && portalTypeDropdown.setAttribute('role', 'listbox');
        !!portalTypeDropdown && portalTypeDropdown.setAttribute('aria-labelledby', 'search-portal-type-select-label');
        !!portalTypeDropdown && portalTypeDropdown.setAttribute('data-testid', 'search-type-selector');

        !!portalTypeDropdown &&
            !!searchPortalLocale.typeSelect &&
            searchPortalLocale.typeSelect.items.forEach((entry, index) => {
                const container = this.createPortalTypeSelectionEntry(entry, index);
                !!container && portalTypeDropdown.appendChild(container);
            });

        const portalTypeSelectorContainer = document.createElement('div');
        !!portalTypeSelectorContainer && (portalTypeSelectorContainer.id = 'portal-type-selector');
        !!portalTypeSelectorContainer &&
            (portalTypeSelectorContainer.className = `MuiPaper-root MuiMenu-paper MuiPaper-elevation8 MuiPaper-rounded hidden`);
        !!portalTypeSelectorContainer &&
            portalTypeSelectorContainer.setAttribute('data-testid', 'portal-type-selector');
        !!portalTypeSelectorContainer &&
            !!portalTypeDropdown &&
            portalTypeSelectorContainer.appendChild(portalTypeDropdown);
        const portalTypeContainer = this.shadowRoot.getElementById('portaltype-dropdown');
        !!portalTypeContainer &&
            !!portalTypeSelectorContainer &&
            portalTypeContainer.appendChild(portalTypeSelectorContainer);
    }

    createFooterLink(link, index) {
        const that = this;
        const displayLabel = document.createTextNode(link.label);

        const anchor = document.createElement('a');
        !!anchor && (anchor.id = `search-portal-footerlink-${index}`);
        !!anchor && (anchor.href = link.linkto);
        !!anchor && (anchor.rel = 'noreferrer');
        !!anchor && (anchor.ariaLabel = link.label);
        !!anchor && anchor.setAttribute('data-analyticsid', `search-portal-footerlink-${index}`);
        !!anchor &&
            anchor.addEventListener(
                'click',
                /* istanbul ignore next */ function (e) {
                    /* istanbul ignore next */
                    that.sendSubmitToGTM(e); // submit the GTM info, then carry on to the normal href navigation
                },
            );
        anchor.appendChild(displayLabel);

        const container = document.createElement('div');
        !!container && (container.className = 'searchUnderlinks MuiGrid-item MuiGrid-grid-xs-auto');
        !!container && container.setAttribute('data-testid', `primo-search-links-${index}`);
        !!container && !!anchor && container.appendChild(anchor);
        return container;
    }

    appendFooterLinks(searchType) {
        const footerLinkContainer = this.shadowRoot.getElementById('footer-links');
        // clear current footer links
        !!footerLinkContainer && (footerLinkContainer.innerHTML = '');
        // add the footer links for this searchtype
        !!footerLinkContainer &&
            searchPortalLocale.footerLinks.forEach((link, index) => {
                if (link.display.includes(searchType) && link.linkto !== window.location.href) {
                    const container = this.createFooterLink(link, index);
                    !!container && footerLinkContainer.appendChild(container);
                }
            });
    }
}

export default SearchPortal;
