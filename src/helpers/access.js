export function canSeeEspace(account) {
    return !!account && account.hasOwnProperty('currentAuthor') && !!account.currentAuthor.hasOwnProperty('aut_id');
}

// access controlled via Active Directory (AD)
export function canSeeTestTagAdmin(account) {
    const hasTestTagAdminAccess = (account) =>
        !!account && !!account.groups && account.groups.find((group) => group.includes('lib_libapi_TestTagUsers'));

    return !!account && !!hasTestTagAdminAccess(account);
}

// access controlled via Active Directory (AD)
function hasWebContentAdminAccess(account) {
    return (
        !!account && !!account.groups && account.groups.find((group) => group.includes('lib_libapi_SpotlightAdmins'))
    );
}

export function canSeeAlertsAdmin(account) {
    return !!account && !!hasWebContentAdminAccess(account);
}

export function canSeeSpotlightsAdmin(account) {
    return !!account && !!hasWebContentAdminAccess(account);
}

export function canSeePromopanelAdmin(account) {
    return !!account && !!hasWebContentAdminAccess(account);
}
