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

const hasAdGroup = (account, adGroup) => account?.groups?.find((group) => group.includes(adGroup));

export function canSeeTestTag(account) {
    return hasAdGroup(account, 'lib_libapi_TestTagUsers');
}

function hasWebContentAdminAccess(account) {
    return hasAdGroup(account, 'lib_libapi_SpotlightAdmins');
}

export function canSeeAlertsAdmin(account) {
    return hasWebContentAdminAccess(account);
}

// digital learning hub admin access
export function canSeeDlorAdmin(account) {
    return hasAdGroup(account, 'lib_dlor_admins');
}

export function linkToDrupal(pathname, requestedDomainName = null) {
    const domainName = requestedDomainName ?? document.location.hostname;
    // after jan 2025 golive, should be web.library only
    const origin = [
        'localhost',
        'homepage-development.library.uq.edu.au',
        'homepage-staging.library.uq.edu.au',
    ].includes(domainName)
        ? 'https://web-live.library.uq.edu.au'
        : /* istanbul ignore next */ 'https://web.library.uq.edu.au';
    return `${origin}${pathname}`;
}
