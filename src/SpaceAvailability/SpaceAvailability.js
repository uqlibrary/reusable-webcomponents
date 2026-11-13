import styles from './css/main.css';
import ApiAccess from '../ApiAccess/ApiAccess';

const SPACE_AVAILABILITY_TITLE_CLASS = 'space-availability__title';
const SPACE_AVAILABILITY_SUBTITLE_CLASS = 'space-availability__subtitle';
const SPACE_AVAILABILITY_CHART_CONTAINER_CLASS = 'space-availability__chart_container';
const SPACE_AVAILABILITY_CHART_BAR_CLASS = 'space-availability__chart_bar';
const SPACE_AVAILABILITY_CHART_BAR_LOADING_CLASS = 'space-availability__chart_bar_loading';
const SPACE_AVAILABILITY_CHART_LABEL_CLASS = 'space-availability__chart_label';
const SPACE_AVAILABILITY_CHART_BAR_LOADER_CLASS = 'space-availability__chart_bar_loader';
const SPACE_AVAILABILITY_INITIAL_LABEL_TEXT = 'Loading data';
const SPACE_AVAILABILITY_WRAPPER_ID = 'spaceAvailabilityWrapper';
const SPACE_AVAILABILITY_TIMER_CONTROL_CLASS = 'space-availability__timer_control';
const SPACE_AVAILABILITY_TIMER_CONTROL_ID = 'spaceAvailabilityTimerControl';
const SPACE_AVAILABILITY_DATA_FETCHING_EVENT = 'space-availability-data-fetching';
const SPACE_AVAILABILITY_DATA_UPDATED_EVENT = 'space-availability-data-updated';
const SPACE_AVAILABILITY_DATA_ERROR_EVENT = 'space-availability-data-error';
const SPACE_AVAILABILITY_DATA_FETCH_COMPLETE_EVENT = 'space-availability-data-fetch-complete';
const SPACE_AVAILABILITY_TIMER_TOGGLED_EVENT = 'space-availability-timer-toggled';

const REFRESH_INTERVAL_TICKS = 1000 * 60 * 2; // 2 minutes, as per peak server vemcount generation

const spaceAvailabilityClass = {
    border: {
        green: 'space-availability__border_green',
        yellow: 'space-availability__border_yellow',
        red: 'space-availability__border_red',
    },
    bar: {
        green: 'space-availability__bar_green',
        yellow: 'space-availability__bar_yellow',
        red: 'space-availability__bar_red',
    },
};

const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <div style="width: 100%" data-testid="${SPACE_AVAILABILITY_WRAPPER_ID}" id="${SPACE_AVAILABILITY_WRAPPER_ID}">
        <div class="${SPACE_AVAILABILITY_TITLE_CLASS}" role="heading" aria-level="3">
            ${SPACE_AVAILABILITY_INITIAL_LABEL_TEXT}
        </div>
        <div class="${SPACE_AVAILABILITY_SUBTITLE_CLASS}">${SPACE_AVAILABILITY_INITIAL_LABEL_TEXT}</div>
        <div class="${SPACE_AVAILABILITY_CHART_CONTAINER_CLASS}">
            <div class="${SPACE_AVAILABILITY_CHART_BAR_CLASS}" style="width:0%;"></div>
            <div class="${SPACE_AVAILABILITY_CHART_BAR_LOADER_CLASS}" aria-hidden="true"></div>
            <div class="${SPACE_AVAILABILITY_CHART_LABEL_CLASS}">${SPACE_AVAILABILITY_INITIAL_LABEL_TEXT}</div>
        </div>
        <div class="${SPACE_AVAILABILITY_TIMER_CONTROL_CLASS} visually-hidden"><button type="button" id="${SPACE_AVAILABILITY_TIMER_CONTROL_ID}" data-testid="${SPACE_AVAILABILITY_TIMER_CONTROL_ID}" aria-pressed="false">Pause all space availability chart updates</button></div>
    </div>
`;

class SpaceAvailabilityDataService extends EventTarget {
    constructor(apiCallback, intervalMs) {
        super();
        this.apiCallback = apiCallback;
        this.intervalMs = intervalMs;
        this.isFetching = false;

        this.fetchData();

        this.startFetching();
    }

    async fetchData() {
        try {
            this.dispatchEvent(new CustomEvent(SPACE_AVAILABILITY_DATA_FETCHING_EVENT));
            const data = await this.apiCallback();
            this.dispatchEvent(new CustomEvent(SPACE_AVAILABILITY_DATA_UPDATED_EVENT, { detail: data }));
        } catch (error) {
            this.dispatchEvent(new CustomEvent(SPACE_AVAILABILITY_DATA_ERROR_EVENT, { detail: error }));
        } finally {
            this.dispatchEvent(new CustomEvent(SPACE_AVAILABILITY_DATA_FETCH_COMPLETE_EVENT));
        }
    }

    startFetching() {
        this.intervalId = setInterval(() => this.fetchData(), this.intervalMs);
        this.isFetching = true;
        this.dispatchEvent(new CustomEvent(SPACE_AVAILABILITY_TIMER_TOGGLED_EVENT, { detail: { isFetching: true } }));
    }

    stopFetching() {
        clearInterval(this.intervalId);
        this.isFetching = false;
        this.dispatchEvent(new CustomEvent(SPACE_AVAILABILITY_TIMER_TOGGLED_EVENT, { detail: { isFetching: false } }));
    }
}

class SpaceAvailability extends HTMLElement {
    constructor() {
        super();

        const idAttribute = this.getAttribute('id');
        const id = Number(idAttribute);
        this.apiAccess = new ApiAccess();
        this.spaceId = idAttribute === null || Number.isNaN(id) ? 0 : id;

        this.shadowDOM = this.attachShadow({ mode: 'open' });
        !!template && !!this.shadowDOM && this.shadowDOM.appendChild(template.content.cloneNode(true));

        this.setBarLoading(true);
    }

    connectedCallback() {
        window.spaceAvailabilityDataService =
            window.spaceAvailabilityDataService ||
            new SpaceAvailabilityDataService(
                this.apiAccess.loadSpacesAvailability.bind(this.apiAccess),
                REFRESH_INTERVAL_TICKS,
            );

        window.spaceAvailabilityDataService.addEventListener(SPACE_AVAILABILITY_DATA_UPDATED_EVENT, this.onDataUpdate);
        window.spaceAvailabilityDataService.addEventListener(SPACE_AVAILABILITY_DATA_ERROR_EVENT, this.onDataError);
        window.spaceAvailabilityDataService.addEventListener(
            SPACE_AVAILABILITY_DATA_FETCHING_EVENT,
            this.onDataFetching,
        );
        window.spaceAvailabilityDataService.addEventListener(
            SPACE_AVAILABILITY_DATA_FETCH_COMPLETE_EVENT,
            this.onDataFetchComplete,
        );
        window.spaceAvailabilityDataService.addEventListener(
            SPACE_AVAILABILITY_TIMER_TOGGLED_EVENT,
            this.onTimerToggled,
        );

        this.shadowDOM
            .querySelector(`#${SPACE_AVAILABILITY_TIMER_CONTROL_ID}`)
            .addEventListener('click', this.onTimerControlClick);
    }

    disconnectedCallback() {
        window.spaceAvailabilityDataService.removeEventListener(
            SPACE_AVAILABILITY_DATA_UPDATED_EVENT,
            this.onDataUpdate,
        );
        window.spaceAvailabilityDataService.removeEventListener(SPACE_AVAILABILITY_DATA_ERROR_EVENT, this.onDataError);
        window.spaceAvailabilityDataService.removeEventListener(
            SPACE_AVAILABILITY_DATA_FETCHING_EVENT,
            this.onDataFetching,
        );
        window.spaceAvailabilityDataService.removeEventListener(
            SPACE_AVAILABILITY_DATA_FETCH_COMPLETE_EVENT,
            this.onDataFetchComplete,
        );
        window.spaceAvailabilityDataService.removeEventListener(
            SPACE_AVAILABILITY_TIMER_TOGGLED_EVENT,
            this.onTimerToggled,
        );

        this.shadowDOM
            .querySelector(`#${SPACE_AVAILABILITY_TIMER_CONTROL_ID}`)
            .removeEventListener('click', this.onTimerControlClick);
    }

    onDataUpdate = (data) => {
        this.render(data?.detail?.find((space) => space.id === this.spaceId));
    };

    onDataError = (e) => {
        this.showError('Error loading data');
    };

    onDataFetching = () => {
        this.setBarLoading(true);
    };

    onDataFetchComplete = () => {
        this.setBarLoading(false);
    };

    onTimerControlClick = () => {
        if (window.spaceAvailabilityDataService.isFetching) {
            window.spaceAvailabilityDataService.stopFetching();
        } else {
            window.spaceAvailabilityDataService.startFetching();
        }
    };

    onTimerToggled = (e) => {
        this.shadowDOM
            .querySelector(`#${SPACE_AVAILABILITY_TIMER_CONTROL_ID}`)
            .setAttribute('aria-pressed', String(!e.detail.isFetching));
    };

    showError(message) {
        if (this.hasInitialText(SPACE_AVAILABILITY_TITLE_CLASS)) {
            this.setTitleText(message);
        }
        if (this.hasInitialText(SPACE_AVAILABILITY_SUBTITLE_CLASS)) {
            this.setSubTitleText(message);
        }
        this.setBarColourState(100);
        this.setBarText(message);
        this.setBarPercentageWidth(0);
    }

    hasInitialText(elementId) {
        return this.shadowDOM.querySelector(`.${elementId}`).innerText === SPACE_AVAILABILITY_INITIAL_LABEL_TEXT;
    }

    getBarMessage = (percentage) => `${percentage}% of capacity`;

    getTitleMessage = (name) => name || '';

    getSubTitleMessage = (count) => (count != null ? `${count} seats` : '');

    getPercentage(data) {
        if (!data || !data.capacity || !data.headCount) return 0;
        return Math.min(100, Math.max(0, (data.headCount / data.capacity) * 100));
    }

    setTitleText(message) {
        this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_TITLE_CLASS}`).innerText = message;
    }

    setSubTitleText(message) {
        this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_SUBTITLE_CLASS}`).innerText = message;
    }

    setBarText(message) {
        this.resetElementClasses(SPACE_AVAILABILITY_CHART_LABEL_CLASS);
        this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_CHART_LABEL_CLASS}`).innerText = message;
    }

    setBarPercentageWidth(percentage) {
        this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_CHART_BAR_CLASS}`).style.width = `${percentage}%`;
    }

    setBarLoading(isLoading) {
        this.shadowDOM
            .querySelector(`.${SPACE_AVAILABILITY_CHART_BAR_LOADER_CLASS}`)
            .classList.toggle(SPACE_AVAILABILITY_CHART_BAR_LOADING_CLASS, isLoading);
    }

    setBorderColour(colourClass) {
        this.resetElementClasses(SPACE_AVAILABILITY_CHART_CONTAINER_CLASS);
        this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_CHART_CONTAINER_CLASS}`).classList.add(colourClass);
    }

    setBarColour(colourClass) {
        this.resetElementClasses(SPACE_AVAILABILITY_CHART_BAR_CLASS);
        this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_CHART_BAR_CLASS}`).classList.add(colourClass);
    }

    setBarColourState(percent) {
        const colour = percent >= 75 ? 'red' : percent >= 50 ? 'yellow' : 'green';
        this.setBorderColour(spaceAvailabilityClass.border[colour]);
        this.setBarColour(spaceAvailabilityClass.bar[colour]);
    }

    render(data) {
        const percentage = Math.round(this.getPercentage(data));
        const titleMessage = this.getTitleMessage(data?.displayName || '');
        this.setBarPercentageWidth(percentage);
        this.setBarColourState(percentage);
        this.setBarText(this.getBarMessage(percentage));
        this.setTitleText(titleMessage);
        this.setSubTitleText(this.getSubTitleMessage(data?.capacity || ''));
    }

    resetElementClasses(elementId) {
        const el = this.shadowDOM.querySelector(`.${elementId}`);
        el.className = el.classList[0];
    }
}

export default SpaceAvailability;
