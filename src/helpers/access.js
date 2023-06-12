export function getHomepageLink(hostname = null, protocol = null, port = null, pathname = null) {
    const _protocol = protocol === null ? window.location.protocol : protocol;
    const _hostname = hostname === null ? window.location.hostname : hostname;
    let homepagelink = 'https://www.library.uq.edu.au';
    if (_hostname === 'homepage-development.library.uq.edu.au') {
        const _pathname = pathname === null ? window.location.pathname : pathname;
        homepagelink = `${_protocol}//${_hostname}${_pathname}#/`;
    } else if (_hostname.endsWith('.library.uq.edu.au')) {
        homepagelink = `${_protocol}//${_hostname}`;
    } else if (_hostname === 'localhost') {
        const _port = port === null ? window.location.port : port;
        const linkAppend = '?user=public'; //logged out user
        homepagelink = `${_protocol}//${_hostname}:${_port}/${linkAppend}`;
    }
    return homepagelink;
}

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
