import styles from './css/main.css';
import overrides from './css/overrides.css';
import { authLocale } from '../UtilityArea/auth.locale';

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <style>${overrides.toString()}</style>
    <div id="root" class="pane pane--outline">
        <div class="header uq-pane__title">
            <div class="title-text paper-card">Filter events</div>
        </div>
            <div class="card-content">
                <div aria-label="filter by keyword" class="paper-input-0" tabindex="0" aria-disabled="false">
                    <div style="display: flex;">
                        <label style="flex: 1" class="keywordhover1 hovertext1">
                            <input id="inputKeyword" class="hovertext1 paper-input" autocomplete="off" placeholder=" " autocapitalize="none" autocorrect="off" aria-describedby="" aria-labelledby="keywordhover" tabindex="0">
                            <span class="keywordhover1 hovertext1">By keyword</span>
                        </label>                        
                        <span class="lowlevel-icon">
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                                <g class="iron-icon">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" class="iron-icon"></path>
                                </g>
                            </svg>
                        </span>
                    </div>
                </div>
                <div aria-label="filter by campus" id="campusDropdown" class="listHolder paper-dropdown-menu-0" role="combobox" aria-autocomplete="none" aria-haspopup="true" aria-disabled="false">
                    <div aria-label="campushover" id="campushover" class="hovertext campushover "></div>
                    <button id="campusOpener" class="opener filterer" aria-labelledby="campushover">By campus</button>
                    <div id="campuslist" class="selectorlist campuslist hidden"></div>
                </div>
                <div aria-label="filter by week" id="weekDropdown" class="listHolder paper-dropdown-menu-0" role="combobox" aria-autocomplete="none" aria-haspopup="true" aria-disabled="false">
                    <div aria-label="weekhover" id="weekhover" class="hovertext weekhover "></div>
                    <button id="weekOpener" class="opener filterer" aria-labelledby="weekhover">By week</button>
                    <div id="weeklist" class="selectorlist weeklist hidden"></div>
                </div>
            </div>
            <div class="onlineToggle">
                <input type="checkbox" name="onlineonly" id="onlineonly" />
                <label class="toggle-label paper-toggle-button">Show only online events</label>
            </div>
            <div id="quicklinks" class="quicklinks">
                <h4>Popular events:</h4>
    <!--                    <button class="paper-button-0" role="button" tabindex="0" animated="" aria-disabled="false" elevation="0">EndNote</button>-->
            </div>
        </div>
    </div>
`;

let initCalled;

class TrainingFilter extends HTMLElement {
    // static get observedAttributes() {
    //     return ['xxx'];
    // }
    //
    // attributeChangedCallback(fieldName, oldValue, newValue) {
    //     switch (fieldName) {
    //         case 'xxx':
    //             this.addButtonListeners(newValue);
    //
    //             break;
    //         /* istanbul ignore next  */
    //         default:
    //             console.log(`unhandled attribute ${fieldName} received for TrainingFilter`);
    //     }
    // }

    // properties
    // selectedCampus
    // selectedWeek
    // inputKeywordValue
    // onlineOnlyProperty

    constructor() {
        super();

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
        console.log('selectedCampus has been set to ', selectedCampus);
    }

    set selectedWeek(selectedWeek) {
        // do things to make a change available to other components
        console.log('selectedWeek has been set to ', selectedWeek);
    }

    set inputKeywordValue(inputKeyword) {
        // do things to make a change available to other components
        console.log('inputKeyword has been set to ', inputKeyword);
    }

    set onlineOnlyProperty(onlineonly) {
        // do things to make a change available to other components
        console.log('onlineOnlyProperty has been set to ', onlineonly);
    }

    addListeners(shadowDOM) {
        const that = this;

        const campuslist = !!shadowDOM && shadowDOM.getElementById('campuslist');
        const weeklist = !!shadowDOM && shadowDOM.getElementById('weeklist');

        // root close fires after botton open, auto closing it :(
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

        function toggleWeekSelector() {
            !campuslist.classList.contains('hidden') && that.toggleVisibility(campuslist);
            that.toggleVisibility(weeklist);
        }
        const weekOpenerButton = !!shadowDOM && shadowDOM.getElementById('weekOpener');
        !!weekOpenerButton && weekOpenerButton.addEventListener('click', toggleWeekSelector);

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

        function noteCheckboxSet() {
            that.onlineOnlyProperty = !!this.checked;
        }
        const onlineonlyField = !!shadowDOM && shadowDOM.getElementById('onlineonly');
        !!onlineonlyField && onlineonlyField.addEventListener('change', noteCheckboxSet);
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
            // const chipNameLabel = document.createTextNode(xxchipName);

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
        const showByClassname = !!selector ? selector.className.replace('hidden') : '';
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
            const weekOpenerButton = !!shadowDOM && shadowDOM.getElementById('weekOpener');
            !!weekOpenerButton && (weekOpenerButton.innerHTML = weekName);

            const weeklist = !!shadowDOM && shadowDOM.getElementById('weeklist');
            that.toggleVisibility(weeklist);
            that.selectedWeek = weekName;

            const weekHover = !!shadowDOM && shadowDOM.getElementById('weekhover');
            !!weekHover && (weekHover.innerHTML = 'By week');
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
        // TODO check we do include a week for the final class, and we don't include an extra week on the end that has no entries
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
            const campusOpenerButton = !!shadowDOM && shadowDOM.getElementById('campusOpener');
            !!campusOpenerButton && (campusOpenerButton.innerHTML = campusName);

            const campuslist = !!shadowDOM && shadowDOM.getElementById('campuslist');
            that.toggleVisibility(campuslist);
            that.selectedCampus = campusCode;

            const campusHover = !!shadowDOM && shadowDOM.getElementById('campushover');
            !!campusHover && (campusHover.innerHTML = 'By campus');
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
