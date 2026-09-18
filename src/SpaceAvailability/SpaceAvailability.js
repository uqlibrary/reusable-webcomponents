import styles from './css/main.css';
import ApiAccess from '../ApiAccess/ApiAccess';

const SPACE_AVAILABILITY_TITLE_ID = 'space-availability__title';
const SPACE_AVAILABILITY_SUBTITLE_ID = 'space-availability__subtitle';
const SPACE_AVAILABILITY_CHART_CONTAINER_ID = 'space-availability__chart_container';
const SPACE_AVAILABILITY_CHART_BAR_ID = 'space-availability__chart_bar';
const SPACE_AVAILABILITY_CHART_BAR_LOADING_CLASS = 'space-availability__chart_bar--loading';
const SPACE_AVAILABILITY_CHART_LABEL_ID = 'space-availability__chart_label';

const REFRESH_INTERVAL_TICKS = 1000 * 60 * 1; // 5 minutes

const spaceAvailabilityClass = {
    border: {
        green: 'space-availability__border_green',
        yellow: 'space-availability__border_yellow',
        red: 'space-availability__border_red'
    },
    bar: {
        green: 'space-availability__bar_green',
        yellow: 'space-availability__bar_yellow',
        red: 'space-availability__bar_red'
    }
};
const template = document.createElement('template');
template.innerHTML = `
    <style>${styles.toString()}</style>
    <div role="region" aria-label="UQ Library Space Availability">
        <div style="width: 100%" data-testid="spaceAvailabilityWrapper" id="spaceAvailabilityWrapper">
            <div class="${SPACE_AVAILABILITY_TITLE_ID}">Space</div>
            <div class="${SPACE_AVAILABILITY_SUBTITLE_ID}">0 seats</div>
            <div class="${SPACE_AVAILABILITY_CHART_CONTAINER_ID}">
                <div class="${SPACE_AVAILABILITY_CHART_BAR_ID}" style="width:0%;"></div>
                <div class="${SPACE_AVAILABILITY_CHART_LABEL_ID}">0% of capacity</div>
            </div>
        </div>
    </div>
`;

class SpaceAvailability extends HTMLElement {
    constructor() {
        super();

        const idAttribute = this.getAttribute('id');
        const id = Number(idAttribute);
        this.spaceId = idAttribute === null || Number.isNaN(id) ? 0 : id;
        this.refreshIntervalTicks = REFRESH_INTERVAL_TICKS;

        this.shadowDOM = this.attachShadow({ mode: 'open' });
        !!template && !!this.shadowDOM && this.shadowDOM.appendChild(template.content.cloneNode(true));
        this.updateChart(this.spaceId);
    }

    async updateChart(id) {
        await this.loadSpaceAvailability();
        setInterval(() => this.loadSpaceAvailability(), this.refreshIntervalTicks);
    }

    async loadSpaceAvailability() {
        const apiAccess = new ApiAccess();
        this.setBarLoading(true);
        try {
            const data = await apiAccess.loadSpacesAvailability();
            this.render(data?.find(space => space.id === this.spaceId));
        } catch (error) {
            console.error('Error loading space availability:', error);
            this.showError('Error loading data');
        } finally {
            this.setBarLoading(false);
        }
    }

    showError(message) {
        this.setBarColourState(100);
        this.setBarText(message);
        this.setBarPercentageWidth(0);
    }
    
    getBarMessage = percentage => `${percentage}% of capacity`;
    getTitleMessage = name => name || '';
    getSubTitleMessage = count => count != null ? `${count} seats` : '';
    getPercentage(data) {
        if (!data || !data.capacity || !data.headCount) return 0;
        return Math.min(100, Math.max(0, (data.headCount / data.capacity) * 100));
    }
    setTitleText(message) {
        this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_TITLE_ID}`).innerText = message;
    }
    setSubTitleText(message) {
        this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_SUBTITLE_ID}`).innerText = message;
    }
    setBarText(message) {
        this.resetElementClasses(SPACE_AVAILABILITY_CHART_LABEL_ID);
        this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_CHART_LABEL_ID}`).innerText = message;
    }
    setBarPercentageWidth(percentage) {
        this.shadowDOM.querySelector(`.${SPACE_AVAILABILITY_CHART_BAR_ID}`).style.width = `${percentage}%`;
    }
    setBarLoading(isLoading) {
        this.shadowDOM
            .querySelector(`.${SPACE_AVAILABILITY_CHART_BAR_ID}`)
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
        this.setBarPercentageWidth(percentage);
        this.setBarColourState(percentage);
        this.setBarText(this.getBarMessage(percentage));
        this.setTitleText(this.getTitleMessage(data?.displayName || ''));
        this.setSubTitleText(this.getSubTitleMessage(data?.capacity || ''));
    }

    resetElementClasses(elementId) {
        const el = this.shadowDOM.querySelector(`.${elementId}`);
        el.className = el.classList[0];
    }
}

export default SpaceAvailability;