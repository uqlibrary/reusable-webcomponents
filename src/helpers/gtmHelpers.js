/**
 * Events aren't sending properly to GTM, provide a generic way to force the Send
 */
export function sendLinkClickToGTM(formObject, desiredElementId, startsWith = false) {
    window.dataLayer = window.dataLayer || []; // for tests
    const linkLabel = !!formObject && !!formObject.target && formObject.target.innerHTML;
    if (!!formObject) {
        const gtmItems = {
            event: 'gtm.linkClick',
            'gtm.elementId': formObject.target.id,
            'gtm.element': linkLabel,
        };
        console.log('sendLinkClickToGTM gtmItems=', gtmItems);
        window.dataLayer.push(gtmItems);
    }
}
