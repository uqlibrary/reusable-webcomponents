import styles from './css/main.css';
import overrides from './css/filter.css';

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <style>${overrides.toString()}</style>
    <section id="training-filter" class="uq-pane" role="search" aria-live="polite">
        <div class="header uq-pane__title" data-testid="training-filter-header">
            <h3 class="title-text paper-card">Filter events</h3>
        </div>
        <div class="uq-pane__content" data-testid="dropdown-container">
            <div aria-label="filter by keyword" tabindex="0" aria-disabled="false">
                <div class="keywordPlaceholderMovement">
                    <label>
                        <input id="inputKeyword" data-testid="inputKeyword" class="paper-input" autocomplete="off" placeholder=" " autocapitalize="none" autocorrect="off" aria-describedby="" aria-labelledby="keywordhover" tabindex="0">
                        <span id="keywordhover" data-testid="keywordhover">By keyword</span>
                    </label>                        
                    <button class="clearKeyword" id="clearKeyword" data-testid="clearKeyword" aria-label="Clear Keyword">
                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                            <g class="iron-icon">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" class="iron-icon"></path>
                            </g>
                        </svg>
                    </button>
                </div>
            </div>
            <div aria-label="filter by campus" id="campusDropdown" class="listHolder" aria-haspopup="true" aria-disabled="false">
                <button data-testid="campusOpener" id="campusOpener" class="opener filterer" aria-labelledby="campushover">
                    <span class="hidden">By campus</span>
                </button>
                <div class="hoverblock">
                    <div data-testid="campushover" id="campushover" class="campushover hovertext">By campus</div>
                </div>
                <div data-testid="campuslist" id="campuslist" class="selectorlist campuslist hidden"></div>
            </div>
            <div aria-label="filter by week" id="weekDropdown" class="listHolder" aria-haspopup="true" aria-disabled="false">
                <button data-testid="weekOpener" id="weekOpener" class="opener filterer" aria-labelledby="weekhover">
                    <span class="hidden">By week</span>
                </button>
                <div class="hoverblock">
                    <div data-testid="weekhover" aria-label="weekhover" id="weekhover" class="weekhover hovertext">By week</div>
                </div>
                <div data-testid="weeklist"  id="weeklist" class="selectorlist weeklist hidden"></div>
            </div>
        </div>
        <div class="onlineToggle">
            <input type="checkbox" name="onlineonly" id="onlineonly" data-testid="onlineonly" aria-labelledby="online" />
            <label id="online" class="toggle-label paper-toggle-button">Show only online events</label>
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
        this.loadCampuses = this.loadCampuses.bind(this);
        this.loadPopularChips = this.loadPopularChips.bind(this);
        this.loadWeeks = this.loadWeeks.bind(this);
        this.shortenDate = this.shortenDate.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
    }

    set selectedCampus(selectedCampus) {
        // do things to make a change available to other components
        this._selectedCampus = selectedCampus;
        this.changeHashofUrl();
    }

    set selectedWeek(selectedWeek) {
        // do things to make a change available to other components
        this._selectedWeek = selectedWeek;
        this.changeHashofUrl();
    }

    set inputKeywordValue(inputKeyword) {
        // do things to make a change available to other components
        this._inputKeywordValue = inputKeyword;
        this.changeHashofUrl();
    }

    set onlineOnlyProperty(onlineonly) {
        // do things to make a change available to other components
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

        // close the dropdown when the user clicks anywhere
        // doesnt work atm - root close fires after button opens, auto closing it :(
        // function closeSelectors() {
        //     console.log('close closeSelectors');
        //     !campuslist.classList.contains('hidden') && that.toggleVisibility(campuslist);
        //     !weeklist.classList.contains('hidden') && that.toggleVisibility(weeklist);
        // }
        // const root = !!shadowDOM && shadowDOM.getElementById('root');
        // !!root && root.addEventListener('click', closeSelectors);
        // const body = document.querySelector('body');
        // !!body && body.addEventListener('click', closeSelectors);

        function toggleCampusSelector() {
            // if the other dropdown is still open, close it
            !weeklist.classList.contains('hidden') && that.toggleVisibility(weeklist);

            that.toggleVisibility(campuslist);
        }
        const campusOpenerButton = !!shadowDOM && shadowDOM.getElementById('campusOpener');
        !!campusOpenerButton && campusOpenerButton.addEventListener('click', toggleCampusSelector);
        const campushover = !!shadowDOM && shadowDOM.getElementById('campushover');
        !!campushover && campushover.addEventListener('click', toggleCampusSelector);

        function toggleWeekSelector() {
            // if the other dropdown is still open, close it
            !campuslist.classList.contains('hidden') && that.toggleVisibility(campuslist);

            that.toggleVisibility(weeklist);
        }
        const weekOpenerButton = !!shadowDOM && shadowDOM.getElementById('weekOpener');
        !!weekOpenerButton && weekOpenerButton.addEventListener('click', toggleWeekSelector);
        const weekhover = !!shadowDOM && shadowDOM.getElementById('weekhover');
        !!weekhover && weekhover.addEventListener('click', toggleWeekSelector);

        function noteKeywordChange() {
            const inputKeywordField = !!shadowDOM && shadowDOM.getElementById('inputKeyword');
            !!inputKeywordField && (that.inputKeywordValue = inputKeywordField.value);
        }
        const inputKeywordField = !!shadowDOM && shadowDOM.getElementById('inputKeyword');
        !!inputKeywordField && inputKeywordField.addEventListener('change', noteKeywordChange);
        !!inputKeywordField && inputKeywordField.addEventListener('keydown', noteKeywordChange);
        !!inputKeywordField && inputKeywordField.addEventListener('keyup', noteKeywordChange);
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
            chipButton.setAttribute('data-testid', chip.term);
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

        function addWeekSelectorButton(weekStartDate, weeklistDom) {
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
            weekSelectButton.setAttribute('role', 'option');
            weekSelectButton.setAttribute('data-testid', weekName.replaceAll(' ', '').toLowerCase());
            weekSelectButton.innerHTML = weekName;
            !!weekSelectButton &&
                weekSelectButton.addEventListener('click', function () {
                    selectWeek(weekName, weekStartDate);
                });
            !!weeklistDom && weeklistDom.appendChild(weekSelectButton);
        }

        const weekStartProvided = this.getAttribute('week-start') || /* istanbul ignore next */ '';

        const weeklistDom = shadowDOM.getElementById('weeklist');
        addWeekSelectorButton('All available', weeklistDom);

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
        while (whileMoreDatesToDisplay(weekStartDate)) {
            addWeekSelectorButton(weekStartDate, weeklistDom);

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

        function addCampusSelectorButton(campusName, campusCode) {
            // const campusNameLabel = document.createTextNode(campusName);

            const campusSelectButton = document.createElement('button');
            campusSelectButton.className = 'campus filterer';
            campusSelectButton.innerHTML = campusName;
            campusSelectButton.setAttribute('role', 'option');
            campusSelectButton.setAttribute('data-testid', campusName.replaceAll(' ', ''));
            !!campusSelectButton &&
                campusSelectButton.addEventListener('click', function () {
                    selectCampus(campusName, campusCode);
                });
            !!campuslistDom && campuslistDom.appendChild(campusSelectButton);
        }

        const campusListProvided = this.getAttribute('campus-list') || /* istanbul ignore next */ '';
        const campusList = campusListProvided.split('|');

        const campuslistDom = shadowDOM.getElementById('campuslist');
        addCampusSelectorButton('All locations', 'all', campuslistDom);

        campusList.forEach((campusCode) => {
            const campusName = decodeURIComponent(campusCode);
            addCampusSelectorButton(campusName, campusCode);
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
        const showByClassname = !!selector && selector.className.replace(' hidden', '');
        const hideByClassname = !!selector && `${selector.className} hidden`;
        if (!!selector && selector.classList.contains('hidden')) {
            !!selector && selector.setAttribute('role', 'listbox');
            !!showByClassname && (selector.className = showByClassname);
        } else {
            !!hideByClassname && (selector.className = hideByClassname);
            !!selector && selector.removeAttribute('role');
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
