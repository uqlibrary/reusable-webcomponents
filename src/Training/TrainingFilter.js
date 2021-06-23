import styles from './css/main.css';
import overrides from './css/filter.css';
import {
    isArrowDownKeyPressed,
    isArrowUpKeyPressed,
    isBackTabKeyPressed,
    isEscapeKeyPressed,
    isTabKeyPressed,
} from '../helpers/keyDetection';

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <style>${overrides.toString()}</style>
    <section id="training-filter" class="uq-pane" role="search" aria-live="polite">
        <div class="header uq-pane__title" data-testid="training-filter-header">
            <h3 tabindex="0" class="title-text paper-card">Filter events</h3>
        </div>
        <div class="uq-pane__content" data-testid="training-filter-container">
            <div>
                <div class="keywordPlaceholderMovement">
                    <label aria-label="filter by keyword">
                        <input id="inputKeyword" data-testid="training-filter-keyword-entry" class="paper-input" autocomplete="off" placeholder=" " autocapitalize="none" autocorrect="off" aria-describedby="" aria-labelledby="keywordhover" tabindex="0">
                        <span id="keywordhover" data-testid="training-filter-keyword-label">By keyword</span>
                    </label>                        
                    <button class="clearKeyword" id="clearKeyword" data-testid="training-filter-clear-keyword" aria-label="Clear Keyword">
                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                            <g class="iron-icon">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" class="iron-icon"></path>
                            </g>
                        </svg>
                    </button>
                </div>
            </div>
            <div aria-label="filter by campus" id="campusDropdown" data-testid="training-filter-campus-dropdown" aria-disabled="false">
                <button data-testid="training-filter-campus-container" id="campusOpener" class="campus opener filterer" aria-haspopup="listbox" aria-labelledby="campushover">
                    <span class="hidden">By campus</span>
                </button>
                <div id="campushoverblock" class="hoverblock">
                    <div data-testid="training-filter-campus-label" id="campushover" class="campushover hovertext">By campus</div>
                </div>
                <div tabindex="-1" data-testid="training-filter-campus-list" id="campuslist" class="selectorlist campuslist hidden" aria-expanded="false"></div>
            </div>
            <div aria-label="filter by week" id="weekDropdown" data-testid="training-filter-week-dropdown" aria-disabled="false">
                <button data-testid="training-filter-week-container" id="weekOpener" class="week opener filterer" aria-labelledby="weekhover">
                    <span class="hidden">By week</span>
                </button>
                <div id="weekhoverblock" class="hoverblock">
                    <div data-testid="training-filter-week-label" id="weekhover" class="weekhover hovertext">By week</div>
                </div>
                <div tabindex="-1" data-testid="training-filter-week-list" id="weeklist" class="selectorlist weeklist hidden" aria-expanded="false"></div>
            </div>
        </div>
        <div id="quicklinks" class="quicklinks">
            <h4>Popular events:</h4>
        </div>
    </section>
`;

class TrainingFilter extends HTMLElement {
    constructor() {
        super();

        // initialise properties
        this._selectedCampus = '';
        this._selectedWeek = '';
        this._inputKeywordValue = '';

        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));

        this.addListeners(shadowDOM);
        this.loadCampuses(shadowDOM);
        this.loadWeeks(shadowDOM);
        this.loadPopularChips(shadowDOM);

        this.changeHashofUrl(); // clear any bookmarked parameters, so displayed details match the empty filter

        this.addListeners = this.addListeners.bind(this);
        this.changeHashofUrl = this.changeHashofUrl.bind(this);
        this.listenForKeyClicks = this.listenForKeyClicks.bind(this);
        this.listenForMouseClicks = this.listenForMouseClicks.bind(this);
        this.loadCampuses = this.loadCampuses.bind(this);
        this.loadPopularChips = this.loadPopularChips.bind(this);
        this.loadWeeks = this.loadWeeks.bind(this);
        this.shortenDate = this.shortenDate.bind(this);
        this.toggleDropdownVisibility = this.toggleDropdownVisibility.bind(this);
    }

    set selectedCampus(selectedCampus) {
        this._selectedCampus = selectedCampus;
        this.changeHashofUrl();
    }

    set selectedWeek(selectedWeek) {
        this._selectedWeek = selectedWeek;
        this.changeHashofUrl();
    }

    set inputKeywordValue(inputKeyword) {
        this._inputKeywordValue = inputKeyword;
        this.changeHashofUrl();
    }

    static get observedAttributes() {
        return ['campus-list', 'week-start', 'week-end'];
    }

    attributeChangedCallback(name) {
        switch (name) {
            case 'campus-list':
                this.loadCampuses();
                break;
            case 'week-start':
            case 'week-end':
                this.loadWeeks();
                break;
            /* istanbul ignore next */
            default:
                break;
        }
    }

    /**
     * add listeners as required by the page
     */
    addListeners() {
        const that = this;

        const campuslist = that.shadowRoot.getElementById('campuslist');
        const campusDropdown = that.shadowRoot.getElementById('campusDropdown');
        const weeklist = that.shadowRoot.getElementById('weeklist');
        const weekDropdown = that.shadowRoot.getElementById('weekDropdown');

        function toggleCampusSelector(e) {
            const eventTarget = !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];
            // if the other dropdown is still open, close it
            !weeklist.classList.contains('hidden') && that.toggleDropdownVisibility('week');

            that.toggleDropdownVisibility('campus');
        }

        function navigateToFirstCampusEntry() {
            const nextElement = that.shadowRoot.getElementById(`campus-select-0`);
            !!nextElement && nextElement.focus();
        }

        function handleCampusKeyDown(e) {
            const eventTarget = !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];
            const eventTargetId = !!eventTarget && eventTarget.hasAttribute('id') && eventTarget.getAttribute('id');
            if (isArrowDownKeyPressed(e)) {
                e.preventDefault();
                // nav to first campus entry
                navigateToFirstCampusEntry();
            } /* istanbul ignore next */ else if (isBackTabKeyPressed(e)) {
                // not tested - looks like cypress cant do the tab inside shadow dom
                !campuslist.classList.contains('hidden') && that.closeDropdown(campuslist, campusDropdown);
            }
        }

        const campushover = that.shadowRoot.getElementById('campushover'); // for Windows
        !!campushover && campushover.addEventListener('click', toggleCampusSelector);
        !!campushover && campushover.addEventListener('keydown', handleCampusKeyDown);

        !!campuslist && campuslist.addEventListener('keydown', handleCampusKeyDown); // for Windows

        const campusOpener = that.shadowRoot.getElementById('campusOpener'); // for OSX
        !!campusOpener && campusOpener.addEventListener('click', toggleCampusSelector);
        !!campusOpener && campusOpener.addEventListener('keydown', handleCampusKeyDown);

        // allow the user to navigate the campus list with the arrow keys - Nick says its expected
        campusDropdown.addEventListener('keydown', campusDropdownKeyDownListener());

        function campusDropdownKeyDownListener() {
            return function (e) {
                const eventTarget = !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];
                const eventTargetId = !!eventTarget && eventTarget.hasAttribute('id') && eventTarget.getAttribute('id');
                if (isArrowDownKeyPressed(e)) {
                    e.preventDefault();
                    const currentId = eventTargetId.replace('campus-select-', '');
                    const nextId = parseInt(currentId, 10) + 1;

                    const nextElement = that.shadowRoot.getElementById(`campus-select-${nextId}`);
                    !!nextElement && nextElement.focus();
                } else if (isArrowUpKeyPressed(e)) {
                    e.preventDefault();
                    const currentId = eventTargetId.replace('campus-select-', '');
                    const prevId = parseInt(currentId, 10) - 1;
                    const prevElementId =
                        (!!prevId || prevId === 0) && (currentId === '0' ? 'campusOpener' : `campus-select-${prevId}`);
                    const prevElement = !!prevElementId && that.shadowRoot.getElementById(prevElementId);
                    !!prevElement && prevElement.focus();
                } /* istanbul ignore next */ else if (isTabKeyPressed(e)) {
                    // not tested - looks like cypress cant do the tab inside shadow dom
                    // close on tab off last element
                    if (eventTargetId.startsWith('campus-select-')) {
                        const currentId = eventTargetId.replace('campus-select-', '');
                        const nextId = parseInt(currentId, 10) + 1;
                        const nextElement = that.shadowRoot.getElementById(`campus-select-${nextId}`);
                        !nextElement && that.closeDropdown(campuslist, campusDropdown);
                    }
                }
            };
        }

        function toggleWeekSelector() {
            // if the other dropdown is still open, close it
            !campuslist.classList.contains('hidden') && that.toggleDropdownVisibility('campus');

            that.toggleDropdownVisibility('week');
        }

        function navigateToFirstWeekEntry() {
            const nextElement = that.shadowRoot.getElementById(`week-select-0`);
            !!nextElement && nextElement.focus();
        }

        function handleWeekKeyDown(e) {
            if (isArrowDownKeyPressed(e)) {
                e.preventDefault();
                navigateToFirstWeekEntry();
            } /* istanbul ignore next */ else if (isBackTabKeyPressed(e)) {
                // not tested - looks like cypress cant do the tab inside shadow dom
                !weeklist.classList.contains('hidden') && that.closeDropdown(weeklist, weekDropdown);
            }
        }

        const weekhover = that.shadowRoot.getElementById('weekhover');
        !!weekhover && weekhover.addEventListener('click', toggleWeekSelector);
        !!weekhover && weekhover.addEventListener('keydown', handleWeekKeyDown);

        const weekOpener = that.shadowRoot.getElementById('weekOpener');
        !!weekOpener && weekOpener.addEventListener('click', toggleWeekSelector);
        !!weekOpener && weekOpener.addEventListener('keydown', handleWeekKeyDown);

        // allow the user to navigate the week list with the arrow keys - Nick says its expected
        weekDropdown.addEventListener('keydown', function (e) {
            const eventTarget = !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];
            const eventTargetId = !!eventTarget && eventTarget.hasAttribute('id') && eventTarget.getAttribute('id');
            if (isArrowDownKeyPressed(e)) {
                e.preventDefault();
                const currentId = eventTargetId.replace('week-select-', '');
                let nextElement;
                /* istanbul ignore else */
                if (currentId !== 'weekOpener') {
                    const nextId = parseInt(currentId, 10) + 1;
                    nextElement = that.shadowRoot.getElementById(`week-select-${nextId}`);
                }
                !!nextElement && nextElement.focus();
            } else if (isArrowUpKeyPressed(e)) {
                e.preventDefault();
                const currentId = eventTargetId.replace('week-select-', '');
                const prevId = parseInt(currentId, 10) - 1;
                let prevElement;
                if (currentId === '0') {
                    prevElement = that.shadowRoot.getElementById('weekOpener');
                } else {
                    prevElement = that.shadowRoot.getElementById(`week-select-${prevId}`);
                }
                !!prevElement && prevElement.focus();
            } /* istanbul ignore next */ else if (isTabKeyPressed(e)) {
                // not tested - looks like cypress cant do the tab inside shadow dom
                // close on last element
                if (eventTargetId.startsWith('week-select-')) {
                    const currentId = eventTargetId.replace('week-select-', '');
                    const nextId = parseInt(currentId, 10) + 1;
                    const nextElement = that.shadowRoot.getElementById(`week-select-${nextId}`);
                    !nextElement && that.closeDropdown(weeklist, weekDropdown);
                }
            }
        });

        function sendKeywordToGoogleAnalytics(e) {
            /* istanbul ignore else */
            if (that._inputKeywordValue !== '') {
                window.dataLayer = window.dataLayer || []; // for tests
                window.dataLayer.push({
                    event: 'reusable_component_event_click',
                    'gtm.element.elements.training-filter-keyword.value': that._inputKeywordValue,
                });
            }
        }

        function noteKeywordChange(e) {
            if (isEscapeKeyPressed(e)) {
                clearKeyword();
            }
            const inputKeywordField = that.shadowRoot.getElementById('inputKeyword');
            !!inputKeywordField && (that.inputKeywordValue = inputKeywordField.value);
        }

        const inputKeywordField = that.shadowRoot.getElementById('inputKeyword');
        !!inputKeywordField && inputKeywordField.addEventListener('keydown', noteKeywordChange);
        !!inputKeywordField && inputKeywordField.addEventListener('keyup', noteKeywordChange);
        !!inputKeywordField && inputKeywordField.addEventListener('blur', sendKeywordToGoogleAnalytics);

        function clearKeyword() {
            const inputKeywordField = that.shadowRoot.getElementById('inputKeyword');
            !!inputKeywordField && (inputKeywordField.value = '');
            that.inputKeywordValue = '';
        }

        const cancelclick = that.shadowRoot.getElementById('clearKeyword');
        !!cancelclick && cancelclick.addEventListener('click', clearKeyword);
    }

    /**
     * add the list of popular event chips
     */
    loadPopularChips() {
        const that = this;
        const chips = [
            {
                term: 'endnote',
                label: 'EndNote',
            },
            {
                term: 'Excel',
                label: 'Excel',
            },
            {
                term: 'UQRDM',
                label: 'UQRDM',
            },
            {
                term: 'Rstudio',
                label: 'R (language)',
            },
            {
                term: 'Creating a Structured Thesis',
                label: 'Creating a Structure Thesis (CaST)',
            },
        ];

        function setKeyword(searchTerm) {
            const inputKeywordDom = that.shadowRoot.getElementById('inputKeyword');
            !!inputKeywordDom && (inputKeywordDom.value = searchTerm);
            !!inputKeywordDom && inputKeywordDom.focus();
            that.inputKeywordValue = searchTerm;
        }

        const chipDom = that.shadowRoot.getElementById('quicklinks');
        chips.forEach((chip) => {
            const chipButton = document.createElement('button');
            chipButton.className = 'chip uq-button';
            chipButton.innerHTML = chip.label;
            chipButton.setAttribute('data-testid', `training-filter-popular-events-${chip.term}`);
            chipButton.setAttribute('aria-label', `Use ${chip.term} as keyword`);
            !!chipButton &&
                chipButton.addEventListener('click', function () {
                    setKeyword(chip.term);
                });
            !!chipDom && chipDom.appendChild(chipButton);
        });
    }

    /**
     * load the list of weeks into the dropdown, add listeners, etc
     */
    loadWeeks() {
        const that = this;

        const weekStart = this.getAttribute('week-start');
        const weekEnd = this.getAttribute('week-end');
        if (!weekStart || !weekEnd) {
            return;
        }

        function selectWeek(weekName, weekStartDate) {
            const weekHover = that.shadowRoot.getElementById('weekhover');
            /* istanbul ignore else */
            if (!!weekHover && !weekHover.classList.contains('above')) {
                const moveLabel = `${weekHover.className} above`;
                !!moveLabel && (weekHover.className = moveLabel);
            }
            // there is no functionality to clear the selector fields

            // mark as selected so we can move the placeholder label
            const weekDropdown = that.shadowRoot.getElementById('weekDropdown');
            const newClassname = !!weekDropdown && `${weekDropdown.className} selected`;
            !!weekDropdown && (weekDropdown.className = newClassname);

            that.toggleDropdownVisibility('week');
            that.selectedWeek = that.shortenDate(weekStartDate);

            const weekOpenerButton = that.shadowRoot.getElementById('weekOpener');
            !!weekOpenerButton && (weekOpenerButton.innerHTML = weekName);
        }

        const allAvailableEntry = 'All available';

        function addWeekSelectorButton(weekStartDate, weeklistDom, index) {
            let weekName;
            if (weekStartDate === allAvailableEntry) {
                weekName = allAvailableEntry;
            } else {
                const weekStartDisplay = formatDate(weekStartDate);
                let weekEndDate = new Date(weekStartDate);
                weekEndDate.setDate(weekStartDate.getDate() + 6);
                const weekEndDisplay = formatDate(weekEndDate);
                weekName = `${weekStartDisplay} - ${weekEndDisplay} `;
            }

            const weekSelectButton = document.createElement('button');
            weekSelectButton.className = 'week filterer';
            weekSelectButton.setAttribute('id', `week-select-${index}`);
            weekSelectButton.setAttribute('data-testid', `training-filter-select-week-${index}`);
            weekSelectButton.setAttribute('role', 'option');
            const label =
                weekStartDate === allAvailableEntry
                    ? 'Display courses on all days'
                    : `Only display courses between ${weekName}`;
            weekSelectButton.setAttribute('aria-label', label);
            weekSelectButton.innerHTML = weekName;
            !!weekSelectButton &&
                weekSelectButton.addEventListener('click', function () {
                    selectWeek(weekName, weekStartDate);
                });
            !!weeklistDom && weeklistDom.appendChild(weekSelectButton);
        }

        const weekStartProvided = this.getAttribute('week-start') || /* istanbul ignore next */ '';

        const weeklistDom = that.shadowRoot.getElementById('weeklist');
        addWeekSelectorButton(allAvailableEntry, weeklistDom, 0);

        function formatDate(inputDate) {
            const optionDate = { month: 'short', day: 'numeric' };
            return new Intl.DateTimeFormat('en-AU', optionDate).format(inputDate);
        }

        function whileMoreDatesToDisplay(weekStartDate) {
            const weekEndProvided = that.getAttribute('week-end') || /* istanbul ignore next */ '';
            const weekEndDateFinal = new Date(weekEndProvided);
            return weekStartDate <= weekEndDateFinal;
        }

        const weekStartProvidedDate = new Date(weekStartProvided);
        let dayIncrement = 7;
        const numberOfDaysInAWeek = 7;
        // TODO test we do include a week that includes the final date, and we don't include an extra week on the end that has no entries
        let weekStartDate = new Date(weekStartProvided);
        weekStartDate.setDate(weekStartProvidedDate.getDate());
        let index = 1; // 'all' button is '0'
        while (whileMoreDatesToDisplay(weekStartDate)) {
            addWeekSelectorButton(weekStartDate, weeklistDom, index);
            index++;

            weekStartDate = new Date(weekStartProvidedDate);
            weekStartDate.setDate(weekStartProvidedDate.getDate() + dayIncrement);
            dayIncrement += numberOfDaysInAWeek;
        }
    }

    /**
     * load the list of campuses into the dropdown, add listeners, etc
     */
    loadCampuses() {
        const that = this;

        const campuses = this.getAttribute('campus-list');
        if (!campuses) {
            return;
        }

        function selectCampus(campusName, campusCode) {
            const campusHover = that.shadowRoot.getElementById('campushover');
            if (!!campusHover && !campusHover.classList.contains('above')) {
                const moveLabel = `${campusHover.className} above`;
                !!moveLabel && (campusHover.className = moveLabel);
            }
            // there is no requirement to clear the selector fields

            that.toggleDropdownVisibility('campus');

            that.selectedCampus = campusCode;

            const campusOpenerButton = that.shadowRoot.getElementById('campusOpener');
            !!campusOpenerButton && (campusOpenerButton.innerHTML = campusName);
        }

        function addCampusSelectorButton(campusName, campusCode, index) {
            // const campusNameLabel = document.createTextNode(campusName);

            const campusSelectButton = document.createElement('button');
            campusSelectButton.className = 'campus filterer';
            campusSelectButton.innerHTML = campusName;
            campusSelectButton.setAttribute('id', `campus-select-${index}`);
            campusSelectButton.setAttribute('data-testid', `training-filter-campus-select-${index}`);
            campusSelectButton.setAttribute('role', 'option');
            let label;
            switch (campusCode) {
                case 'all':
                    label = 'Display courses at all locations';
                    break;
                case 'Online':
                    label = 'Display only online courses';
                    break;
                default:
                    label = `Only display courses at ${campusName}`;
            }
            campusSelectButton.setAttribute('aria-label', label);
            !!campusSelectButton &&
                campusSelectButton.addEventListener('click', function () {
                    selectCampus(campusName, campusCode);
                });
            !!campuslistDom && campuslistDom.appendChild(campusSelectButton);
        }

        const campusListProvided = this.getAttribute('campus-list') || /* istanbul ignore next */ '';
        const campusList = campusListProvided.split('|');

        const campuslistDom = that.shadowRoot.getElementById('campuslist');
        addCampusSelectorButton('All locations', 'all', 0);

        let index = 1; // 'all' button is '0'
        campusList.forEach((campusCode) => {
            const campusName = decodeURIComponent(campusCode);
            addCampusSelectorButton(campusName, campusCode, index);
            index++;
        });
    }

    /**
     * update the hash of the url with the selected values
     */
    changeHashofUrl() {
        const currentUrl = new URL(document.URL);
        const oldHash = currentUrl.hash;

        // break it up because prettier interacts badly with the longer string
        const keywordhash = `keyword=${this._inputKeywordValue}`;
        const campushash = `campus=${encodeURIComponent(this._selectedCampus)}`;
        const dateHash = `weekstart=${encodeURIComponent(this._selectedWeek)}`;
        const proposedHash = `${keywordhash};${campushash};${dateHash}`;

        const blankHash = 'keyword=;campus=;weekstart=';
        if (`#${proposedHash}` !== oldHash && proposedHash === blankHash) {
            currentUrl.hash = '#';
            document.location.href = currentUrl.href;
        } else if (`#${proposedHash}` !== oldHash) {
            currentUrl.hash = proposedHash;
            document.location.href = currentUrl.href;
        }
    }

    closeDropdown(list, parent) {
        const that = this;
        list.className = `${list.className} hidden`;
        list.removeAttribute('role');
        document.removeEventListener('click', that.listenForMouseClicks);
        document.removeEventListener('keydown', that.listenForKeyClicks);
        list.setAttribute('aria-expanded', 'false');
        list.setAttribute('tabindex', '-1');
        !!parent.classList.contains('listHolder') && parent.classList.toggle('listHolder');
    }

    /**
     * show / hide a dropdown
     */
    toggleDropdownVisibility(dropdownType) {
        const that = this;
        const dropDownList = that.shadowRoot.getElementById(`${dropdownType}list`);
        const dropdownParent = that.shadowRoot.getElementById(`${dropdownType}Dropdown`);

        /* istanbul ignore next */
        if (!dropDownList) {
            return;
        }

        !!isHidden(dropDownList)
            ? openDropdown(dropDownList, dropdownParent)
            : that.closeDropdown(dropDownList, dropdownParent);

        function isHidden(selector) {
            return selector.classList.contains('hidden');
        }

        function openDropdown(list, parent) {
            !parent.classList.contains('listHolder') && parent.classList.toggle('listHolder');
            list.setAttribute('role', 'listbox');
            list.className = list.className.replace(' hidden', '');
            document.addEventListener('click', that.listenForMouseClicks);
            document.addEventListener('keydown', that.listenForKeyClicks);
            list.setAttribute('aria-expanded', 'true');
            list.setAttribute('tabindex', '0');
        }
    }

    listenForKeyClicks(e) {
        const that = this;
        const trainingFilter =
            document
                .querySelector('library-training')
                .shadowRoot.querySelector('training-filter') /* istanbul ignore next */ ||
            document.querySelector('training-filter');
        /* istanbul ignore else */
        if (isEscapeKeyPressed(e)) {
            const campuslist = that.shadowRoot.getElementById('campuslist');
            !!campuslist &&
                !campuslist.classList.contains('hidden') &&
                trainingFilter.toggleDropdownVisibility('campus');
            const weeklist = that.shadowRoot.getElementById('weeklist');
            !!weeklist && !weeklist.classList.contains('hidden') && trainingFilter.toggleDropdownVisibility('week');
        }
    }

    listenForMouseClicks(e) {
        const that = this;
        const eventTarget = !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];

        if (!hasClickedOnDropdown(eventTarget)) {
            const campuslist = that.shadowRoot.getElementById('campuslist');
            !!campuslist && !campuslist.classList.contains('hidden') && that.toggleDropdownVisibility('campus');
            const weeklist = that.shadowRoot.getElementById('weeklist');
            !!weeklist && !weeklist.classList.contains('hidden') && that.toggleDropdownVisibility('week');
        }

        function hasClickedOnDropdown(eventTarget) {
            return (
                !!eventTarget &&
                (eventTarget.classList.contains('opener') ||
                    /* istanbul ignore else */ eventTarget.classList.contains('weekhover') ||
                    /* istanbul ignore else */ eventTarget.classList.contains('campushover'))
            );
        }
    }

    /**
     * change the date provided by the api into YYYYMMDD format for url hash
     */
    shortenDate(weekStartDate) {
        if (weekStartDate === 'All available') {
            return 'all';
        }

        // fr-ca: hack to get dates in YYYY-MM-DD format
        let date = new Intl.DateTimeFormat('fr-ca').format(weekStartDate);
        return encodeURIComponent(date);
    }
}

export default TrainingFilter;
