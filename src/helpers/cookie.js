export function cookieNotFound(cookieId, cookievalue = '') {
    const searchString = `${cookieId}=${cookievalue}`;
    return document.cookie.indexOf(searchString) <= -1;
}

export function cookieFound(cookieId, cookievalue = '') {
    return !cookieNotFound(cookieId, cookievalue);
}
export function getCookieValue(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; ++i) {
        const pair = cookies[i].trim().split('=');
        if (!!pair[0] && pair[0] === name) {
            return !!pair[1] ? pair[1] : /* istanbul ignore next */ undefined;
        }
    }
    /* istanbul ignore next */
    return undefined;
}

export function setCookie(cookieId, cookieValue, expiryDate, strict = false) {
    const endswith = window.location.hostname.endsWith('.library.uq.edu.au');
    const sameSite = endswith && strict ? 'SameSite=None;Secure' : ''; // Add SameSite and Secure for cross-site cookies
    const cookieDomain = endswith ? /* istanbul ignore next */ 'domain=.library.uq.edu.au;path=/' : '';
    document.cookie =
        cookieId + '=' + cookieValue + ';expires=' + expiryDate.toGMTString() + ';' + cookieDomain + ';' + sameSite;
}

export function clearCookie(cookieId) {
    const numHours = -24; // date in the past
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + numHours * 60 * 60 * 1000);

    console.log('clearCookie', cookieId, expiryDate);
    setCookie(cookieId, '; Path=/', expiryDate);
}
