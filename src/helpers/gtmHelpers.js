/**
 * Events aren't sending properly to GTM, provide a generic way to force the Send
 */
export function sendClickToGTM(e) {
    window.dataLayer = window.dataLayer || []; // for tests
    if (!!e) {
        const elementId =
            e.target?.closest('[data-analyticsid]')?.getAttribute('data-analyticsid') ||
            e.target?.id?.trim() ||
            e.target?.closest('[id]')?.id?.trim() ||
            'not found';
        console.log('elementId=', elementId);
        console.log('e.target=', e.target);
        console.log('e.target?.closest([title])=', e.target?.closest('[title]'));
        console.log('e.target?.innerHTML=', e.target?.innerHTML);
        const linkLabel =
            e.target?.textContent?.trim() ||
            e.target?.closest('[title]')?.getAttribute('title') ||
            (e.target.hasAttribute('innerHTML') && e.target?.innerHTML?.trim()) ||
            'no label';
        const gtmItems = {
            event: 'gtm.linkClick', //shows as "Link Click" in the sidebar of Tag Assistant
            'gtm.elementId': elementId,
            'gtm.element': linkLabel,
        };
        console.log('sendClickToGTM gtmItems=', gtmItems);
        window.dataLayer.push(gtmItems);
    }
}
