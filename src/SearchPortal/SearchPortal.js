import styles from './css/main.css';
import overrides from './css/overrides.css';

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <style>${overrides.toString()}</style>
    <div id="root" class="pane pane--outline" role="region" aria-live="polite">
        <div class="MuiPaper-root MuiCard-root libraryCard StandardCard MuiPaper-elevation1 MuiPaper-rounded" data-testid="primo-search" id="primo-search">
    <div class="MuiCardContent-root libraryContent" data-testid="primo-search-content">
        <form id="primo-search-form">
            <div class="searchPanel MuiGrid-container MuiGrid-spacing-xs-1 MuiGrid-align-items-xs-flex-end">
                <div class="MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-auto">
                    <div class="MuiFormControl-root" style="width: 100%;">
                        <label class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiFormLabel-filled" data-shrink="true" id="primo-search-select-label">Search</label>
                        <div class="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl">
                            <div class="MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiInputBase-input MuiInput-input" tabindex="0" role="button" aria-haspopup="listbox" aria-labelledby="primo-search-select-label primo-search-select" id="primo-search-select" data-testid="primo-search-select">
                                <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path>
                                </svg>&nbsp;Library
                            </div>
                            <input type="hidden" id="primo-search-select-input" data-testid="primo-search-select-input" value="0">
                                <svg class="MuiSvgIcon-root MuiSelect-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M7 10l5 5 5-5z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-true">
                        <div class="MuiAutocomplete-root" role="combobox" aria-expanded="false" data-testid="primo-search-autocomplete">
                            <div class="MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth">
                                <div class="MuiInputBase-root MuiInput-root MuiInput-underline MuiAutocomplete-inputRoot MuiInputBase-fullWidth MuiInput-fullWidth MuiInputBase-formControl MuiInput-formControl MuiInputBase-adornedEnd">
                                    <input aria-invalid="false" autocomplete="off" id="primo-search-autocomplete" placeholder="Find books, articles, databases, Library guides &amp; more" type="search" class="MuiInputBase-input MuiInput-input selectInput MuiAutocomplete-input MuiAutocomplete-inputFocused MuiInputBase-inputAdornedEnd MuiInputBase-inputTypeSearch MuiInput-inputTypeSearch" aria-autocomplete="list" autocapitalize="none" spellcheck="false" aria-label="Enter your search terms" data-testid="primo-search-autocomplete-input" value="">
                                        <div class="MuiAutocomplete-endAdornment"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="MuiGrid-item MuiGrid-grid-xs-auto" style="width: 90px; margin-left: -70px; margin-right: -20px; margin-bottom: 6px;">
                            <div class="MuiGrid-container">
                                <div class="MuiGrid-item MuiGrid-grid-xs-auto">
                                    <button class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall" tabindex="0" type="button" title="Use your microphone to search" data-testid="primo-search-autocomplete-voice-record">
                                        <span class="MuiIconButton-label">
                                            <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path>
                                            </svg>
                                        </span>
                                        <span class="MuiTouchRipple-root"></span>
                                    </button>
                                </div>
                                <div class="MuiGrid-item MuiGrid-grid-xs-auto">
                                    <button class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall" tabindex="0" type="button" title="Clear your search term" data-testid="primo-search-autocomplete-voice-clear">
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
                            <button class="MuiButtonBase-root MuiButton-root MuiButton-contained searchButton MuiButton-containedPrimary MuiButton-containedSizeLarge MuiButton-sizeLarge MuiButton-fullWidth" tabindex="0" type="submit" id="primo-search-submit" data-testid="primo-search-submit" value="Submit" title="Perform your search">
                                <span class="MuiButton-label">
                                    <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                                    </svg>
                                </span>
                                <span class="MuiTouchRipple-root"></span>
                            </button>
                        </div>
                    </div>
                    <div class="searchPanel MuiGrid-container MuiFormControlMuiGrid-spacing-xs-2" data-testid="primo-search-links">
                        <div class="searchUnderlinks MuiGrid-item MuiGrid-grid-xs-auto" data-testid="primo-search-links-0">
                            <a href="https://web.library.uq.edu.au/research-tools-techniques/uq-library-search" rel="noreferrer">Search help</a>
                        </div>
                        <div class="searchUnderlinks MuiGrid-item MuiGrid-grid-xs-auto" data-testid="primo-search-links-1">
                            <a href="https://search.library.uq.edu.au/primo-explore/search?vid=61UQ&amp;mode=advanced" rel="noreferrer">Advanced search</a>
                        </div>
                        <div class="searchUnderlinks MuiGrid-item MuiGrid-grid-xs-auto" data-testid="primo-search-links-2">
                            <a href="https://search.library.uq.edu.au/primo-explore/dbsearch?vid=61UQ" rel="noreferrer">Database search</a>
                        </div>
                        <div class="searchUnderlinks MuiGrid-item MuiGrid-grid-xs-auto" data-testid="primo-search-links-5">
                            <a href="https://search.library.uq.edu.au/primo-explore/browse?vid=61UQ" rel="noreferrer">Browse search</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
`;

class SearchPortal extends HTMLElement {
    constructor() {
        super();

        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));

        this.addListeners(shadowDOM);

        this.addListeners = this.addListeners.bind(this);
    }

    /**
     * add listeners as required by the page
     * @param shadowDOM
     */
    addListeners(shadowDOM) {
        const that = this;
    }
}

export default SearchPortal;
