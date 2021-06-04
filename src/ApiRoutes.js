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

    ALERT_API() {
        return {
            apiUrl: 'alerts/current',
        };
    }

    // Primo Suggestions API
    // https://primo-instant-apac.hosted.exlibrisgroup.com/solr/ac?q=cats&facet=off&fq=scope%3A()%2BAND%2Bcontext%3A(B)&rows=10&wt=json&json.wrf=byutv_jsonp_callback_c631f96adec14320b23f1cac342d30f6&_=2ef82775b72140a6bde04ea6e20012e4
    PRIMO_SUGGESTIONS_API_GENERIC = (keyword) => {
        return {
            apiUrl:
                'https://primo-instant-apac.hosted.exlibrisgroup.com/solr/ac?q=' +
                keyword +
                '&facet=off' +
                '&fq=scope%3A()%2BAND%2Bcontext%3A(B)' +
                '&rows=10' +
                '&wt=json' +
                '&json.wrf=byutv_jsonp_callback_c631f96adec14320b23f1cac342d30f6',
        };
    };

    EXAMS_SUGGESTIONS_API = (keyword) => ({
        apiUrl: 'https://api.library.uq.edu.au/v1/search_suggestions?type=exam_paper&prefix=' + keyword,
    });

    SUGGESTIONS_API_PAST_COURSE = (keyword) => ({
        apiUrl: 'https://api.library.uq.edu.au/v1/search_suggestions?type=learning_resource&prefix=' + keyword,
    });
}

export default ApiRoutes;
