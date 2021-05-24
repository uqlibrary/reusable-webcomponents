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
}

export default ApiRoutes;
