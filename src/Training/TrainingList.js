import styles from './css/main.css';
import listStyles from './css/list.css';
import uqds from './js/uqds';
import ApiAccess from '../ApiAccess/ApiAccess';
import { apiLocale } from '../ApiAccess/ApiAccess.locale';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        ${styles.toString()}
        ${listStyles.toString()}
    </style>
    <section data-testid="training-list" id="training-list" aria-label="Available events" class="uq-grid uq-grid--full-width">
    </section>
`;

const categoryTemplate = document.createElement('template');
categoryTemplate.innerHTML = `
    <div class="uq-grid__col uq-grid__col--6 uq-card">
        <div class="uq-card__header"></div>
        <div class="uq-card__body">
            <div class="uq-card__content">
                <div 
                    class="uq-accordion"
                    aria-label="Accordion button group"
                    id="training-events-accordion"
                    data-testid="training-events-accordion"
                >
                </div>
            </div>
            <div class="uq-card__actions">
                <button class="uq-button uq-button--secondary is-more" data-testid="training-events-toggle-full-list">Show more</button>
            </div>
        </div>
    </div>
`;

const eventTemplate = document.createElement('template');
eventTemplate.innerHTML = `
    <div class="uq-accordion__item">
        <button class="uq-accordion__toggle" aria-expanded="false"></button>
        <div class="uq-accordion__content" aria-hidden="true"></div>
    </div>
`;

class TrainingList extends HTMLElement {
    constructor() {
        super();
        this._account = {};
        this._eventList = [];
    }

    set data(eventList) {
        this._eventList = eventList;
        this.clearEvents();

        // Get list of unique category names
        const categoryNames = [...new Set(eventList.map((event) => event.eventType))];

        const categoryIdPrefix = 'category-top-';
        const buttonIdPrefix = 'actionbutton-';
        const that = this;
        categoryNames.map((categoryName, index) => {
            this.rootElement.appendChild(categoryTemplate.content.cloneNode(true));
            const categoryCard = this.rootElement.lastElementChild;

            // tie the action button to the section it is in
            const cardTop = categoryCard.querySelector('.uq-card__header');
            !!cardTop & (cardTop.id = `${categoryIdPrefix}${index}`);
            !!cardTop & cardTop.setAttribute('data-testid', `${categoryIdPrefix}${index}`);
            const actionButton = categoryCard.querySelector('.uq-card__actions button');
            !!actionButton & (actionButton.id = `${buttonIdPrefix}${index}`);

            categoryCard.getElementsByClassName('uq-card__header').item(0).innerHTML = `
                <h3 class="uq-card__title${this.hideCategoryTitle ? ' visually-hidden' : ''}">${categoryName}</h3>
            `;

            const categoryListElement = categoryCard.getElementsByClassName('uq-accordion').item(0);
            categoryListElement.setAttribute('id', `event-category-${index}`);
            categoryListElement.setAttribute('data-testid', `training-event-category-${index}`);
            categoryListElement.setAttribute('data-category-name', categoryName);

            const longListCallback = () => {
                categoryCard.classList.add('has-more-events');
                categoryCard
                    .getElementsByClassName('uq-card__actions')
                    .item(0)
                    .lastElementChild.addEventListener('click', (e) => {
                        const isMoreButton = e.target.classList.contains('is-more');
                        e.target.textContent = isMoreButton ? 'Show less' : 'Show more';
                        e.target.classList.toggle('is-more', !isMoreButton);
                        categoryCard.classList.toggle('show-all', isMoreButton);
                        if (!isMoreButton) {
                            // scroll the user back to the top of the section so they arent lost on the page
                            const buttonId = e.target.id;
                            const parentid = buttonId.replace(buttonIdPrefix, categoryIdPrefix);
                            const parent = that.shadowRoot.getElementById(parentid);
                            !!parent && parent.scrollIntoView();
                        }
                        isMoreButton && categoryCard.getElementsByClassName('uq-accordion__toggle').item(5).focus();
                    });
            };

            this.populateEventsByCategory(categoryListElement, longListCallback);
        });

        this.addEventListeners();
    }

    get data() {
        return this._eventList;
    }

    get hideCategoryTitle() {
        return this.hasAttribute('hide-category-title');
    }

    get account() {
        return this._account;
    }

    set account(value) {
        this._account = value;
    }

    connectedCallback() {
        this.attachShadow({ mode: 'open' });

        // Render the template
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Save element refs
        this.rootElement = this.shadowRoot.getElementById('training-list');

        this.checkAuthorisedUser();
    }

    addEventListeners() {
        new uqds.accordion('uq-accordion');
    }

    populateEventsByCategory(categoryListElement, longListCallback) {
        const categoryName = categoryListElement.getAttribute('data-category-name');
        const eventsByCategory = this.data.filter((event) => event.eventType === categoryName);
        if (eventsByCategory.length > 5) {
            longListCallback();
        }
        eventsByCategory.map((event) => {
            this.insertEvent(event, categoryListElement);
        });
    }

    insertEvent(event, eventListForCategory) {
        eventListForCategory.appendChild(eventTemplate.content.cloneNode(true));
        const eventElement = eventListForCategory.lastElementChild;
        const toggleButtonId = `training-event-detail-toggle-${event.entityId}`;
        const detailContainerId = `training-event-detail-${event.entityId}`;

        const toggleButton = eventElement.getElementsByClassName('uq-accordion__toggle').item(0);
        toggleButton.setAttribute('id', toggleButtonId);
        toggleButton.setAttribute('data-testid', toggleButtonId);
        toggleButton.setAttribute('data-analyticsid', toggleButtonId);
        toggleButton.setAttribute('aria-controls', detailContainerId);

        const eventDate = new Date(event.start);
        toggleButton.innerHTML = `
            <div class="group-first" tab-index="-1">
                <h4 id="event-name-${event.entityId}">${event.name}</h4>
                <time datetime="${eventDate.toISOString()}" id="event-date-${event.entityId}">
                    ${eventDate.toLocaleDateString('default', {
                        day: 'numeric',
                        month: 'short',
                        timeZone: 'Australia/Brisbane',
                    })}
                </date>
            </div>
            <div id="event-venue-${event.entityId}">${event.venue}</div>
        `;

        const detailContainer = eventElement.getElementsByClassName('uq-accordion__content').item(0);
        detailContainer.setAttribute('id', detailContainerId);
        detailContainer.setAttribute('data-testid', detailContainerId);
        detailContainer.setAttribute('aria-labelledby', toggleButtonId);

        const detailElement = document.createElement('training-detail');
        detailElement.setAttribute('id', `training-event-detail-content-${event.entityId}`);
        detailElement.setAttribute('data-testid', `training-event-detail-content-${event.entityId}`);
        detailContainer.appendChild(detailElement);

        let placesRemainingText = 'Booking is not required';
        if (event.bookingSettings !== null) {
            placesRemainingText = 'Class is full. Register for waitlist';

            if (event.bookingSettings.placesRemaining > 0) {
                placesRemainingText = 'Places still available';
            }
        }

        detailElement.data = {
            id: event.entityId,
            name: event.name,
            details: event.details,
            summary: event.summary,
            placesRemaining: placesRemainingText,
            start: event.start,
            end: event.end,
            venue: event.venue,
            userId: (this.account && this.account.id) || '',
            userName: (this.account && this.account.name) || '',
            userEmail: (this.account && this.account.email) || '',
        };
    }

    clearEvents() {
        this.rootElement.innerHTML = '';
    }

    async checkAuthorisedUser() {
        const that = this;
        that.account = {};
        let accountData = {};
        const getStoredUserDetails = setInterval(() => {
            accountData = new ApiAccess().getAccountFromStorage();
            if (
                accountData?.hasOwnProperty('status') &&
                (accountData.status === apiLocale.USER_LOGGED_IN || accountData.status === apiLocale.USER_LOGGED_OUT)
            ) {
                clearInterval(getStoredUserDetails);
                if (accountData.status === apiLocale.USER_LOGGED_IN) {
                    that.account = accountData.account;
                    return true;
                }
                return false;
            }
        }, 100);
    }
}

export default TrainingList;
