class ApiRoutes {
    CURRENT_ACCOUNT_API() {
        return {
            apiUrl: 'account',
        };
    }
    CURRENT_AUTHOR_API() {
        return {
            apiUrl: 'fez-authors',
        };
    }

    CHAT_API() {
        return {
            apiUrl: 'chat_status',
        };
    }

    LIB_HOURS_API() {
        return {
            apiUrl: 'library_hours/day',
        };
    }

    ALERT_API(system = null) {
        return !!system && system.length > 0
            ? {
                  apiUrl: `alerts/current?system=${system}`,
              }
            : {
                  apiUrl: 'alerts/current',
              };
    }

    // Primo Suggestions API
    // https://search.library.uq.edu.au/primaws/rest/pub/suggest?lang=en&q=cows&scope=61UQ_All&vid=61UQ_INST:61UQ
    PRIMO_SUGGESTIONS_API_GENERIC = (keyword) => {
        return {
            apiUrl:
                'https://search.library.uq.edu.au/primaws/rest/pub/suggest?lang=en&q=' +
                keyword +
                '&scope=61UQ_All&vid=61UQ_INST:61UQ' +
                '&wt=json' +
                '&json.wrf=byutv_jsonp_callback_c631f96adec14320b23f1cac342d30f6',
        };
    };

    // Open Athens Check API
    OPEN_ATHENS_LINK_CHECKER = (url) => {
        return {
            apiUrl: 'openathens/check/' + encodeURIComponent(encodeURIComponent(url)),
        };
    };

    EXAMS_SUGGESTIONS_API = (keyword) => ({
        apiUrl: 'exams/suggestions/' + keyword,
    });

    SUGGESTIONS_API_PAST_COURSE = (keyword) => ({
        apiUrl: 'learning_resources/suggestions/' + keyword,
    });

    TRAINING_API() {
        return {
            apiUrl: 'training_events',
        };
    }

    // confirm the user's login, when needed
    SECURE_COLLECTION_CHECK_API = ({ path }) => ({ apiUrl: `file/collection/testlogin/${path}` });

    // get file & folder details file/collection/{folder}/{filePath}
    SECURE_COLLECTION_FILE_API = ({ path }) => ({ apiUrl: `file/collection/${path}?acknowledged` });
}

export default ApiRoutes;
