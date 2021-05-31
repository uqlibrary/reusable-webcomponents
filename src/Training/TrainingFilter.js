import styles from './css/main.css';
import overrides from './css/filter.css';
import { authLocale } from '../UtilityArea/auth.locale';

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <style>${overrides.toString()}</style>
    <div id="root" class="pane pane--outline">
        <div class="header uq-pane__title" data-testid="training-filter-header">
            <div class="title-text paper-card">Filter events</div>
        </div>
            <div class="card-content" data-testid="dropdown-container">
                <div aria-label="filter by keyword" class="paper-input-0" tabindex="0" aria-disabled="false">
                    <div class="keywordPlaceholderMovement">
                        <label>
                            <input id="inputKeyword" data-testid="inputKeyword" class="paper-input" autocomplete="off" placeholder=" " autocapitalize="none" autocorrect="off" aria-describedby="" aria-labelledby="keywordhover" tabindex="0">
                            <span data-testid="keywordhover">By keyword</span>
                        </label>                        
                        <button class="clearKeyword" id="clearKeyword">
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                                <g class="iron-icon">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" class="iron-icon"></path>
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>
                <div aria-label="filter by campus" id="campusDropdown" class="listHolder paper-dropdown-menu-0" role="combobox" aria-autocomplete="none" aria-haspopup="true" aria-disabled="false">
                    <button data-testid="campusOpener" id="campusOpener" class="opener filterer" aria-labelledby="campushover"></button>
                    <div aria-label="campushover" data-testid="campushover" id="campushover" class="hovertext campushover">By campus</div>
                    <div data-testid="campuslist" id="campuslist" class="selectorlist campuslist hidden"></div>
                </div>
                <div aria-label="filter by week" id="weekDropdown" class="listHolder paper-dropdown-menu-0" role="combobox" aria-autocomplete="none" aria-haspopup="true" aria-disabled="false">
                    <button data-testid="weekOpener" id="weekOpener" class="opener filterer" aria-labelledby="weekhover"></button>
                    <div data-testid="weekhover" aria-label="weekhover" id="weekhover" class="hovertext weekhover">By week</div>
                    <div data-testid="weeklist"  id="weeklist" class="selectorlist weeklist hidden"></div>
                </div>
            </div>
            <div class="onlineToggle">
                <input type="checkbox" name="onlineonly" id="onlineonly" />
                <label class="toggle-label paper-toggle-button">Show only online events</label>
            </div>
            <div id="quicklinks" class="quicklinks">
                <h4>Popular events:</h4>
            </div>
        </div>
    </div>
`;

let initCalled;

class TrainingFilter extends HTMLElement {
    constructor() {
        super();

        // initialise properties
        this.selectedCampus = '';
        this.selectedWeek = '';
        this.inputKeywordValue = '';
        this.onlineOnlyProperty = false;

        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));

        this.addListeners(shadowDOM);
        this.loadCampuses(shadowDOM);
        this.loadWeeks(shadowDOM);
        this.loadPopularChips(shadowDOM);

        this.addListeners = this.addListeners.bind(this);
        this.loadCampuses = this.loadCampuses.bind(this);
        this.loadPopularChips = this.loadPopularChips.bind(this);
        this.loadWeeks = this.loadWeeks.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
    }

    set selectedCampus(selectedCampus) {
        // do things to make a change available to other components
        console.log(
            'selectedCampus has been set to ',
            selectedCampus,
            ' now do something clever to pass it back to the parent',
        );
    }

    set selectedWeek(selectedWeek) {
        // do things to make a change available to other components
        console.log(
            'selectedWeek has been set to ',
            selectedWeek,
            ' now do something clever to pass it back to the parent',
        );
    }

    set inputKeywordValue(inputKeyword) {
        // do things to make a change available to other components
        console.log(
            'inputKeyword has been set to ',
            inputKeyword,
            ' now do something clever to pass it back to the parent',
        );
    }

    set onlineOnlyProperty(onlineonly) {
        // do things to make a change available to other components
        console.log(
            'onlineOnlyProperty has been set to ',
            onlineonly,
            ' now do something clever to pass it back to the parent',
        );
    }

    addListeners(shadowDOM) {
        const that = this;

        const campuslist = !!shadowDOM && shadowDOM.getElementById('campuslist');
        const weeklist = !!shadowDOM && shadowDOM.getElementById('weeklist');

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
            !weeklist.classList.contains('hidden') && that.toggleVisibility(weeklist);
            that.toggleVisibility(campuslist);
        }
        const campusOpenerButton = !!shadowDOM && shadowDOM.getElementById('campusOpener');
        !!campusOpenerButton && campusOpenerButton.addEventListener('click', toggleCampusSelector);
        const campushover = !!shadowDOM && shadowDOM.getElementById('campushover');
        !!campushover && campushover.addEventListener('click', toggleCampusSelector);

        function toggleWeekSelector() {
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

            const keywordhover = !!shadowDOM && shadowDOM.getElementById('keywordhover');
            !!keywordhover && (keywordhover.innerHTML = 'By keyword');
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
                term: 'Creating a Structured Thesis',
                label: 'Creating a Structure Thesis (CaST)',
            },
            {
                term: 'Rstudio',
                label: 'R (language)',
            },
        ];
        function setKeyword(searchTerm) {
            console.log('setKeyword ', searchTerm);
            const inputKeywordDom = shadowDOM.getElementById('inputKeyword');
            console.log('inputKeywordDom = ', inputKeywordDom);
            !!inputKeywordDom && (inputKeywordDom.value = searchTerm);
            that.inputKeywordValue = searchTerm;
        }

        const chipDom = shadowDOM.getElementById('quicklinks');
        chips.forEach((chip) => {
            const chipButton = document.createElement('button');
            chipButton.className = 'chip uq-button';
            chipButton.innerHTML = chip.label;
            !!chipButton &&
                chipButton.addEventListener('click', function () {
                    setKeyword(chip.term);
                });
            !!chipDom && chipDom.appendChild(chipButton);
        });
    }

    toggleVisibility(selector) {
        const showByClassname = !!selector ? selector.className.replace('hidden', '') : '';
        const hideByClassname = !!selector ? `${selector.className} hidden` : '';
        !!selector && selector.classList.contains('hidden')
            ? (selector.className = showByClassname)
            : (selector.className = hideByClassname);
    }

    loadWeeks(shadowDOM) {
        console.log('loadWeeks');
        const that = this;

        function selectWeek(weekName) {
            console.log('clicked selectWeek for ', weekName);

            const weekHover = !!shadowDOM && shadowDOM.getElementById('weekhover');
            if (!!weekHover && !weekHover.classList.contains('above')) {
                // const moveLabel = !!selector && selector.className.replace('hidden', 'above');
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
            that.selectedWeek = weekName;

            const weekOpenerButton = !!shadowDOM && shadowDOM.getElementById('weekOpener');
            !!weekOpenerButton && (weekOpenerButton.innerHTML = weekName);
            console.log('weekOpenerButton.innerHTML = ', weekOpenerButton.innerHTML);
        }

        function addWeekSelectorButton(weekName, weeklistDom) {
            const weekNameLabel = document.createTextNode(weekName);

            const weekSelectButton = document.createElement('button');
            weekSelectButton.className = 'week filterer';
            weekSelectButton.innerHTML = weekName;
            !!weekSelectButton &&
                weekSelectButton.addEventListener('click', function () {
                    selectWeek(weekName);
                });
            !!weeklistDom && weeklistDom.appendChild(weekSelectButton);
        }

        const weekStartProvided = this.getAttribute('week-start') || '';
        const weekEndProvided = this.getAttribute('week-end') || '';

        const weeklistDom = shadowDOM.getElementById('weeklist');
        addWeekSelectorButton('All available', weeklistDom);

        const optionDate = { month: 'short', day: 'numeric' };

        const weekEndDateFinal = new Date(weekEndProvided);

        let weekStartDate = new Date(weekStartProvided);
        let weekStartDisplay = new Intl.DateTimeFormat('en-AU', optionDate).format(weekStartDate);
        let weekEndDate = new Date(weekStartProvided);
        weekEndDate.setDate(weekStartDate.getDate() + 7);
        let weekEndDisplay = new Intl.DateTimeFormat('en-AU', optionDate).format(weekEndDate);
        // TODO test we do include a week for the final class, and we don't include an extra week on the end that has no entries
        while (weekStartDate <= weekEndDateFinal) {
            const weekLabel = `${weekStartDisplay} - ${weekEndDisplay} `;
            addWeekSelectorButton(weekLabel, weeklistDom);

            weekStartDate.setDate(weekStartDate.getDate() + 7);
            weekStartDisplay = new Intl.DateTimeFormat('en-AU', optionDate).format(weekStartDate);
            weekEndDate.setDate(weekStartDate.getDate() + 7);
            weekEndDisplay = new Intl.DateTimeFormat('en-AU', optionDate).format(weekEndDate);
        }
    }

    loadCampuses(shadowDOM) {
        const that = this;
        const campuses = {
            STLUC: 'St Lucia',
            GATTN: 'Gatton',
            IPSWC: 'Ipswich',
            HERST: 'Herston',
            ONL: 'Online',
        };

        function selectCampus(campusName, campusCode) {
            console.log('clicked selectCampus for ', campusName);

            const campusHover = !!shadowDOM && shadowDOM.getElementById('campushover');
            if (!!campusHover && !campusHover.classList.contains('above')) {
                // const moveLabel = !!selector && selector.className.replace('hidden', 'above');
                const moveLabel = `${campusHover.className} above`;
                !!moveLabel && (campusHover.className = moveLabel);
            }
            // there is no functionality to clear the selector fields

            // mark as selected so we can move the placeholder label
            const campusDropdown = !!shadowDOM && shadowDOM.getElementById('campusDropdown');
            const newClassname = !!campusDropdown && `${campusDropdown.className} selected`;
            !!campusDropdown && (campusDropdown.className = newClassname);

            const campuslist = !!shadowDOM && shadowDOM.getElementById('campuslist');
            that.toggleVisibility(campuslist);
            that.selectedCampus = campusCode;

            const campusOpenerButton = !!shadowDOM && shadowDOM.getElementById('campusOpener');
            !!campusOpenerButton && (campusOpenerButton.innerHTML = campusName);
            console.log('campusOpenerButton.innerHTML = ', campusOpenerButton.innerHTML);
        }

        function addCampusSelectorButton(campusName, campusCode) {
            // const campusNameLabel = document.createTextNode(campusName);

            const campusSelectButton = document.createElement('button');
            campusSelectButton.className = 'campus filterer';
            campusSelectButton.innerHTML = campusName;
            !!campusSelectButton &&
                campusSelectButton.addEventListener('click', function () {
                    selectCampus(campusName, campusCode);
                });
            !!campuslistDom && campuslistDom.appendChild(campusSelectButton);
        }

        const campusListProvided = this.getAttribute('campus-list') || '';
        const campusList = campusListProvided.split('|');

        const campuslistDom = shadowDOM.getElementById('campuslist');
        addCampusSelectorButton('All locations', 'all', campuslistDom);

        campusList.forEach((campusCode) => {
            const campusName = campuses[campusCode];
            addCampusSelectorButton(campusName, campusCode, campuslistDom);
        });
    }
}

export default TrainingFilter;
