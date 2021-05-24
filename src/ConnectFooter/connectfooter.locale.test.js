import { default as locale } from './connectfooter.locale';
import { isAString, isAValidLink } from '../testhelpers';

describe('footerLocale', () => {
    it('should have a valid connect footer locale', () => {
        // because the footer locale is meant to be maintained by the user, we check the file is valid
        expect(locale.connectFooter.buttonSocialHeader.length).not.toBe(0);
        locale.connectFooter.buttonSocial.forEach((menu) => {
            isAString(menu.dataTestid);
            isAValidLink(menu.linkTo);
            isAString(menu.linkMouseOver);
            isAString(menu.iconPath);
            // all the svgs start with M! easy check for 'has the user accidentally cleared this'
            expect(menu.iconPath.startsWith('M')).toBe(true);
        });

        locale.connectFooter.internalLinks.forEach((menu) => {
            isAString(menu.dataTestid);
            isAString(menu.linklabel);
            isAValidLink(menu.linkTo);
        });

        locale.connectFooter.givingLinks.forEach((menu) => {
            isAString(menu.dataTestid);
            isAString(menu.label);
            isAValidLink(menu.linkTo);
        });
    });
});
