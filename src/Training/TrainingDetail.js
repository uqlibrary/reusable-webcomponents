import styles from './css/main.css';
import overrides from './css/detail.css';

const template = document.createElement('template');
template.innerHTML = `
  <style>${styles.toString()}</style>
  <style>${overrides.toString()}</style>
  <div class="uq-pane uq-pane--outline uq-pane--has-footer">
    <div class="event-heading purple" id="eventHeading"></div>
    <!--    <div class="details" id="eventSummary"></div>-->
    <div class="details" id="eventDetails" data-testid="eventDetails"></div>
    <div class="details iconRow dateRange" tabindex="0" aria-disabled="false">
        <div class="content-icon">
            <span class="lowlevel-icon">
                <!-- icon date-range -->
                <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                    <g class="iron-icon">
                        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" class="iron-icon"></path>
                    </g>
                </svg>
            </span>
        </div>
        <div>
            <h4>Date</h4>
            <div id="fullDate" data-testid="fullDate"></div>
            <div>
                <span id="startTime" data-testid="startTime"></span> - <span id="endTime" data-testid="endTime"></span>
            </div>
        </div>
    </div>
    <div class="details iconRow locationblock" tabindex="0" aria-disabled="false">
        <div class="content-icon">
            <span class="lowlevel-icon">
                <!-- icon communication:location-on -->
                <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                    <g class="iron-icon">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" class="iron-icon"></path>
                    </g>
                </svg>
            </span>
        </div>
        <div>
            <h4>Location</h4>
            <div id="locationdetails" data-testid="locationdetails"></div>
        </div>
    </div>
    <div class="details iconRow registrationItem" tabindex="0" aria-disabled="false">
        <div class="content-icon">
            <span class="lowlevel-icon">
                <!-- notification:event-available -->
                <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                    <g class="iron-icon">
                        <path d="M16.53 11.06L15.47 10l-4.88 4.88-2.12-2.12-1.06 1.06L10.59 17l5.94-5.94zM19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" class="iron-icon"></path>
                    </g>
                </svg>
            </span>
        </div>
        <div>
            <h4>Registration</h4>
            <div id="bookingText" data-testid="bookingText"></div>
        </div>
    </div>
    <div class="details iconRow nonuqregistration" tabindex="0" aria-disabled="false" id="registrationBlockForNonUQ" data-testid="registrationBlockForNonUQ">
        <div class="content-icon">
            <span class="lowlevel-icon">
                <!-- icon info-outline -->
                <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                    <g class="iron-icon">
                        <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z" class="iron-icon"></path>
                    </g>
                </svg>
            </span>
        </div>
        <div>
            <h4>Library member registration (for non-UQ staff and students)</h4>
            <div>Email 
                <a id="emailEnquiry" href="#" class="uqlibrary-training-details"></a> with your name, UQ username, phone number and the event name and date to reserve a place. We'll email you within 2 business days.
            </div>
        </div>
    </div>
    <div class="uq-pane__footer">
        <button id="bookTraining" data-testid="bookTraining" class="uq-button" role="button" tabindex="0" animated="" aria-disabled="false" elevation="0">Log in and book</button>
    </div>
</div>
`;

class TrainingDetail extends HTMLElement {
    constructor() {
        super();

        this._eventData = {};

        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // Render the template
        shadowDOM.appendChild(template.content.cloneNode(true));
    }

    set data(eventData) {
        this._eventData = eventData;

        this.setupEmailRegistration();
        this.setEventName();
        this.setEventDetails();
        // this.setEventSummary();
        this.setEventLocation();
        this.setBookingText();
        this.setEventDateTime();
        this.addButtonListeners(eventData.id);
    }

    get data() {
        return this._eventData;
    }

    get itemTitleElement() {
        return this.getAttribute('item-title-element') || 'h5';
    }

    addButtonListeners(eventId) {
        const target = this.data.studenthubWindow || '_blank';

        function visitBookingPage(link, target) {
            /* istanbul ignore if */
            if (target === '_self') {
                window.location.assign(link);
            } else {
                window.open(link);
            }
        }

        const bookingLink = `https://studenthub.uq.edu.au/students/events/detail/${eventId}`;

        const bookingButton = this.shadowRoot.getElementById('bookTraining');
        !!bookingButton &&
            bookingButton.addEventListener('click', function () {
                visitBookingPage(bookingLink, target);
            });
    }

    setEventDateTime() {
        const startDate = this.data.start;
        const endDate = this.data.end;

        /* istanbul ignore next */
        if (!startDate || !endDate) {
            return;
        }

        const optionHours = { hour: 'numeric', minute: 'numeric' };
        const startTimeData = this.getStartTimeFormatted(optionHours);
        const startTimeDom = this.shadowRoot.getElementById('startTime');
        !!startTimeData && !!startTimeDom && (startTimeDom.innerText = startTimeData);

        const endDateDate = new Date(endDate);
        const endTimeData = new Intl.DateTimeFormat('en-AU', optionHours).format(endDateDate);
        const endTimeDom = this.shadowRoot.getElementById('endTime');
        !!endTimeData && !!endTimeDom && (endTimeDom.innerText = endTimeData);

        const fullDateData = this.getStartDateFormatted();
        const fullDateDom = this.shadowRoot.getElementById('fullDate');
        !!fullDateData && !!fullDateDom && (fullDateDom.innerText = fullDateData);
    }

    getStartTimeFormatted(optionHours) {
        const startDate = this.data.start;
        /* istanbul ignore next */
        if (!startDate) {
            return '';
        }
        const startDateDate = new Date(startDate);
        return new Intl.DateTimeFormat('en-AU', optionHours).format(startDateDate);
    }

    getStartDateFormatted() {
        const startDate = this.data.start;
        /* istanbul ignore next */
        if (!startDate) {
            return '';
        }
        const startDateDate = new Date(startDate);
        const optionDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('en-AU', optionDate).format(startDateDate);
    }

    setEventName() {
        const eventNameData = this.data.name;
        const eventHeadingDom = this.shadowRoot.getElementById('eventHeading');
        if (!!eventNameData && !!eventHeadingDom) {
            const eventNameEl = document.createElement(this.itemTitleElement);
            eventNameEl.setAttribute('id', 'eventName');
            eventNameEl.setAttribute('data-testid', 'event-name');
            eventNameEl.innerText = eventNameData;
            eventHeadingDom.appendChild(eventNameEl);
        }
    }

    setEventDetails() {
        const eventDetailsData = this.data.details.replace('\n', '<br />');

        const eventDetailsDom = this.shadowRoot.getElementById('eventDetails');
        !!eventDetailsData && !!eventDetailsDom && (eventDetailsDom.innerHTML = eventDetailsData);
    }

    // this seems never to be displayed?
    // setEventSummary() {
    //     let eventSummaryData = this.data.summary;
    //
    //     eventSummaryData = eventSummaryData.replace('\n', '<br />');
    //
    //
    //     const eventSummaryDom = this.shadowRoot.getElementById('eventSummary');
    //     !!eventSummaryData && !!eventSummaryDom && (eventSummaryDom.innerText = eventSummaryData);
    // }

    setBookingText() {
        const placesRemaining = this.data.placesRemaining;
        const bookingTextDom = this.shadowRoot.getElementById('bookingText');
        !!placesRemaining && !!bookingTextDom && (bookingTextDom.innerText = placesRemaining);
    }

    setEventLocation() {
        const venue = this.data.venue;
        /* istanbul ignore next */
        if (!venue) {
            return;
        }
        const venueNameElement = document.createTextNode(venue);

        const locationdetails = this.shadowRoot.getElementById('locationdetails');
        /* istanbul ignore next */
        if (!locationdetails) {
            return;
        }

        const mapUrl = this.findKnownLocationinVenue(venue);
        // const _maplink = mapUrl !== false ? mapUrl : '';
        const _showMapLink = mapUrl !== false;
        if (_showMapLink) {
            const itemLink = document.createElement('a');
            itemLink.setAttribute('href', mapUrl);
            itemLink.setAttribute('target', '_blank');
            itemLink.appendChild(venueNameElement);

            locationdetails.appendChild(itemLink);
        } else {
            locationdetails.appendChild(venueNameElement);
        }
    }

    setupEmailRegistration() {
        const userID = this.data.userId || false;
        const userName = this.data.userName || false;

        const registrationBlockForNonUQDom = this.shadowRoot.getElementById('registrationBlockForNonUQ');

        const showRegistrationForNonUQ = !!userID && !!userName && userID.match(/^em/) !== null;
        if (!!registrationBlockForNonUQDom && !showRegistrationForNonUQ) {
            registrationBlockForNonUQDom.style.display = 'none';
            return;
        }

        const registrationEmail = 'training@library.uq.edu.au';
        const emailEnquiryLink = this.shadowRoot.getElementById('emailEnquiry');
        /* istanbul ignore next */
        if (!emailEnquiryLink) {
            return;
        }
        emailEnquiryLink.setAttribute('href', this.getEmailEnquiryHref(registrationEmail));
        emailEnquiryLink.innerText = registrationEmail;
    }

    getEmailEnquiryHref(registrationEmail) {
        const eventNameData = this.data.name || /* istanbul ignore next */ '';
        const eventIdData = this.data.id || /* istanbul ignore next */ '';
        const eventStartDateData = this.data.start || /* istanbul ignore next */ '';
        const userID = this.data.userId || /* istanbul ignore next */ '';
        const userName = this.data.userName || /* istanbul ignore next */ '';
        const userEmail = this.data.userEmail || /* istanbul ignore next */ '';

        let mailText = 'mailto:' + registrationEmail + '?';
        mailText += '&subject=Expression of interest for event';
        mailText += "&body=Hi, %0D%0AI'd like to participate in the following training event: %0D%0A%0D%0A";
        mailText += 'Event Id: ' + eventIdData + '%0D%0A';
        mailText += 'Event Title: ' + eventNameData + '%0D%0A';

        const optionHours = { hour: 'numeric', minute: 'numeric' };
        mailText +=
            'Event Date: ' +
            this.getStartDateFormatted() +
            ' at ' +
            this.getStartTimeFormatted(optionHours) +
            ' (' +
            eventStartDateData +
            ')' +
            '%0D%0A';
        mailText += 'Username: ' + userID + '%0D%0A';
        mailText += 'Name: ' + userName + '%0D%0A';
        mailText += 'Email: ' + userEmail + '%0D%0A';
        mailText += '%0D%0A%0D%0AThank you' + ',%0D%0A' + userName;

        return mailText;
    }

    /**
     * determine which of the list of buildings the venue is in
     * @param venue String
     * @returns {boolean}
     * @private
     */
    findKnownLocationinVenue(venue) {
        // locationHint: look for this string in the supplied venue
        // campusId: either the UQ Nav building id, or link to Google
        // display: ask Google Maps to display this as text for the location
        // latlong: latitude & longitude for the map url
        // zoom: unused

        var listKnownLocations = [
            {
                locationHint: 'Biological Sciences Library',
                campusId: '406',
                display:
                    'Biological%20Sciences%20Library%2C%20The%20University%20of%20Queensland%2C%20Slip%20Road%2C%20Saint%20Lucia%20QLD%2C%20Australia',
                latlong: '-27.4969967,153.0113495',
                zoom: 20,
                query_place_id: 'ChIJbaJ6sYNQkWsRYvptjIAIPRE',
            },
            {
                locationHint: 'Colin Clark B',
                campusId: '406',
                display: 'Colin%20Clark%20Building%2C%20University%20Drive%2C%20Saint%20Lucia%20QLD%2C%20Australia',
                latlong: '-27.4947559,153.0140859',
                zoom: 20,
            },
            {
                locationHint: 'Duhig Tower',
                campusId: '406',
                display: 'Duhig%20Tower%2C%20Sir%20William%20MacGregor%20Drive%2C%20Saint%20Lucia%20QLD%2C%20Australia',
                latlong: '-27.4966319,153.0144148',
                zoom: 20,
            },
            {
                locationHint: 'Duhig B',
                campusId: '406',
                display: 'Duhig%20Tower%2C%20Sir%20William%20MacGregor%20Drive%2C%20Saint%20Lucia%20QLD%2C%20Australia',
                latlong: '-27.4966319,153.0144148',
                zoom: 20,
            },
            {
                locationHint: 'Forgan Smith B',
                campusId: '406',
                display: 'Forgan%20Smith%20Building%2C%20Saint%20Lucia%20QLD%2C%20Australia',
                latlong: '-27.496937,153.0128046',
                zoom: 20,
            },
            {
                locationHint: 'Hawken B',
                campusId: '406',
                display:
                    'Dorothy%20Hill%20Engineering%20and%20Sciences%20Library%2C%20Cooper%20Road%2C%20Saint%20Lucia%20QLD%2C%20Australia',
                latlong: '-27.5000086,153.0132045',
                zoom: 20,
            },
            {
                locationHint: 'Sir Llew Edwards B',
                campusId: '406',
                display: 'Sir%20Llew%20Edwards%20Building%2C%20Saint%20Lucia%20QLD%2C%20Australia',
                latlong: '-27.4957145,153.0132919',
                zoom: 20,
            },
            {
                locationHint: 'Zelman Cowan B',
                campusId: '406',
                display:
                    'Zelman%20Cowen%20Building%20%2851%23%29%20UQ%20St%20Lucia%20Campus%2C%20Saint%20Lucia%20QLD%2C%20Australia',
                latlong: '-27.4990138,153.0144133',
                zoom: 20,
            },
            {
                locationHint: 'Gatton Library',
                campusId: '467',
                display: '-27.5550314,152.3357461',
                latlong: '-27.55385128412516,152.33587759385',
                zoom: 20,
            }, // UQ+Gatton+J.K.+Murray+Library
            {
                locationHint: 'Herston B',
                campusId: '468',
                display:
                    'Herston%20Health%20Sciences%20Library%2C%20Herston%20Road%2C%20Brisbane%20City%20QLD%2C%20Australia',
                latlong: '-27.4488643,153.0277196',
                zoom: 20,
            },
            {
                locationHint: 'School of Public Health B',
                campusId: '468',
                display: 'UQ%20School%20Of%20Public%20Health%2C%20Herston%20Road%2C%20Herston%20QLD%2C%20Australia',
                latlong: '-27.4487423,153.0231839',
                zoom: 20,
            },
            {
                locationHint: 'UQCCR Building',
                campusId: '468',
                display: 'UQCCR%2C%20Building%20B71%2C%20Brisbane%20City%20QLD%2C%20Australia',
                latlong: '-27.4487067,153.028542',
                zoom: 20,
            },
            {
                locationHint: 'Aubigny Place B',
                campusId: '468',
                display:
                    'Aubigny%20Place%20-%20Mater%20Hospital%20Brisbane%2C%20Annerley%20Road%2C%20South%20Brisbane%20QLD%2C%20Australia',
                latlong: '-27.486558,153.027563',
                zoom: 20,
                placeID: 'ChIJ586ySG1akWsRwlxYji6m8kw',
            },
            {
                locationHint: 'PACE Health Sciences Library',
                campusId: '563',
                display:
                    'PACE%20Health%20Sciences%20Library%2C%20Cornwall%20Street%2C%20Woolloongabba%20QLD%2C%20Australia',
                latlong: '-27.4999636,153.0303293',
                zoom: 19,
            },
            {
                locationHint: 'Bundaberg',
                campusId: 'Google',
                display:
                    'UQ%20Health%20Sciences%20Learning%20%26%20Discovery%20Centre%2C%20Bundaberg%20West%20QLD%2C%20Australia',
                latlong: '-24.8688817,152.3321844',
                zoom: 18,
            },
            {
                locationHint: 'Hervey Bay',
                campusId: 'Google',
                display: '-25.298911,152.8212355',
                latlong: '-25.298911,152.8212355',
                zoom: 20,
            }, // UQ+Health+Sciences+Learning+%26+Discovery+Centre
            {
                locationHint: 'Rockhampton',
                campusId: 'Google',
                display: 'The+University+of+Queensland,+Rural+Clinical+School,+Rockhampton',
                latlong: '-23.3809301,150.496215',
                zoom: 18,
            },
            {
                locationHint: 'Toowoomba',
                campusId: 'Google',
                display:
                    'Toowoomba%20Rural%20Clinical%20School%2C%20152%20West%20Street%2C%20South%20Toowoomba%20QLD%2C%20Australia',
                latlong: '-27.568576,151.9421979',
                zoom: 20,
            },
        ];

        var url = false;
        for (var i = 0; i < listKnownLocations.length; i++) {
            var trainRegExp = new RegExp(listKnownLocations[i].locationHint, 'i');
            if (venue.match(trainRegExp)) {
                url =
                    listKnownLocations[i].campusId === 'Google'
                        ? 'https://www.google.com/maps/search/?api=1&query=' + listKnownLocations[i].display
                        : 'https://maps.uq.edu.au/?zoom=19&campusId=' +
                          listKnownLocations[i].campusId +
                          '&lat=' +
                          listKnownLocations[i].latlong.replace(',', '&lng=') +
                          '&zLevel=1';
                break;
            }
        }
        return url;
    }
}

export default TrainingDetail;
