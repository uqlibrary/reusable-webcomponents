import styles from './css/main.css';
import ApiAccess from '../ApiAccess/ApiAccess';

const SPACE_AVAILABILITY_TITLE_ID = 'space-availability__title';
const SPACE_AVAILABILITY_TITLE_LABEL_ID = 'space-availability__title_label';
const SPACE_AVAILABILITY_SUBTITLE_ID = 'space-availability__subtitle';
const SPACE_AVAILABILITY_CHART_CONTAINER_ID = 'space-availability__chart_container';
const SPACE_AVAILABILITY_CHART_BAR_ID = 'space-availability__chart_bar';
const SPACE_AVAILABILITY_CHART_BAR_LOADING_CLASS = 'space-availability__chart_bar_loading';
const SPACE_AVAILABILITY_CHART_LABEL_ID = 'space-availability__chart_label';
const SPACE_AVAILABILITY_CHART_LABEL_TEXT_ID = 'space-availability__chart_label_text';
const SPACE_AVAILABILITY_CHART_BAR_LOADER_ID = 'space-availability__chart_bar_loader';
const SPACE_AVAILABILITY_STATUS_ID = 'space-availability__status';
const SPACE_AVAILABILITY_HEADING_SR_PREFIX_LABEL = 'UQ Library Space Availability:';
const SPACE_AVAILABILITY_INITIAL_LABEL_TEXT = 'Loading data';
const SPACE_AVAILABILITY_WRAPPER_ID = 'spaceAvailabilityWrapper';

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
    <div style="width: 100%" data-testid="${SPACE_AVAILABILITY_WRAPPER_ID}" id="${SPACE_AVAILABILITY_WRAPPER_ID}" aria-busy="true">
        <div class="${SPACE_AVAILABILITY_TITLE_ID}" role="heading" aria-level="3">
            <span class="visually-hidden">${SPACE_AVAILABILITY_HEADING_SR_PREFIX_LABEL}</span><span class="${SPACE_AVAILABILITY_TITLE_LABEL_ID}">${SPACE_AVAILABILITY_INITIAL_LABEL_TEXT}</span></div>
        <div class="${SPACE_AVAILABILITY_SUBTITLE_ID}">${SPACE_AVAILABILITY_INITIAL_LABEL_TEXT}</div>
        <div class="${SPACE_AVAILABILITY_CHART_CONTAINER_ID}">
            <div class="${SPACE_AVAILABILITY_CHART_BAR_ID}" style="width:0%;"></div>
            <div class="${SPACE_AVAILABILITY_CHART_BAR_LOADER_ID}" aria-hidden="true"></div>
            <div class="${SPACE_AVAILABILITY_CHART_LABEL_ID}">
                <span class="${SPACE_AVAILABILITY_STATUS_ID} visually-hidden"></span>
                <span class="${SPACE_AVAILABILITY_CHART_LABEL_TEXT_ID}">${SPACE_AVAILABILITY_INITIAL_LABEL_TEXT}</span>
            </div>
        </div>
    </div>
`;

class SpaceAvailabilityDataService extends EventTarget {
    constructor(apiCallback, intervalMs) {
        super();
        this.apiCallback = apiCallback;

        this.fetchData();

        setInterval(() => this.fetchData(), intervalMs);
    }

    async fetchData() {
        try {
            this.dispatchEvent(new CustomEvent('space-availability-data-fetching'));
            const data = await this.apiCallback();
            this.dispatchEvent(new CustomEvent('space-availability-data-updated', { detail: data }));
        } catch (error) {
            this.dispatchEvent(new CustomEvent('space-availability-data-error', { detail: error }));
        } finally {
            this.dispatchEvent(new CustomEvent('space-availability-data-fetch-complete'));
        }
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

        this.hasLoadedData = false;
        this.hasAnnouncedStatus = false;
        this.setBarLoading(true);
    }

    connectedCallback() {
        window.spaceAvailabilityDataService =
            window.spaceAvailabilityDataService ||
            new SpaceAvailabilityDataService(
                this.apiAccess.loadSpacesAvailability.bind(this.apiAccess),
                REFRESH_INTERVAL_TICKS,
            );

        window.spaceAvailabilityDataService.addEventListener('space-availability-data-updated', this.onDataUpdate);
        window.spaceAvailabilityDataService.addEventListener('space-availability-data-error', this.onDataError);
        window.spaceAvailabilityDataService.addEventListener('space-availability-data-fetching', this.onDataFetching);
        window.spaceAvailabilityDataService.addEventListener(
            'space-availability-data-fetch-complete',
            this.onDataFetchComplete,
        );
    }

    disconnectedCallback() {
        window.spaceAvailabilityDataService.removeEventListener('space-availability-data-updated', this.onDataUpdate);
        window.spaceAvailabilityDataService.removeEventListener('space-availability-data-error', this.onDataError);
        window.spaceAvailabilityDataService.removeEventListener(
            'space-availability-data-fetching',
            this.onDataFetching,
        );
        window.spaceAvailabilityDataService.removeEventListener(
            'space-availability-data-fetch-complete',
            this.onDataFetchComplete,
        );
        window.spaceAvailabilityDataService.removeEventListener(
            'space-availability-data-fetching',
            this.onDataFetching,
        );
        window.spaceAvailabilityDataService.removeEventListener(
            'space-availability-data-fetch-complete',
            this.onDataFetchComplete,
        );
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

    showError(message) {
        if (this.hasInitialText(SPACE_AVAILABILITY_TITLE_LABEL_ID)) {
            this.setTitleText(message);
        }
        if (this.hasInitialText(SPACE_AVAILABILITY_SUBTITLE_ID)) {
            this.setSubTitleText(message);
        }
        this.setStatusMessage(message);
        this.setBarColourState(100);
        this.setBarText(message);
        this.setBarPercentageWidth(0);
    }

    hasInitialText(elementId) {
        return this.shadowDOM.querySelector(`.${elementId}`).innerText.includes(SPACE_AVAILABILITY_INITIAL_LABEL_TEXT);
    }

    getBarMessage = (percentage) => `${percentage}% of capacity`;

    getTitleMessage = (name) => name || '';

    getSubTitleMessage = (count) => (count != null ? `${count} seats` : '');

    getPercentage(data) {
        if (!data || !data.capacity || !data.headCount) return 0;
        return Math.min(100, Math.max(0, (data.headCount / data.capacity) * 100));
    }

    setTitleText(message) {
        this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_TITLE_LABEL_ID}`).innerText = message;
    }

    setStatusMessage(message) {
        const statusElement = this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_STATUS_ID}`);
        // only mark the region live once it already has initial content, so the first load isn't announced
        if (this.hasAnnouncedStatus) {
            statusElement.setAttribute('role', 'status');
        }
        statusElement.innerText = message;
        this.hasAnnouncedStatus = true;
    }

    setSubTitleText(message) {
        this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_SUBTITLE_ID}`).innerText = message;
    }

    setBarText(message) {
        this.resetElementClasses(SPACE_AVAILABILITY_CHART_LABEL_ID);
        this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_CHART_LABEL_TEXT_ID}`).innerText = message;
    }

    setBarPercentageWidth(percentage) {
        this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_CHART_BAR_ID}`).style.width = `${percentage}%`;
    }

    setBarLoading(isLoading) {
        this.shadowDOM.querySelector(`#${SPACE_AVAILABILITY_WRAPPER_ID}`).setAttribute('aria-busy', String(isLoading));
        this.shadowDOM
            .querySelector(`.${SPACE_AVAILABILITY_CHART_BAR_LOADER_ID}`)
            .classList.toggle(SPACE_AVAILABILITY_CHART_BAR_LOADING_CLASS, isLoading);
    }

    setBorderColour(colourClass) {
        this.resetElementClasses(SPACE_AVAILABILITY_CHART_CONTAINER_ID);
        this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_CHART_CONTAINER_ID}`).classList.add(colourClass);
    }

    setBarColour(colourClass) {
        this.resetElementClasses(SPACE_AVAILABILITY_CHART_BAR_ID);
        this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_CHART_BAR_ID}`).classList.add(colourClass);
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
        const updatedLabel = this.hasLoadedData ? ' updated' : ''; // only announce as an update after the initial load
        const titleMessageWithUpdate = `${
            this.hasLoadedData ? titleMessage || 'Space availability' : ''
        }${updatedLabel}`;
        this.setStatusMessage(`${titleMessageWithUpdate}:`);
        this.hasLoadedData = true;
    }

    resetElementClasses(elementId) {
        const el = this.shadowDOM.querySelector(`.${elementId}`);
        el.className = el.classList[0];
    }
}

export default SpaceAvailability;
