class ApiRoutes {
    CURRENT_ACCOUNT_API() {
        return {
            apiUrl: 'account',
        };
    };
    CURRENT_AUTHOR_API() {
        return {
            apiUrl: 'fez-authors'
        }
    };
    AUTHOR_DETAILS_API(userId) {
        return {
            apiUrl: `authors/details/${userId}`,
        }
    };

    CHAT_API() {
        return {
            apiUrl: 'chat_status',
        };
    };

    LIB_HOURS_API() {
        return {
            apiUrl: 'library_hours/day',
        }
    };

}

export default ApiRoutes;
