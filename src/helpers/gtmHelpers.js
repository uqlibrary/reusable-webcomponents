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
        let linkLabel = 'no label';
        if (e.target?.hasAttribute('textContent')) {
            console.log('linkLabel by textContent');
            linkLabel = e.target?.textContent;
        } else if (!!e.target?.closest('[title]')) {
            console.log('linkLabel by title of closest');
            const parent = e.target?.closest('[title]');
            linkLabel = parent.getAttribute('title');
        } else if (e.target.hasAttribute('innerHTML')) {
            console.log('linkLabel by innerHtml');
            const parent = e.target?.closest('[title]');
            linkLabel = e.target?.innerHTML?.trim();
        }
        console.log('linkLabel=', linkLabel);
        const gtmItems = {
            event: 'gtm.linkClick', //shows as "Link Click" in the sidebar of Tag Assistant
            'gtm.elementId': elementId,
            'gtm.element': linkLabel,
        };
        console.log('sendClickToGTM gtmItems=', gtmItems);
        window.dataLayer.push(gtmItems);
    }
}
