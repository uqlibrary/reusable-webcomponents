import styles from './css/main.css';
import overrides from './css/filter.css';

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
            <span style="display: none" tabindex="-1" id="campus-filter-label">Choose the campus for your course</span>
            <div aria-label="filter by campus" id="campusDropdown" class="listHolder" aria-disabled="false">
                <button data-testid="training-filter-campus-container" id="campusOpener" class="opener filterer" aria-haspopup="listbox" aria-labelledby="campus-filter-label">
                    <span class="hidden">By campus</span>
                </button>
                <div id="hoverblock" class="hoverblock">
                    <div data-testid="training-filter-campus-label" id="campushover" class="campushover hovertext">By campus</div>
                </div>
                <div tabindex="-1" data-testid="training-filter-campus-list" id="campuslist" class="selectorlist campuslist hidden" aria-expanded="false"></div>
            </div>
            <div aria-label="filter by week" id="weekDropdown" class="listHolder" aria-disabled="false">
                <button data-testid="training-filter-week-container" id="weekOpener" class="opener filterer" aria-labelledby="weekhover">
                    <span class="hidden">By week</span>
                </button>
                <div class="hoverblock">
                    <div data-testid="training-filter-week-label" id="weekhover" class="weekhover hovertext">By week</div>
                </div>
                <div data-testid="training-filter-week-list" id="weeklist" class="selectorlist weeklist hidden" aria-expanded="false"></div>
            </div>
        </div>
        <div class="onlineToggle">
            <input type="checkbox" name="onlineonly" id="onlineonly" data-testid="training-filter-onlineonly-checkbox" aria-labelledby="online" />
            <label id="online" class="toggle-label paper-toggle-button">Show only online events</label>
        </div>
        <div id="quicklinks" class="quicklinks">
            <h4>Popular events:</h4>
        </div>
    </section>
`;

function isKeyPressed(e, charKeyInput, numericKeyInput) {
    const keyNumeric = e.charCode || e.keyCode;
    const keyChar = e.key || e.code;
    return keyChar === charKeyInput || keyNumeric === numericKeyInput;
}
function isEscapeKeyPressed(e) {
    return isKeyPressed(e, 'Escape', 27);
}
function isArrowDownKeyPressed(e) {
    return isKeyPressed(e, 'ArrowDown', 40);
}
function isArrowUpKeyPressed(e) {
    return isKeyPressed(e, 'ArrowUp', 38);
}

class TrainingFilter extends HTMLElement {
    constructor() {
        super();

        // initialise properties
        this._selectedCampus = '';
        this._selectedWeek = '';
        this._inputKeywordValue = '';
        this._onlineOnlyProperty = false;

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
        this.toggleVisibility = this.toggleVisibility.bind(this);
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

    set onlineOnlyProperty(onlineonly) {
        this._onlineOnlyProperty = onlineonly;
        this.changeHashofUrl();
    }

    static get observedAttributes() {
        return ['campus-list', 'week-start', 'week-end'];
    }

    attributeChangedCallback(name) {
        switch (name) {
            case 'campus-list':
                this.loadCampuses(this.shadowRoot);
                break;
            case 'week-start':
            case 'week-end':
                this.loadWeeks(this.shadowRoot);
                break;
            /* istanbul ignore next */
            default:
                break;
        }
    }

    /**
     * add listeners as required by the page
     * @param shadowDOM
     */
    addListeners(shadowDOM) {
        const that = this;

        const campuslist = !!shadowDOM && shadowDOM.getElementById('campuslist');
        const weeklist = !!shadowDOM && shadowDOM.getElementById('weeklist');

        function toggleCampusSelector() {
            // if the other dropdown is still open, close it
            !weeklist.classList.contains('hidden') && that.toggleVisibility(weeklist);

            that.toggleVisibility(campuslist);
        }

        const campusOpenerButton = !!shadowDOM && shadowDOM.getElementById('campusOpener');
        !!campusOpenerButton && campusOpenerButton.addEventListener('click', toggleCampusSelector);
        const campushover = !!shadowDOM && shadowDOM.getElementById('campushover');
        !!campushover && campushover.addEventListener('click', toggleCampusSelector);

        const campusOpener = !!shadowDOM && shadowDOM.getElementById('campusOpener');
        campusOpener.addEventListener('keydown', function (e) {
            console.log(
                'isKeyPressed: e.key = ',
                e.key,
                ' | e.code = ',
                e.code,
                ' |  e.charCode = ',
                e.charCode,
                ' | e.keyCode = ',
                e.keyCode,
            );
            if (isArrowDownKeyPressed(e)) {
                const allElement = !!shadowDOM && shadowDOM.getElementById('campus-select-0');
                console.log('put focus on first element');
                !!allElement && allElement.focus();
            }
        });

        // allow the user to navigate the campus list with the arrow keys - Nick says its expected
        const campusDropdown = !!shadowDOM && shadowDOM.getElementById('campusDropdown');
        campusDropdown.addEventListener('keydown', function (e) {
            const eventTarget = !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];
            const eventTargetId = !!eventTarget && eventTarget.hasAttribute('id') && eventTarget.getAttribute('id');
            if (isArrowDownKeyPressed(e)) {
                e.preventDefault();
                const currentId = eventTargetId.replace('campus-select-', '');
                const nextId = parseInt(currentId, 10) + 1;

                const nextElement = !!shadowDOM && shadowDOM.getElementById(`campus-select-${nextId}`);
                !!nextElement && nextElement.focus();
            } else if (isArrowUpKeyPressed(e)) {
                e.preventDefault();
                const currentId = eventTargetId.replace('campus-select-', '');
                const prevId = parseInt(currentId, 10) - 1;
                let prevElement;
                if (currentId === '0') {
                    prevElement = !!shadowDOM && shadowDOM.getElementById('campusOpener');
                } else {
                    prevElement = !!shadowDOM && shadowDOM.getElementById(`campus-select-${prevId}`);
                }
                !!prevElement && prevElement.focus();
            }
        });

        function toggleWeekSelector() {
            // if the other dropdown is still open, close it
            !campuslist.classList.contains('hidden') && that.toggleVisibility(campuslist);

            that.toggleVisibility(weeklist);
        }

        const weekOpenerButton = !!shadowDOM && shadowDOM.getElementById('weekOpener');
        !!weekOpenerButton && weekOpenerButton.addEventListener('click', toggleWeekSelector);
        const weekhover = !!shadowDOM && shadowDOM.getElementById('weekhover');
        !!weekhover && weekhover.addEventListener('click', toggleWeekSelector);

        const weekOpener = !!shadowDOM && shadowDOM.getElementById('weekOpener');
        weekOpener.addEventListener('keydown', function (e) {
            if (isArrowDownKeyPressed(e)) {
                const allElement = !!shadowDOM && shadowDOM.getElementById('week-select-0');
                !!allElement && allElement.focus();
            }
        });

        // allow the user to navigate the week list with the arrow keys - Nick says its expected
        const weekDropdown = !!shadowDOM && shadowDOM.getElementById('weekDropdown');
        weekDropdown.addEventListener('keydown', function (e) {
            const eventTarget = !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];
            const eventTargetId = !!eventTarget && eventTarget.hasAttribute('id') && eventTarget.getAttribute('id');
            if (isArrowDownKeyPressed(e)) {
                e.preventDefault();
                const currentId = eventTargetId.replace('week-select-', '');
                const nextId = parseInt(currentId, 10) + 1;

                const nextElement = !!shadowDOM && shadowDOM.getElementById(`week-select-${nextId}`);
                !!nextElement && nextElement.focus();
            } else if (isArrowUpKeyPressed(e)) {
                e.preventDefault();
                const currentId = eventTargetId.replace('week-select-', '');
                const prevId = parseInt(currentId, 10) - 1;
                let prevElement;
                if (currentId === '0') {
                    prevElement = !!shadowDOM && shadowDOM.getElementById('weekOpener');
                } else {
                    prevElement = !!shadowDOM && shadowDOM.getElementById(`week-select-${prevId}`);
                }
                !!prevElement && prevElement.focus();
            }
        });

        function sendKeywordToGoogleAnalytics(e) {
            if (that._inputKeywordValue !== '') {
                window.dataLayer = window.dataLayer || []; // for tests
                window.dataLayer.push({
                    'gtm.element.elements.training-filter-keyword.value': that._inputKeywordValue,
                });
            }
        }

        function noteKeywordChange() {
            const inputKeywordField = !!shadowDOM && shadowDOM.getElementById('inputKeyword');
            !!inputKeywordField && (that.inputKeywordValue = inputKeywordField.value);
        }

        const inputKeywordField = !!shadowDOM && shadowDOM.getElementById('inputKeyword');
        !!inputKeywordField && inputKeywordField.addEventListener('keydown', noteKeywordChange);
        !!inputKeywordField && inputKeywordField.addEventListener('keyup', noteKeywordChange);
        !!inputKeywordField && inputKeywordField.addEventListener('blur', sendKeywordToGoogleAnalytics);

        // may need more listeners for mobile, etc?

        function noteCheckboxSet() {
            that.onlineOnlyProperty = !!this.checked;
        }

        const onlineonlyField = !!shadowDOM && shadowDOM.getElementById('onlineonly');
        !!onlineonlyField && onlineonlyField.addEventListener('change', noteCheckboxSet);

        function clearKeyword() {
            const inputKeywordField = !!shadowDOM && shadowDOM.getElementById('inputKeyword');
            !!inputKeywordField && (inputKeywordField.value = '');
            that.inputKeywordValue = '';
        }

        const cancelclick = !!shadowDOM && shadowDOM.getElementById('clearKeyword');
        !!cancelclick && cancelclick.addEventListener('click', clearKeyword);
    }

    /**
     * add the list of popular event chips
     * @param shadowDOM
     */
    loadPopularChips(shadowDOM) {
        console.log('loadPopularChips');
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
            const inputKeywordDom = shadowDOM.getElementById('inputKeyword');
            !!inputKeywordDom && (inputKeywordDom.value = searchTerm);
            !!inputKeywordDom && inputKeywordDom.focus();
            that.inputKeywordValue = searchTerm;
        }

        const chipDom = shadowDOM.getElementById('quicklinks');
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
     * @param shadowDOM
     */
    loadWeeks(shadowDOM) {
        const that = this;

        const weekStart = this.getAttribute('week-start');
        const weekEnd = this.getAttribute('week-end');
        if (!weekStart || !weekEnd) {
            return;
        }

        function selectWeek(weekName, weekStartDate) {
            console.log('clicked selectWeek for ', weekName);

            const weekHover = !!shadowDOM && shadowDOM.getElementById('weekhover');
            /* istanbul ignore else */
            if (!!weekHover && !weekHover.classList.contains('above')) {
                const moveLabel = `${weekHover.className} above`;
                !!moveLabel && (weekHover.className = moveLabel);
            }
            // there is no functionality to clear the selector fields

            // mark as selected so we can move the placeholder label
            const weekDropdown = !!shadowDOM && shadowDOM.getElementById('weekDropdown');
            const newClassname = !!weekDropdown && `${weekDropdown.className} selected`;
            !!weekDropdown && (weekDropdown.className = newClassname);

            const weeklist = !!shadowDOM && shadowDOM.getElementById('weeklist');
            that.toggleVisibility(weeklist);
            that.selectedWeek = that.shortenDate(weekStartDate);

            const weekOpenerButton = !!shadowDOM && shadowDOM.getElementById('weekOpener');
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
            weekSelectButton.setAttribute('role', 'option');
            const label =
                weekStartDate === allAvailableEntry
                    ? 'Display courses on all days'
                    : `Only display courses between ${weekName}`;
            weekSelectButton.setAttribute('aria-label', label);
            const weekSelectButtonDataTestId = weekName.replaceAll(' ', '').toLowerCase();
            const weekSelectButtonDataTestLabel = `training-filter-select-week-${weekSelectButtonDataTestId}`;
            weekSelectButton.setAttribute('data-testid', weekSelectButtonDataTestLabel);
            weekSelectButton.innerHTML = weekName;
            !!weekSelectButton &&
                weekSelectButton.addEventListener('click', function () {
                    selectWeek(weekName, weekStartDate);
                });
            !!weeklistDom && weeklistDom.appendChild(weekSelectButton);
        }

        const weekStartProvided = this.getAttribute('week-start') || /* istanbul ignore next */ '';

        const weeklistDom = shadowDOM.getElementById('weeklist');
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
     * @param shadowDOM
     */
    loadCampuses(shadowDOM) {
        const that = this;

        const campuses = this.getAttribute('campus-list');
        if (!campuses) {
            return;
        }

        function selectCampus(campusName, campusCode) {
            console.log('clicked selectCampus for ', campusName);

            const campusHover = !!shadowDOM && shadowDOM.getElementById('campushover');
            if (!!campusHover && !campusHover.classList.contains('above')) {
                const moveLabel = `${campusHover.className} above`;
                !!moveLabel && (campusHover.className = moveLabel);
            }
            // there is no requirement to clear the selector fields

            // mark as selected so we can move the placeholder label
            // const campusDropdown = !!shadowDOM && shadowDOM.getElementById('campusDropdown');
            // const newClassname = !!campusDropdown && `${campusDropdown.className} selected`;
            // !!campusDropdown && (campusDropdown.className = newClassname);

            const campuslist = !!shadowDOM && shadowDOM.getElementById('campuslist');
            that.toggleVisibility(campuslist);

            that.selectedCampus = campusCode;

            const campusOpenerButton = !!shadowDOM && shadowDOM.getElementById('campusOpener');
            !!campusOpenerButton && (campusOpenerButton.innerHTML = campusName);
        }

        function addCampusSelectorButton(campusName, campusCode, index) {
            // const campusNameLabel = document.createTextNode(campusName);

            const campusSelectButton = document.createElement('button');
            campusSelectButton.className = 'campus filterer';
            campusSelectButton.innerHTML = campusName;
            campusSelectButton.setAttribute('id', `campus-select-${index}`);
            campusSelectButton.setAttribute('role', 'option');
            let label;
            console.log('campusCode = ', campusCode);
            switch (campusCode) {
                case 'all':
                    label = 'Display courses at all locations, and online';
                    break;
                case 'Online':
                    label = 'Display only online courses';
                    break;
                default:
                    label = `Only display courses at ${campusName}`;
            }
            console.log('label = ', label);
            campusSelectButton.setAttribute('aria-label', label);
            const campusSelectButtonDataTestId = campusName.replaceAll(' ', '');
            const campusSelectButtonDataTestLabel = `training-filter-select-campus-${campusSelectButtonDataTestId}`;
            campusSelectButton.setAttribute('data-testid', campusSelectButtonDataTestLabel);
            !!campusSelectButton &&
                campusSelectButton.addEventListener('click', function () {
                    selectCampus(campusName, campusCode);
                });
            !!campuslistDom && campuslistDom.appendChild(campusSelectButton);
        }

        const campusListProvided = this.getAttribute('campus-list') || /* istanbul ignore next */ '';
        const campusList = campusListProvided.split('|');

        const campuslistDom = !!shadowDOM && shadowDOM.getElementById('campuslist');
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
        const onlineHash = `online=${this._onlineOnlyProperty}`;
        const proposedHash = `${keywordhash};${campushash};${dateHash};${onlineHash}`;

        const blankHash = 'keyword=;campus=;weekstart=;online=false';
        if (`#${proposedHash}` !== oldHash && proposedHash === blankHash) {
            currentUrl.hash = '#';
            document.location.href = currentUrl.href;
        } else if (`#${proposedHash}` !== oldHash) {
            currentUrl.hash = proposedHash;
            document.location.href = currentUrl.href;
        }
    }

    /**
     * show hide an element
     */
    toggleVisibility(selector) {
        const that = this;
        if (!selector) {
            return;
        }

        !!isHidden(selector) ? show(selector) : hide(selector);

        function isHidden(selector) {
            return selector.classList.contains('hidden');
        }

        function show(selector) {
            selector.setAttribute('role', 'listbox');
            selector.className = selector.className.replace(' hidden', '');
            document.addEventListener('click', that.listenForMouseClicks);
            document.addEventListener('keydown', that.listenForKeyClicks);
            selector.setAttribute('aria-expanded', 'true');
            selector.setAttribute('tabindex', '0');
        }

        function hide(selector) {
            selector.className = `${selector.className} hidden`;
            selector.removeAttribute('role');
            document.removeEventListener('click', that.listenForMouseClicks);
            document.removeEventListener('keydown', that.listenForKeyClicks);
            selector.setAttribute('aria-expanded', 'false');
            selector.setAttribute('tabindex', '-1');
        }
    }

    listenForKeyClicks(e) {
        const that = this;
        const trainingFilter =
            document.querySelector('library-training').shadowRoot.querySelector('training-filter') ||
            document.querySelector('training-filter');
        const shadowDOM = !!trainingFilter && trainingFilter.shadowRoot;
        if (isEscapeKeyPressed(e)) {
            const campuslist = !!shadowDOM && shadowDOM.getElementById('campuslist');
            !!campuslist && !campuslist.classList.contains('hidden') && trainingFilter.toggleVisibility(campuslist);
            const weeklist = !!shadowDOM && shadowDOM.getElementById('weeklist');
            !!weeklist && !weeklist.classList.contains('hidden') && trainingFilter.toggleVisibility(weeklist);
        }
    }

    listenForMouseClicks(e) {
        const that = this;
        const eventTarget = !!e.composedPath() && e.composedPath().length > 0 && e.composedPath()[0];

        if (!hasClickedOnDropdown(eventTarget)) {
            const campuslist = that.shadowRoot.getElementById('campuslist');
            !!campuslist && !campuslist.classList.contains('hidden') && that.toggleVisibility(campuslist);
            const weeklist = that.shadowRoot.getElementById('weeklist');
            !!weeklist && !weeklist.classList.contains('hidden') && that.toggleVisibility(weeklist);
        }

        function hasClickedOnDropdown(eventTarget) {
            return (
                !!eventTarget &&
                (eventTarget.classList.contains('opener') ||
                    eventTarget.classList.contains('weekhover') ||
                    eventTarget.classList.contains('campushover'))
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
