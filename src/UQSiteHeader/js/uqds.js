'use strict';

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

var uq = (function (exports) {
    'use strict';

    function toggleMenu(toggle) {
        var ariaExpanded = toggle.getAttribute('aria-expanded') === 'true';
        var ariaPressed = toggle.getAttribute('aria-pressed') === 'true';
        toggle.classList.toggle(''.concat(this.navClass, '-toggle--close'));
        toggle.setAttribute('aria-expanded', !ariaExpanded);
        toggle.setAttribute('aria-pressed', !ariaPressed);
        var target = this.nav.querySelectorAll('.'.concat(this.level1Class));
        var _this = this;
        target.forEach(function (el) {
            el.classList.toggle(_this.openModifier);
            el.setAttribute('aria-expanded', !ariaExpanded);
            el.setAttribute('aria-pressed', !ariaPressed);
        });
    }

    /**
     * Main Navigation
     * @file Drop down navigation handler.
     */

    var MainNavigation = /*#__PURE__*/ (function () {
        function MainNavigation(nav, navClass) {
            // console.log('MainNavigation navClass=', navClass); // uq-site-header__navigation
            // console.log('MainNavigation nav=', nav); // <nav class="uq-site-header__navigation slide-menu__slider" ... />
            _classCallCheck(this, MainNavigation);

            this.nav = nav;
            this.navClass = navClass;
            this.toggleClass = 'jsNavToggle';
            this.openModifier = ''.concat(this.navClass, '__list--open');
            this.hideModifier = ''.concat(this.navClass, '__list--hidden');
            this.levelOpenModifier = ''.concat(this.navClass, '__list-item--open');
            this.level1Class = ''.concat(this.navClass, '__list--level-1');
            this.level2Class = ''.concat(this.navClass, '__list--level-2');
            this.reverseClass = ''.concat(this.navClass, '__list--reverse');
            this.subNavClass = ''.concat(this.navClass, '__list-item--has-subnav');
            this.subToggleClass = ''.concat(this.navClass, '__sub-toggle');
            this.closeSubLevel = ''.concat(this.navClass, '__list--close');
            this.init = this.init.bind(this);
            this.handleToggle = this.handleToggle.bind(this);
            this.handleMobileToggle = this.handleMobileToggle.bind(this);
            this.handleResize = this.handleResize.bind(this);
            this.setOrientation = this.setOrientation.bind(this);
            this.handleKeyPress = this.handleKeyPress.bind(this);
            this.init();
        }

        _createClass(MainNavigation, [
            {
                key: 'init',
                value: function init() {
                    var _this = this;
                    window.addEventListener('resize', this.handleResize);

                    var mobileToggle = document
                        .querySelector('uq-site-header')
                        .shadowRoot.querySelector('.'.concat(this.toggleClass));
                    mobileToggle.addEventListener('click', this.handleMobileToggle);

                    var subNavItems = this.nav.querySelectorAll('.'.concat(this.subNavClass));
                    subNavItems.forEach(function (item) {
                        _this.setOrientation(item);

                        item.addEventListener('mouseenter', _this.handleToggle);
                        item.addEventListener('mouseleave', _this.handleToggle);
                    });

                    var subNavLinks = this.nav.querySelectorAll('.'.concat(this.subNavClass, ' > a'));
                    subNavLinks.forEach(function (item) {
                        if (window.matchMedia('(min-width: 1024px)').matches) {
                            item.addEventListener('touchend', _this.handleToggle);
                        }
                    });

                    var subNavL2Items = this.nav.querySelectorAll(
                        '.'.concat(this.level2Class, ' .').concat(this.subNavClass),
                    );
                    subNavL2Items.forEach(function (item) {
                        _this.setOrientation(item);

                        item.addEventListener('mouseenter', _this.handleToggle);
                        item.addEventListener('mouseleave', _this.handleToggle);
                    });

                    var subNavL2Links = this.nav.querySelectorAll(
                        '.'.concat(this.level2Class, ' .').concat(this.subNavClass, ' > a'),
                    );
                    subNavL2Links.forEach(function (item) {
                        item.addEventListener('touchend', _this.handleToggle);
                    });

                    var navLinks = this.nav.querySelectorAll('li > a');
                    navLinks.forEach(function (item) {
                        item.addEventListener('keydown', _this.handleKeyPress);
                    });

                    var subNavToggles = this.nav.querySelectorAll('.'.concat(this.subToggleClass));
                    subNavToggles.forEach(function (item) {
                        item.addEventListener('click', _this.handleToggle);
                    });

                    var closeItems = this.nav.querySelectorAll('.'.concat(this.closeSubLevel));
                    closeItems.forEach(function (item) {
                        console.log('1 toggle on back click', item);
                        item.addEventListener('click', _this.handleToggle);
                    });
                    // // closeItems.forEach(function (item) {
                    // //     console.log('2 toggle on back click', item);
                    // //     // _this.setOrientation(item);
                    // //
                    // //     item.addEventListener('click', _this.handleToggle);
                    // //     // item.addEventListener('click', function (e) {
                    // //     //     console.log('back click e', e);
                    // //     //     console.log('back click _this', _this);
                    // //     //     _this.handleToggle();
                    // //     // });
                    // // });
                },
            },
            {
                key: 'handleMobileToggle',
                value: function handleMobileToggle(event) {
                    // this handles the click on the invisible site header menu button that toggles the mobile megamenu display
                    var toggle = event.target;
                    toggleMenu.call(this, toggle);
                },
            },
            {
                key: 'handleResize',
                value: function handleResize(event) {
                    var toggle = document
                        .querySelector('uq-site-header')
                        .shadowRoot.querySelector(`.${this.toggleClass}`);
                    // close the expanded mobile menu if open - otherwise inappropriate classes remain applied
                    var ariaExpanded = toggle.getAttribute('aria-expanded') === 'true';
                    if (!!ariaExpanded) {
                        toggleMenu.call(this, toggle);
                        var topToggleButton = document
                            .querySelector('uq-header')
                            .shadowRoot.getElementById('mobile-menu-toggle-button');
                        var mobileButtonOpenClassName = 'nav-primary__menu-toggle--is-open';
                        !!topToggleButton &&
                            topToggleButton.classList.contains(mobileButtonOpenClassName) &&
                            topToggleButton.classList.remove(mobileButtonOpenClassName);
                    }
                },
            },
            {
                key: 'handleToggle',
                value: function handleToggle(event) {
                    console.log('handleToggle::toggle', event);
                    if (
                        !!event.type &&
                        (event.type === 'mouseenter' || event.type === 'mouseleave') &&
                        window.matchMedia('(max-width: 1024px)').matches
                    ) {
                        return;
                    }

                    var menuItem = event.target;
                    console.log('handleToggle 1::menuItem=', menuItem);

                    if (menuItem.classList.contains('uq-site-header__navigation__list--close')) {
                        console.log(menuItem.tagName, '::we are on a button, go up one');
                        menuItem = menuItem.parentElement.parentElement;
                    }
                    if (menuItem.tagName !== 'LI') {
                        console.log(menuItem.tagName, '::still not an li, go up one');
                        menuItem = menuItem.parentElement;
                    }

                    var subNav = menuItem.querySelector('ul');
                    console.log('handleToggle 2::menuItem=', menuItem);

                    // uq-site-header__navigation__list--close
                    console.log('subNav= ', subNav); // <ul class="uq-site-header__navigation__list uq-site-header__navigation__list--level-2 multicolumn-2 uq-site-header__navigation__list--open
                    console.log('handleToggle::this.openModifier=', this.openModifier);
                    console.log('handleToggle::subNav.classList=', subNav.classList);
                    if (subNav.classList.contains(this.openModifier)) {
                        console.log('handleToggle::closing');
                        this.closeLevel(subNav, menuItem);
                        this.unhideAllLevels();
                    } else {
                        console.log('handleToggle::opening');
                        if (event.type === 'touchend') {
                            event.preventDefault();
                        }

                        this.closeAllLevels();
                        this.hideAllLevels();
                        this.openLevel(subNav, menuItem);
                        this.unhideLevel(menuItem);
                    }
                },
            },
            {
                key: 'openLevel',
                value: function openLevel(subNav, menuItem) {
                    subNav.classList.add(this.openModifier);
                    subNav.classList.contains('menu-undisplayed') && subNav.classList.remove('menu-undisplayed');
                    menuItem.classList.add(this.levelOpenModifier);
                    menuItem.querySelector('a').setAttribute('aria-expanded', 'true');
                    menuItem.querySelector('button').setAttribute('aria-expanded', 'true');
                    menuItem.querySelector('button').setAttribute('aria-pressed', 'true');
                    this.hideMenuitemButton(menuItem);
                },
            },
            {
                key: 'hideMenuitemButton',
                value: function hideMenuitemButton(menuItem) {
                    menuItem.classList.add('mobile_only');
                    const childElement = menuItem.querySelector('a');
                    !childElement.classList.contains('uq-site-header__navigation-link-hidden') &&
                        childElement.classList.add('uq-site-header__navigation-link-hidden');
                },
            },
            {
                key: 'unhideMenuitemButton',
                value: function unhideMenuitemButton(menuItem) {
                    menuItem.classList.remove('mobile_only');
                    const childElement = menuItem.querySelector('a');
                    !!childElement.classList.contains('uq-site-header__navigation-link-hidden') &&
                        childElement.classList.remove('uq-site-header__navigation-link-hidden');
                },
            },
            {
                key: 'closeLevel',
                value: function closeLevel(subNav, menuItem) {
                    subNav.classList.remove(this.openModifier);
                    !subNav.classList.contains('menu-undisplayed') && subNav.classList.add('menu-undisplayed');
                    this.unhideMenuitemButton(menuItem);
                    this.setOrientation(menuItem);
                    menuItem.classList.remove(this.levelOpenModifier);
                    menuItem.querySelector('a').setAttribute('aria-expanded', 'false');
                    menuItem.querySelector('button').setAttribute('aria-expanded', 'false');
                    menuItem.querySelector('button').setAttribute('aria-pressed', 'false');
                    menuItem.parentNode.querySelector('ul').setAttribute('aria-expanded', 'false');
                    menuItem.parentNode.querySelector('ul').setAttribute('aria-pressed', 'false');
                },
            },
            {
                key: 'closeNav',
                value: function closeNav(menuItem) {
                    menuItem.classList.remove(this.openModifier);
                    menuItem.parentNode.querySelector('ul').setAttribute('aria-expanded', 'false');
                    menuItem.parentNode.querySelector('ul').setAttribute('aria-pressed', 'false');
                },
            },
            {
                key: 'closeAllLevels',
                value: function closeAllLevels() {
                    var _this3 = this;

                    var levels = this.nav.querySelectorAll('.'.concat(this.subNavClass));
                    levels.forEach(function (level) {
                        var item = level.querySelector('.'.concat(_this3.level2Class));

                        _this3.closeLevel(item, level);
                    });
                },
            },
            {
                key: 'hideAllLevels',
                value: function hideAllLevels() {
                    var _this4 = this;

                    var levels = this.nav.querySelectorAll('.'.concat(this.subNavClass));
                    levels.forEach(function (level) {
                        _this4.hideLevel(level);
                    });
                },
            },
            {
                key: 'hideLevel',
                value: function hideLevel(level) {
                    !level.classList.contains(this.hideModifier) && level.classList.add(this.hideModifier);
                },
            },
            {
                key: 'unhideAllLevels',
                value: function hideAllLevels() {
                    var _this5 = this;

                    var levels = this.nav.querySelectorAll('.'.concat(this.subNavClass));
                    levels.forEach(function (level) {
                        _this5.unhideLevel(level);
                    });
                },
            },
            {
                key: 'unhideLevel',
                value: function unhideLevel(level) {
                    !!level.classList.contains(this.hideModifier) && level.classList.remove(this.hideModifier);
                },
            },
            {
                key: 'setOrientation',
                value: function setOrientation(item) {
                    var subNav = item.querySelector('.'.concat(this.level2Class));
                    var reverseClass = this.reverseClass;
                    var subNavRight = 0;

                    if (subNav && subNav.getBoundingClientRect()) {
                        subNavRight = subNav.getBoundingClientRect().right;
                    }

                    if (window.innerWidth < subNavRight) {
                        subNav.classList.add(reverseClass);
                    }
                },
            },
            {
                key: 'handleKeyPress',
                value: function handleKeyPress(event) {
                    var parent = event.currentTarget.parentNode;
                    var nav = parent.parentNode;
                    var mobileToggle = document
                        .querySelector('uq-site-header')
                        .shadowRoot.querySelector('.'.concat(this.toggleClass));

                    if (parent === nav.firstElementChild) {
                        // If we shift tab past the first child, toggle this level.
                        if (event.key === 'Tab' && event.shiftKey === true) {
                            if (nav.classList.contains(this.level2Class)) {
                                this.closeLevel(nav, nav.parentNode, subNav);
                                nav.parentNode.classList.remove(this.levelOpenModifier);
                            } else {
                                this.closeNav(nav);
                                mobileToggle.classList.toggle(''.concat(this.navClass, '-toggle--close'));
                                mobileToggle.setAttribute('aria-expanded', 'false');
                                mobileToggle.setAttribute('aria-pressed', 'false');
                            }
                        }
                    } else if (parent === nav.lastElementChild) {
                        // If we tab past the last child, toggle this level.
                        if (event.key === 'Tab' && event.shiftKey === false) {
                            if (nav.classList.contains(this.level2Class)) {
                                this.closeLevel(nav, nav.parentNode);
                                nav.parentNode.classList.remove(this.levelOpenModifier);
                            } else {
                                this.closeNav(nav);
                                mobileToggle.classList.toggle(''.concat(this.navClass, '-toggle--close'));
                                mobileToggle.setAttribute('aria-expanded', 'false');
                                mobileToggle.setAttribute('aria-pressed', 'false');
                            }
                        }
                    } // Toggle nav on Space (32) or any Arrow key (37-40).

                    switch (event.keyCode) {
                        case 32:
                        case 37:
                        case 38:
                        case 39:
                        case 40:
                            event.preventDefault();
                            this.handleToggle(event);
                            break;
                    }
                },
            },
        ]);

        return MainNavigation;
    })();

    function createCommonjsModule(fn, basedir, module) {
        return (
            (module = {
                path: basedir,
                exports: {},
                require: function require(path, base) {
                    return commonjsRequire(path, base === undefined || base === null ? module.path : base);
                },
            }),
            fn(module, module.exports),
            module.exports
        );
    }

    function commonjsRequire() {
        throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    // var ready = createCommonjsModule(function (module) {
    //     /*!
    //      * domready (c) Dustin Diaz 2014 - License MIT
    //      */
    //     !(function (name, definition) {
    //         module.exports = definition();
    //     })('domready', function () {
    //         var fns = [],
    //             _listener,
    //             doc = document,
    //             hack = doc.documentElement.doScroll,
    //             domContentLoaded = 'DOMContentLoaded',
    //             loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);
    //
    //         if (!loaded)
    //             doc.addEventListener(
    //                 domContentLoaded,
    //                 (_listener = function listener() {
    //                     doc.removeEventListener(domContentLoaded, _listener);
    //                     loaded = 1;
    //
    //                     while ((_listener = fns.shift())) {
    //                         _listener();
    //                     }
    //                 }),
    //             );
    //         return function (fn) {
    //             loaded ? setTimeout(fn, 0) : fns.push(fn);
    //         };
    //     });
    // });

    /**
     * Equaliser script extracted and modified from Equalizer
     * (https://github.com/skrajewski/Equalizer).
     * A simple way to keep elements at equal height!
     *
     */

    var gridMenuEqualiser = (function () {
        /**
         * Initial equalizer
         *
         * @param {(String|NodeList)} [blocks="grid-menu--equalised"] - selector
         * string or list of DOM nodes.
         * @constructor
         */
        function gridMenuEqualiser(blocks) {
            if (!blocks) {
                blocks = '.grid-menu--equalised';
            }

            if (!(this instanceof gridMenuEqualiser)) {
                return new gridMenuEqualiser(blocks);
            }

            if (typeof blocks === 'string') {
                this.blocks = document.querySelector('uq-header').shadowRoot.querySelectorAll(blocks);
                return;
            }

            this.blocks = blocks;
        }
        /**
         * Recalculate height of blocks
         */

        gridMenuEqualiser.prototype.align = function () {
            var maxHeight = 0,
                max = this.blocks.length,
                i;

            for (i = 0; i < max; i++) {
                this.blocks[i].style.minHeight = '';
                maxHeight = Math.max(maxHeight, this.blocks[i].clientHeight);
            }

            for (i = 0; i < max; i++) {
                this.blocks[i].style.minHeight = maxHeight + 'px';
            }
        };

        return gridMenuEqualiser;
    })();

    // exports.accordion = accordion;
    exports.gridMenuEqualiser = gridMenuEqualiser;
    exports.siteHeaderNavigation = MainNavigation;
    return exports;
})({});
