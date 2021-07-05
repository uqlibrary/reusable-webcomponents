import ApiAccess from '../ApiAccess/ApiAccess';
import styles from './css/main.css';

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <style>#training-data-message:empty { display: none; }</style>
    <div role="region" aria-label="UQ Library Training" data-testid="library-training" id="library-training">
        <div class="uq-card" data-testid="training-data-message" id="training-data-message">
            <p class="uq-card__content" data-testid="training-loading-message">Loading class information...</p>
        </div>
    </div>
`;

const noDataTemplate = document.createElement('template');
noDataTemplate.innerHTML = `
    <p class="uq-card__content" data-testid="training-no-data-message">No classes scheduled; check back soon.</p>
`;

class Training extends HTMLElement {
    get eventFilterId() {
        return this.getAttribute('event-filter-id') || 104;
    }

    get maxEventCount() {
        return this.getAttribute('max-event-count') || 100;
    }

    get hideFilter() {
        return this.hasAttribute('hide-filter') && this.getAttribute('hide-filter') !== 'false';
    }

    get hideCategoryTitle() {
        return this.hasAttribute('hide-category-title') && this.getAttribute('hide-category-title') !== 'false';
    }

    get trainingEvents() {
        return this._trainingEvents;
    }

    set trainingEvents(events) {
        this._trainingEvents = events;
    }

    get knownFilters() {
        return ['keyword', 'campus', 'weekstart'];
    }

    get filters() {
        /* istanbul ignore if */
        if (!location.hash) {
            return null;
        }
        const ret = [];

        // #keyword=Rstudio;campus=St%20Lucia|Gatton;weekstart=2021-05-31
        location.hash
            .slice(1) // remove '#' from beginning
            .split(';') // separate filters
            .map((spec) => {
                /* istanbul ignore if */
                if (!spec) {
                    return;
                }
                const [name, value] = spec.split('='); // get keys and values
                if (this.knownFilters.includes(name) && !!value) {
                    if (['campus', 'weekstart'].includes(name) && value === 'all') {
                        return;
                    }
                    ret.push({
                        name,
                        value: name === 'campus' ? decodeURIComponent(value).split('|').map(decodeURIComponent) : value,
                    });
                }
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
        this.rootElement = this.shadowRoot.getElementById('library-training');
        this.messageElement = this.shadowRoot.getElementById('training-data-message');
        this.filterComponent = document.createElement('training-filter');
        this.listComponent = document.createElement('training-list');
        if (this.hideCategoryTitle) {
            this.listComponent.setAttribute('hide-category-title', '');
        }

        this.fetchData();
        this.addEventListeners();
    }

    fetchData() {
        new ApiAccess().loadTrainingEvents(this.maxEventCount, this.eventFilterId).then((fetchedEvents) => {
            /* istanbul ignore else */
            if (!!fetchedEvents && fetchedEvents.length) {
                this.trainingEvents = fetchedEvents;
                this.setAttribute('events-loaded', '');
                this.messageElement.innerHTML = '';
                if (!this.hideFilter) {
                    this.rootElement.appendChild(this.filterComponent);
                }
                this.rootElement.appendChild(this.listComponent);
                this.initFiltering();
                this.setFilters();
            } else {
                this.messageElement.innerHTML = '';
                this.trainingEvents = [];
                this.messageElement.appendChild(noDataTemplate.content.cloneNode(true));
            }
        });
    }

    initFiltering() {
        if (this.hideFilter) {
            return;
        }

        const campusList = [];
        let firstStartDate = null;
        let lastEndDate = null;
        this.trainingEvents.map((event) => {
            campusList.push(event.campus);
            if (!firstStartDate || firstStartDate > event.start) {
                firstStartDate = event.start;
            }
            if (!lastEndDate || lastEndDate < event.end) {
                lastEndDate = event.end;
            }
        });
        const campusListAttr = [...new Set(campusList)].filter(Boolean).map(encodeURIComponent).join('|');
        const weekStartAttr = new Date(firstStartDate).toISOString();
        const weekEndAttr = new Date(lastEndDate).toISOString();

        this.filterComponent.setAttribute('week-start', weekStartAttr);
        this.filterComponent.setAttribute('campus-list', campusListAttr);
        this.filterComponent.setAttribute('week-end', weekEndAttr);
    }

    getFilteredEvents() {
        // Convert array to object for easy reference
        const filters = {};
        this.knownFilters.map((filterName) => {
            const filter = !!this.filters && this.filters.find((spec) => spec.name === filterName);
            if (filter) {
                filters[filterName] = filter.value;
            }
        }, this);

        const keywordRegExp = new RegExp(filters.keyword, 'i');

        let weekStart;
        let weekEnd;
        if (!!filters.weekstart) {
            weekStart = new Date(filters.weekstart + 'T00:00:00+10:00');

            weekEnd = new Date(weekStart.getTime());
            weekEnd.setDate(weekStart.getDate() + 7);
        }

        const filteredEvents = this.trainingEvents.filter((event) => {
            if (!!filters.keyword && !(event.name.match(keywordRegExp) || event.details.match(keywordRegExp))) {
                return false;
            }

            if (!!filters.campus && !filters.campus.includes(event.campus)) {
                return false;
            }

            if (!!filters.weekstart) {
                const eventStartDate = new Date(event.start);
                const eventEndDate = new Date(event.end);
                const eventStartsAfterWeek = eventStartDate > weekEnd;
                const eventEndsBeforeWeek = eventEndDate < weekStart;
                /* istanbul ignore else */
                if (eventStartsAfterWeek || eventEndsBeforeWeek) {
                    return false;
                }
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
        // // Copy filters from URL to filter component
        // !this.hideFilter &&
        //     !!this.filters &&
        //     this.filters.forEach(({ name, value }) => {
        //         let encodedValue;
        //         switch (name) {
        //             case 'campus':
        //                 encodedValue = encodeURIComponent(value.join('|'));
        //                 break;
        //             case 'weekstart':
        //                 // fr-ca: hack to get dates in YYYY-MM-DD format
        //                 const formatter = new Intl.DateTimeFormat('fr-ca');
        //                 encodedValue = formatter.format(new Date(value)).replaceAll('-', '');
        //                 break;
        //             default:
        //                 encodedValue = value;
        //         }
        //         this.filterComponent.setAttribute(name, value);
        //     });

        // Apply filters to list
        /* istanbul ignore else */
        if (this.hasAttribute('events-loaded')) {
            this.removeAttribute('accordions-active');
            this.listComponent.data = this.getFilteredEvents();
        }
    }
}

export default Training;
