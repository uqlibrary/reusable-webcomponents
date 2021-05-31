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
            <div id="training-status"></div>
            <training-filter id="training-filter"></training-filter>
            <training-list id="training-list"></training-list>
        </div>
    </div>
`;

class Training extends HTMLElement {
    get logging() {
        return true;
    }

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
        const ret = {};

        location.hash
            .slice(1) // remove '#' from beginning
            .split('&') // separate filters
            .map((spec) => {
                const parts = spec.split('='); // get keys and values
                ret[parts[0]] = parts[1];
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
        this.statusNode = this.shadowRoot.getElementById('training-status');
        this.filterComponent = this.shadowRoot.getElementById('training-filter');
        this.listComponent = this.shadowRoot.getElementById('training-list');

        this.fetchData();
        this.addEventListeners();
    }

    fetchData() {
        new ApiAccess().loadTrainingEvents(this.maxEventCount).then((fetchedEvents) => {
            if (fetchedEvents) {
                this.trainingEvents = fetchedEvents;

                this.statusNode.innerText = `Loaded ${this.trainingEvents.length} events`;
                this.setFilters();
            }
        });
    }

    getFilteredEvents() {
        const filteredEvents = this.trainingEvents.filter(() => {
            // TODO: filter with this.filters

            return true;
        });

        this.logging && console.log(`Filtered list has ${filteredEvents.length} events`);
        return filteredEvents;
    }

    addEventListeners() {
        window.addEventListener('hashchange', () => {
            this.logging && console.log('Hash changed to', window.location.hash || '(empty)');
            this.setFilters();
        });
    }

    setFilters() {
        this.logging && console.log({ filters: this.filters });

        // Copy filters from URL to filter component
        this.filterComponent.filters = this.filters;

        // Apply filters to list
        this.listComponent.data = this.getFilteredEvents();
    }
}

export default Training;
