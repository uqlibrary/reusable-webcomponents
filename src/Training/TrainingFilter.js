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
        <div class="header uq-pane__title" data-testid="training-filter-header" data-analyticsid="training-filter-header">
            <h3 tabindex="0" class="title-text paper-card">Filter events</h3>
        </div>
        <div class="uq-pane__content" data-testid="training-filter-container" data-analyticsid="training-filter-container">
            <div class="keywordcontainer">
                <div class="keywordPlaceholderMovement">
                    <label aria-label="filter by keyword">
                        <input type="text" id="inputKeyword" data-testid="training-filter-keyword-entry" data-analyticsid="training-filter-keyword-entry" class="paper-input" autocomplete="off" placeholder=" " autocapitalize="none" autocorrect="off" aria-describedby="" aria-labelledby="keywordhover" tabindex="0">
                        <span id="keywordhover" data-testid="training-filter-keyword-label" data-analyticsid="training-filter-keyword-label" class="filterFieldLabel">By keyword</span>
                    </label>                        
                    <button class="clearKeyword" id="clearKeyword" data-testid="training-filter-clear-keyword" data-analyticsid="training-filter-clear-keyword" aria-label="Clear Keyword">
                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                            <g class="iron-icon">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" class="iron-icon"></path>
                            </g>
                        </svg>
                    </button>
                </div>
            </div>
            <div aria-label="filter by location" id="locationDropdown" data-testid="training-filter-location-dropdown" data-analyticsid="training-filter-campus-dropdown" class="listHolder" aria-disabled="false">
                <button data-testid="training-filter-location-container" data-analyticsid="training-filter-campus-container" id="locationOpener" class="locationDropdownItem opener filterer" aria-haspopup="listbox" aria-labelledby="locationhover">
                    <span class="hidden">By location</span>
                </button>
                <div id="locationhoverblock" class="hoverblock">
                    <div data-testid="training-filter-location-label" data-analyticsid="training-filter-campus-label" id="locationhover" class="locationhover hovertext filterFieldLabel">By location</div>
                </div>
                <div tabindex="-1" data-testid="training-filter-location-list" data-analyticsid="training-filter-campus-list" id="locationlist" class="selectorlist locationlist hidden" aria-expanded="false"></div>
            </div>
            <div aria-label="filter by week" id="weekDropdown" data-testid="training-filter-week-dropdown" data-analyticsid="training-filter-week-dropdown" class="listHolder weekSelector" aria-disabled="false">
                <button data-testid="training-filter-week-container" data-analyticsid="training-filter-week-container" id="weekOpener" class="week opener filterer" aria-labelledby="weekhover">
                    <span class="hidden">By week</span>
                </button>
                <div id="weekhoverblock" class="hoverblock">
                    <div data-testid="training-filter-week-label" data-analyticsid="training-filter-week-label" id="weekhover" class="weekhover hovertext filterFieldLabel">By week</div>
                </div>
                <div tabindex="-1" data-testid="training-filter-week-list" data-analyticsid="training-filter-week-list" id="weeklist" class="selectorlist weeklist hidden" aria-expanded="false"></div>
            </div>
        </div>
        <div id="quicklinks" class="quicklinks" data-testid="filter-quicklinks">
            <h4>Popular events:</h4>
        </div>
    </section>
`;

class TrainingFilter extends HTMLElement {
    constructor() {
        super();

        // initialise properties
        this._selectedLocation = '';
        this._selectedWeek = '';
        this._inputKeywordValue = '';

        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        !!template && !!shadowDOM && shadowDOM.appendChild(template.content.cloneNode(true));

        this.addListeners(shadowDOM);
        this.loadLocations(shadowDOM);
        this.loadWeeks(shadowDOM);
        this.loadPopularChips(shadowDOM);

        this.changeHashofUrl(); // clear any bookmarked parameters, so displayed details match the empty filter

        this.addListeners = this.addListeners.bind(this);
        this.changeHashofUrl = this.changeHashofUrl.bind(this);
        this.listenForKeyClicks = this.listenForKeyClicks.bind(this);
        this.listenForMouseClicks = this.listenForMouseClicks.bind(this);
        this.loadLocations = this.loadLocations.bind(this);
        this.loadPopularChips = this.loadPopularChips.bind(this);
        this.loadWeeks = this.loadWeeks.bind(this);
        this.shortenDate = this.shortenDate.bind(this);
        this.toggleDropdownVisibility = this.toggleDropdownVisibility.bind(this);
    }

    set selectedLocation(selectedLocation) {
        this._selectedLocation = selectedLocation;
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
        return ['location-list', 'week-start', 'week-end'];
    }

    attributeChangedCallback(name) {
        switch (name) {
            case 'location-list':
                this.loadLocations();
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
     * add listeners as required by the page.
     */
    addListeners() {
        const that = this;

        const locationListElement = that.shadowRoot.getElementById('locationlist');
        const locationDropdown = that.shadowRoot.getElementById('locationDropdown');
        const weeklist = that.shadowRoot.getElementById('weeklist');
        const weekDropdown = that.shadowRoot.getElementById('weekDropdown');

        function toggleLocationSelector(e) {
            const eventTarget = !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];
            // if the other dropdown is still open, close it
            !weeklist.classList.contains('hidden') && that.toggleDropdownVisibility('weeklist');

            that.toggleDropdownVisibility('locationlist');
        }

        function navigateToFirstLocationEntry() {
            const nextElement = that.shadowRoot.getElementById(`location-select-0`);
            !!nextElement && nextElement.focus();
        }

        function handleLocationKeyDown(e) {
            if (isArrowDownKeyPressed(e)) {
                e.preventDefault();
                // nav to first location entry
                navigateToFirstLocationEntry();
            } /* istanbul ignore next */ else if (isBackTabKeyPressed(e)) {
                !locationListElement.classList.contains('hidden') && that.closeDropdown(locationListElement);
            }
        }

        const locationhover = that.shadowRoot.getElementById('locationhover'); // for Windows
        !!locationhover && locationhover.addEventListener('click', toggleLocationSelector);
        !!locationhover && locationhover.addEventListener('keydown', handleLocationKeyDown);

        !!locationListElement && locationListElement.addEventListener('keydown', handleLocationKeyDown); // for Windows

        const locationOpener = that.shadowRoot.getElementById('locationOpener'); // for OSX
        !!locationOpener && locationOpener.addEventListener('click', toggleLocationSelector);
        !!locationOpener && locationOpener.addEventListener('keydown', handleLocationKeyDown);

        // allow the user to navigate the location list with the arrow keys - Nick says its expected
        locationDropdown.addEventListener('keydown', locationDropdownKeyDownListener());

        function locationDropdownKeyDownListener() {
            return function (e) {
                const eventTarget = !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];
                const eventTargetId = !!eventTarget && eventTarget.hasAttribute('id') && eventTarget.getAttribute('id');
                if (isArrowDownKeyPressed(e)) {
                    e.preventDefault();
                    const currentId = eventTargetId.replace('location-select-', '');
                    const nextId = parseInt(currentId, 10) + 1;

                    const nextElement = that.shadowRoot.getElementById(`location-select-${nextId}`);
                    !!nextElement && nextElement.focus();
                } else if (isArrowUpKeyPressed(e)) {
                    e.preventDefault();
                    const currentId = eventTargetId.replace('location-select-', '');
                    const prevId = parseInt(currentId, 10) - 1;
                    const prevElementId =
                        (!!prevId || prevId === 0) &&
                        (currentId === '0' ? 'locationOpener' : `location-select-${prevId}`);
                    const prevElement = !!prevElementId && that.shadowRoot.getElementById(prevElementId);
                    !!prevElement && prevElement.focus();
                } /* istanbul ignore next */ else if (isTabKeyPressed(e)) {
                    // close on tab off last element
                    if (eventTargetId.startsWith('location-select-')) {
                        const currentId = eventTargetId.replace('location-select-', '');
                        const nextId = parseInt(currentId, 10) + 1;
                        const nextElement = that.shadowRoot.getElementById(`location-select-${nextId}`);
                        !nextElement && that.closeDropdown(locationListElement);
                    }
                }
            };
        }

        function toggleWeekSelector() {
            // if the other dropdown is still open, close it
            !locationListElement.classList.contains('hidden') && that.toggleDropdownVisibility('locationlist');

            that.toggleDropdownVisibility('weeklist');
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
                !weeklist.classList.contains('hidden') && that.closeDropdown(weeklist);
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
                // close on last element
                if (eventTargetId.startsWith('week-select-')) {
                    const currentId = eventTargetId.replace('week-select-', '');
                    const nextId = parseInt(currentId, 10) + 1;
                    const nextElement = that.shadowRoot.getElementById(`week-select-${nextId}`);
                    !nextElement && that.closeDropdown(weeklist);
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
                term: 'Artificial Intelligence',
                label: 'AI',
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
                label: 'Creating a Structured Thesis (CaST)',
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
            const slug = chip.term.toLowerCase().replace(/ /g, '-');
            chipButton.setAttribute('data-testid', `training-filter-popular-events-${slug}`);
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

            that.toggleDropdownVisibility('weeklist');
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
     * load the list of locations into the dropdown, add listeners, etc
     */
    loadLocations() {
        const that = this;

        const locationsListElement = this.getAttribute('location-list');
        if (!locationsListElement) {
            return;
        }

        function selectLocation(locationName, locationCode) {
            console.log('selectLocation', locationName, locationCode);
            const locationhover = that.shadowRoot.getElementById('locationhover');
            if (!!locationhover && !locationhover.classList.contains('above')) {
                const moveLabel = `${locationhover.className} above`;
                !!moveLabel && (locationhover.className = moveLabel);
            }
            // there is no requirement to clear the selector fields

            that.toggleDropdownVisibility('locationlist');

            that.selectedLocation = locationCode;

            const locationOpenerButton = that.shadowRoot.getElementById('locationOpener');
            !!locationOpenerButton && (locationOpenerButton.innerHTML = locationName);
        }

        function addLocationSelectorButton(locationName, locationCode, index) {
            const locationSelectButton = document.createElement('button');
            locationSelectButton.className = 'locationDropdownItem filterer';
            locationSelectButton.innerHTML = locationName;
            locationSelectButton.setAttribute('id', `location-select-${index}`);
            locationSelectButton.setAttribute('data-testid', `training-filter-location-select-${index}`);
            locationSelectButton.setAttribute('role', 'option');
            let label;
            switch (locationCode) {
                case 'all':
                    label = 'Display courses at all locations';
                    break;
                case 'Online':
                    label = 'Display only online courses';
                    break;
                default:
                    label = `Only display courses at ${locationName}`;
            }
            locationSelectButton.setAttribute('aria-label', label);
            !!locationSelectButton &&
                locationSelectButton.addEventListener('click', function () {
                    selectLocation(locationName, locationCode);
                });
            !!locationListElement && locationListElement.appendChild(locationSelectButton);
        }

        const locationListProvided = this.getAttribute('location-list') || /* istanbul ignore next */ '';
        const locationList = locationListProvided.split('|');

        const locationListElement = that.shadowRoot.getElementById('locationlist');
        addLocationSelectorButton('All locations', 'all', 0);

        let index = 1; // 'all' button is '0'
        !!locationList &&
            locationList.length > 0 &&
            locationList.forEach((locationCode) => {
                const locationName = decodeURIComponent(locationCode);
                addLocationSelectorButton(locationName, locationCode, index);
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
        const locationhash = `location=${encodeURIComponent(this._selectedLocation)}`;
        const dateHash = `weekstart=${encodeURIComponent(this._selectedWeek)}`;
        currentUrl.hash = `${keywordhash};${locationhash};${dateHash}`;

        document.location.href = currentUrl.href;
    }

    closeDropdown(list) {
        const that = this;
        !list.classList.contains('hidden') && list.classList.toggle('hidden');
        list.removeAttribute('role');
        document.removeEventListener('click', that.listenForMouseClicks);
        document.removeEventListener('keydown', that.listenForKeyClicks);
        list.setAttribute('aria-expanded', 'false');
        list.setAttribute('tabindex', '-1');
    }

    /**
     * show / hide a dropdown
     */
    toggleDropdownVisibility(dropdownType) {
        const that = this;
        const dropDownList = that.shadowRoot.getElementById(dropdownType);

        /* istanbul ignore next */
        if (!dropDownList) {
            return;
        }

        !!isHidden(dropDownList) ? openDropdown(dropDownList) : that.closeDropdown(dropDownList);

        function isHidden(selector) {
            return selector.classList.contains('hidden');
        }

        function openDropdown(list) {
            list.setAttribute('role', 'listbox');
            !!list.classList.contains('hidden') && list.classList.toggle('hidden');
            document.addEventListener('click', that.listenForMouseClicks);
            document.addEventListener('keydown', that.listenForKeyClicks);
            list.setAttribute('aria-expanded', 'true');
            list.setAttribute('tabindex', '0');
        }
    }

    listenForKeyClicks(e) {
        const that = this;
        const lt = document.querySelector('library-training');
        const trainingFilter =
            (!!lt && lt.shadowRoot.querySelector('training-filter')) /* istanbul ignore next */ ||
            document.querySelector('training-filter');
        /* istanbul ignore else */
        if (isEscapeKeyPressed(e)) {
            const locationListElement = that.shadowRoot.getElementById('locationlist');
            !!locationListElement &&
                !locationListElement.classList.contains('hidden') &&
                trainingFilter.toggleDropdownVisibility('locationlist');
            const weeklist = that.shadowRoot.getElementById('weeklist');
            !!weeklist && !weeklist.classList.contains('hidden') && trainingFilter.toggleDropdownVisibility('weeklist');
        }
    }

    listenForMouseClicks(e) {
        const that = this;
        const eventTarget = !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];

        if (!hasClickedOnDropdown(eventTarget)) {
            const locationListElement = that.shadowRoot.getElementById('locationlist');
            !!locationListElement &&
                !locationListElement.classList.contains('hidden') &&
                that.toggleDropdownVisibility('locationlist');
            const weeklist = that.shadowRoot.getElementById('weeklist');
            !!weeklist && !weeklist.classList.contains('hidden') && that.toggleDropdownVisibility('weeklist');
        }

        function hasClickedOnDropdown(eventTarget) {
            return (
                !!eventTarget &&
                (eventTarget.classList.contains('opener') ||
                    /* istanbul ignore else */ eventTarget.classList.contains('weekhover') ||
                    /* istanbul ignore else */ eventTarget.classList.contains('locationhover'))
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
