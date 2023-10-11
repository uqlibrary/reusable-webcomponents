export function getAccountMenuRoot(hostname = null, protocol = null, pathname = null, port = null) {
    // similar logic happens in homepage repo
    const _protocol = protocol === null ? window.location.protocol : protocol;
    const _hostname = hostname === null ? window.location.hostname : hostname;
    let linkRoot = `${_protocol}//www.library.uq.edu.au/`;
    if (_hostname === 'homepage-development.library.uq.edu.au') {
        const _pathname = hostname === null ? window.location.pathname : pathname;
        linkRoot = `${_protocol}//${_hostname}${_pathname}#/`;
    } else if (_hostname === 'homepage-staging.library.uq.edu.au') {
        linkRoot = `${_protocol}//${_hostname}/`;
    } else if (_hostname === 'localhost') {
        const homepagePort = '2020';
        linkRoot = `${_protocol}//${_hostname}:${homepagePort}/`;
    }
    return linkRoot;
}
