export function cookieNotFound(cookieId, cookievalue = '') {
    const searchString = `${cookieId}=${cookievalue}`;
    return document.cookie.indexOf(searchString) <= -1;
}

export function getCookieValue(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; ++i) {
        const pair = cookies[i].trim().split('=');
        if (!!pair[0] && pair[0] === name) {
            return !!pair[1] ? pair[1] : /* istanbul ignore next */ undefined;
        }
    }
    return undefined;
}

export function setCookie(cookieId, cookieValue, expiryDate) {
    const cookieDomain = window.location.hostname.endsWith('.library.uq.edu.au')
        ? /* istanbul ignore next */
          'domain=.library.uq.edu.au;path=/'
        : '';
    document.cookie = cookieId + '=' + cookieValue + ';expires=' + expiryDate.toGMTString() + ';' + cookieDomain;
}

// not currently used but left here for completeness of "cookie functions"
/* istanbul ignore next */
export function clearCookie(cookieId) {
    const numHours = -24; // date in the past
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + numHours * 60 * 60 * 1000);

    this.setCookie(cookieId, '', expiryDate);
}
