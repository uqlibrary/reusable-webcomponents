import styles from './css/main.css';
import styleOverrides from './css/overrides.css';
import ApiAccess from '../ApiAccess/ApiAccess';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        ${styles.toString()}
        ${styleOverrides.toString()}
    </style>
    <div role="region" aria-label="UQ Library Training" data-testid="library-training" id="library-training">
        <div id="training-container">
            <training-filter id="training-filter"></training-filter>
            <training-list id="training-list"></training-list>
        </div>
    </div>
`;

class Training extends HTMLElement {
    get eventFilterId() {
        return this.getAttribute('event-filter-id');
    }

    get maxEventCount() {
        return this.getAttribute('max-event-count') || 100;
    }

    get gaAppName() {
        return this.getAttribute('ga-app-name');
    }

    get hideFilter() {
        return this.hasAttribute('hide-filter');
    }

    get hideCategoryTitle() {
        return this.hasAttribute('hide-category-title');
    }

    get trainingEvents() {
        return this._trainingEvents;
    }

    set trainingEvents(events) {
        this._trainingEvents = events;
    }

    get filters() {
        if (!location.hash) {
            return null;
        }
        const ret = [];

        // #keyword=Rstudio;campus=St%20Lucia;weekstart=2021-05-31;online=false
        location.hash
            .slice(1) // remove '#' from beginning
            .split(';') // separate filters
            .map((spec) => {
                if (!spec) {
                    return;
                }
                const parts = spec.split('='); // get keys and values
                ret.push({
                    name: parts[0],
                    value: decodeURIComponent(parts[1]),
                });
            });

        return ret;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({ mode: 'open' });

        // Render the template
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Save element refs
        this.filterComponent = this.shadowRoot.getElementById('training-filter');
        this.listComponent = this.shadowRoot.getElementById('training-list');

        this.fetchData();
        this.addEventListeners();
    }

    fetchData() {
        new ApiAccess().loadTrainingEvents(this.maxEventCount).then((fetchedEvents) => {
            if (fetchedEvents) {
                this.trainingEvents = fetchedEvents;
                this.setFilters();
            }
        });
    }

    getFilteredEvents() {
        // Convert array to object for easy reference
        const filters = {};
        ['keyword', 'campus', 'weekstart', 'online'].map((filterName) => {
            const filter = !!this.filters && this.filters.find((spec) => spec.name === filterName);
            if (filter) {
                filters[filterName] = filter.value;
            }
        }, this);

        const keywordRegExp = new RegExp(filters.keyword, 'i');

        let weekStart;
        let weekEnd;
        if (!!filters.weekstart) {
            weekStart = new Date(filters.weekstart);
            weekStart.setHours(0, 0, 0);

            weekEnd = new Date(weekStart.getTime());
            weekEnd.setDate(weekStart.getDate() + 7);
        }

        const filteredEvents = this.trainingEvents.filter((event) => {
            if (!!filters.keyword && !(event.name.match(keywordRegExp) || event.details.match(keywordRegExp))) {
                return false;
            }

            if (!!filters.campus && filters.campus !== event.campus) {
                return false;
            }

            if (!!filters.weekstart) {
                // const eventDate = moment(event.start);
                const eventDate = new Date(event.start);
                if (eventDate < weekStart || weekEnd > eventDate) {
                    return false;
                }
            }

            if (!!filters.online && filters.online === 'true' && !event.isOnlineClass) {
                return false;
            }

            return true;
        });

        return filteredEvents;
    }

    addEventListeners() {
        window.addEventListener('hashchange', () => {
            this.setFilters();
        });
    }

    setFilters() {
        // Copy filters from URL to filter component
        !!this.filters &&
            this.filters.forEach(({ name, value }) => {
                this.filterComponent.setAttribute(name, value);
            });

        // Apply filters to list
        this.listComponent.data = this.getFilteredEvents();
    }
}

export default Training;
