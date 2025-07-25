/**
 * Events aren't sending properly to GTM, provide a generic way to force the Send
 */
export function sendLinkClickToGTM(e) {
    window.dataLayer = window.dataLayer || []; // for tests
    if (!!e) {
        const elementId =
            e.target?.closest('[data-analyticsid]')?.getAttribute('data-analyticsid') ||
            e.target?.id ||
            e.target?.closest('[id]')?.id ||
            'not found';
        const linkLabel = e.target?.textContent?.trim() || e.target?.innerHTML?.trim();
        const gtmItems = {
            event: 'gtm.linkClick', //shows as "Link Click" in the sidebar of Tag Assistant
            'gtm.elementId': elementId,
            'gtm.element': linkLabel, // loads into Form Element
        };
        console.log('sendLinkClickToGTM gtmItems=', gtmItems);
        window.dataLayer.push(gtmItems);
    }
}
