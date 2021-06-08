import ApiAccess from '../ApiAccess/ApiAccess';

const template = document.createElement('template');
template.innerHTML = `
    <div role="region" aria-label="UQ Library Training" data-testid="library-training" id="library-training"></div>
`;

class Training extends HTMLElement {
    get eventFilterId() {
        return this.getAttribute('event-filter-id') || 104;
    }

    get maxEventCount() {
        return this.getAttribute('max-event-count') || 100;
    }

    // get gaAppName() {
    //     return this.getAttribute('ga-app-name');
    // }

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

    get knownFilters() {
        return ['keyword', 'campus', 'weekstart', 'online'];
    }

    get filters() {
        if (!location.hash) {
            return null;
        }
        const ret = [];

        // #keyword=Rstudio;campus=St%20Lucia|Gatton;weekstart=2021-05-31;online=false
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
        if (!this.hideFilter) {
            this.filterComponent = document.createElement('training-filter');
            this.rootElement.appendChild(this.filterComponent);
        }
        this.listComponent = document.createElement('training-list');
        if (this.hideCategoryTitle) {
            this.listComponent.setAttribute('hide-category-title', true);
        }
        this.rootElement.appendChild(this.listComponent);

        this.fetchData();
        this.addEventListeners();
    }

    fetchData() {
        new ApiAccess().loadTrainingEvents(this.maxEventCount, this.eventFilterId).then((fetchedEvents) => {
            /* istanbul ignore else */
            if (fetchedEvents) {
                this.trainingEvents = fetchedEvents;
                this.initFiltering();
                this.setFilters();
            }
        });
    }

    initFiltering() {
        if (this.hideFilter) {
            return;
        }

        const campusList = [];
        const startDateList = [];
        const endDateList = [];
        this.trainingEvents.map((event) => {
            campusList.push(event.campus);
            startDateList.push(new Date(event.start));
            endDateList.push(new Date(event.end));
        });
        const campusListAttr = [...new Set(campusList)].filter(Boolean).map(encodeURIComponent).join('|');
        const weekStartAttr = startDateList.sort((a, b) => a < b)[0].toISOString();
        const weekEndAttr = endDateList
            .sort((a, b) => a < b)
            .pop()
            .toISOString();

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
        this.listComponent.data = this.getFilteredEvents();
        this.hideCategoryTitle && this.listComponent.setAttribute('hide-category-title', this.hideCategoryTitle);
    }
}

export default Training;
