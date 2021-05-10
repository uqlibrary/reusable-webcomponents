import { default as menuLocale } from './menu';
import { isAString, isAValidLink } from '../testhelpers';

describe('menuLocale', () => {
    it('should have a valid menu locale', () => {
        // because the menu locale is meant to be maintained by the user, we check the file is valid
        isAString(menuLocale.menuhome.dataTestid);
        isAValidLink(menuLocale.menuhome.linkTo);
        isAString(menuLocale.menuhome.primaryText);

        menuLocale.publicmenu.forEach((menu) => {
            isAString(menu.dataTestid);
            isAValidLink(menu.linkTo);
            isAString(menu.primaryText);
            !menu.secondaryText || isAString(menu.secondaryText);
        });
    });
});
