'use strict';

function _typeof(obj) {
    '@babel/helpers - typeof';
    return (
        (_typeof =
            'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                ? function (obj) {
                      return typeof obj;
                  }
                : function (obj) {
                      return obj &&
                          'function' == typeof Symbol &&
                          obj.constructor === Symbol &&
                          obj !== Symbol.prototype
                          ? 'symbol'
                          : typeof obj;
                  }),
        _typeof(obj)
    );
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }
    return obj;
}

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
    Object.defineProperty(Constructor, 'prototype', { writable: false });
    return Constructor;
}

var uq = (function (exports) {
    'use strict';
    /**
     * NewHeader module
     * @file Handles interaction behaviour for the Header. Does not output any
     * HTML elements.
     * TODO: make this class configurable
     */

    var NewHeader = /*#__PURE__*/ (function () {
        function NewHeader(el) {
            _classCallCheck(this, NewHeader);

            this.init(el);
        }

        _createClass(NewHeader, [
            {
                key: 'init',
                value: function init(el) {
                    var _this = this;

                    this.menuToggle = el.querySelector('.nav-primary__menu-toggle');
                    this.searchToggle = el.querySelector('.nav-primary__search-toggle');
                    this.searchLabel = el.querySelector('.search-toggle__label');
                    this.searchBlock = el.querySelector('.uq-header__search');
                    this.searchInput = el.querySelector('.uq-header__search-query-input'); // REFACTOR

                    this.menuToggle.addEventListener('click', function () {
                        document.body.classList.toggle('no-scroll');

                        _this.menuToggle.classList.toggle('nav-primary__menu-toggle--is-open');

                        _this.searchToggle.classList.remove('nav-primary__search-toggle--is-open');

                        _this.searchBlock.classList.remove('uq-header__search--is-open');
                    });
                    this.searchToggle.addEventListener('click', function (e) {
                        document.body.classList.remove('no-scroll');

                        _this.searchToggle.classList.toggle('nav-primary__search-toggle--is-open');

                        _this.searchBlock.classList.toggle('uq-header__search--is-open');

                        _this.menuToggle.classList.remove('nav-primary__menu-toggle--is-open');

                        if (_this.searchBlock.classList.contains('uq-header__search--is-open')) {
                            _this.searchInput.focus();
                        } else {
                            _this.searchInput.blur();

                            _this.searchToggle.blur();
                        }

                        if (_this.searchLabel.innerHTML === 'Search') {
                            _this.searchLabel.innerHTML = 'Close';
                        } else {
                            _this.searchLabel.innerHTML = 'Search';
                        }

                        e.preventDefault();
                    });
                },
            },
        ]);

        return NewHeader;
    })();
    /**
     * Main Navigation
     * @file Drop down navigation handler.
     */

    var MainNavigation = /*#__PURE__*/ (function () {
        function MainNavigation(nav, navClass) {
            _classCallCheck(this, MainNavigation);

            this.nav = nav;
            this.navClass = navClass;
            this.toggleClass = 'jsNavToggle';
            this.openModifier = ''.concat(this.navClass, '__list--open');
            this.levelOpenModifier = ''.concat(this.navClass, '__list-item--open');
            this.level1Class = ''.concat(this.navClass, '__list--level-1');
            this.level2Class = ''.concat(this.navClass, '__list--level-2');
            this.reverseClass = ''.concat(this.navClass, '__list--reverse');
            this.subNavClass = ''.concat(this.navClass, '__list-item--has-subnav');
            this.subToggleClass = ''.concat(this.navClass, '__sub-toggle');
            this.init = this.init.bind(this);
            this.handleToggle = this.handleToggle.bind(this);
            this.handleMobileToggle = this.handleMobileToggle.bind(this);
            this.setOrientation = this.setOrientation.bind(this);
            this.handleKeyPress = this.handleKeyPress.bind(this);
            this.init();
        }

        _createClass(MainNavigation, [
            {
                key: 'init',
                value: function init() {
                    var _this2 = this;

                    var mobileToggle = document.querySelector('.'.concat(this.toggleClass));
                    var subNavItems = this.nav.querySelectorAll('.'.concat(this.subNavClass));
                    var subNavLinks = this.nav.querySelectorAll('.'.concat(this.subNavClass, ' > a'));
                    var subNavL2Items = this.nav.querySelectorAll(
                        '.'.concat(this.level2Class, ' .').concat(this.subNavClass),
                    );
                    var subNavL2Links = this.nav.querySelectorAll(
                        '.'.concat(this.level2Class, ' .').concat(this.subNavClass, ' > a'),
                    );
                    var navLinks = this.nav.querySelectorAll('li > a');
                    var subNavToggles = this.nav.querySelectorAll('.'.concat(this.subToggleClass));
                    mobileToggle.addEventListener('click', this.handleMobileToggle);
                    subNavItems.forEach(function (item) {
                        _this2.setOrientation(item);

                        item.addEventListener('mouseenter', _this2.handleToggle);
                        item.addEventListener('mouseleave', _this2.handleToggle);
                    });
                    subNavLinks.forEach(function (item) {
                        if (window.matchMedia('(min-width: 1024px)').matches) {
                            item.addEventListener('touchend', _this2.handleToggle);
                        }
                    });
                    subNavL2Items.forEach(function (item) {
                        _this2.setOrientation(item);

                        item.addEventListener('mouseenter', _this2.handleToggle);
                        item.addEventListener('mouseleave', _this2.handleToggle);
                    });
                    subNavL2Links.forEach(function (item) {
                        item.addEventListener('touchend', _this2.handleToggle);
                    });
                    navLinks.forEach(function (item) {
                        item.addEventListener('keydown', _this2.handleKeyPress);
                    });
                    subNavToggles.forEach(function (item) {
                        item.addEventListener('click', _this2.handleToggle);
                    });
                },
            },
            {
                key: 'handleMobileToggle',
                value: function handleMobileToggle(event) {
                    var _this3 = this;

                    var toggle = event.target;
                    var target = this.nav.querySelectorAll('.'.concat(this.level1Class));
                    var ariaExpanded = toggle.getAttribute('aria-expanded') === 'true';
                    var ariaPressed = toggle.getAttribute('aria-pressed') === 'true';
                    toggle.classList.toggle(''.concat(this.navClass, '-toggle--close'));
                    toggle.setAttribute('aria-expanded', !ariaExpanded);
                    toggle.setAttribute('aria-pressed', !ariaPressed);
                    target.forEach(function (el) {
                        el.classList.toggle(_this3.openModifier);
                        el.setAttribute('aria-expanded', !ariaExpanded);
                        el.setAttribute('aria-pressed', !ariaPressed);
                    });
                },
            },
            {
                key: 'handleToggle',
                value: function handleToggle(event) {
                    if (
                        (event.type === 'mouseenter' || event.type === 'mouseleave') &&
                        window.matchMedia('(max-width: 1024px)').matches
                    ) {
                        return;
                    }

                    var menuItem = event.target;

                    if (menuItem.tagName !== 'LI') {
                        menuItem = menuItem.parentElement;
                    }

                    var subNav = menuItem.querySelector('ul');

                    if (subNav.classList.contains(this.openModifier)) {
                        this.closeLevel(subNav, menuItem);
                    } else {
                        if (event.type === 'touchend') {
                            event.preventDefault();
                        }

                        this.closeAllLevels();
                        this.openLevel(subNav, menuItem);
                    }
                },
            },
            {
                key: 'openLevel',
                value: function openLevel(subNav, menuItem) {
                    subNav.classList.add(this.openModifier);
                    menuItem.classList.add(this.levelOpenModifier);
                    menuItem.querySelector('a').setAttribute('aria-expanded', 'true');
                    menuItem.querySelector('button').setAttribute('aria-expanded', 'true');
                    menuItem.querySelector('button').setAttribute('aria-pressed', 'true');
                },
            },
            {
                key: 'closeLevel',
                value: function closeLevel(subNav, menuItem) {
                    subNav.classList.remove(this.openModifier);
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
                    var _this4 = this;

                    var levels = this.nav.querySelectorAll('.'.concat(this.subNavClass));
                    levels.forEach(function (level) {
                        var item = level.querySelector('.'.concat(_this4.level2Class));

                        _this4.closeLevel(item, level);
                    });
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
                    var mobileToggle = document.querySelector('.'.concat(this.toggleClass));

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
    /**
     * @file
     * UQ Accordion JS (instantiates an object that controls "accordion" nodes for
     * the entire document). You need to make sure your accordion HTML is correctly
     * formatted and the accompanying SCSS/CSS is loaded as well.
     */

    var accordion = /*#__PURE__*/ (function () {
        /**
         * @constructor
         * @param {String} [className] - Class name of accordion wrappers (optional;
         * default: "accordion").
         */
        function accordion(className) {
            _classCallCheck(this, accordion);

            if (!className) {
                className = 'uq-accordion';
            } else {
                className = className;
            }

            this.className = className;
            this.init();
        }

        _createClass(
            accordion,
            [
                {
                    key: 'slideContentUp',
                    value:
                        /**
                         * Method to hide accordion content
                         * @method
                         * @param {HTMLElement} el - 'Toggler' HTML element.
                         */
                        function slideContentUp(el) {
                            var _this5 = this;

                            var content = accordion.getNextSibling(el, '.'.concat(this.className, '__content'));
                            el.classList.remove(''.concat(this.className, '__toggle--active'));
                            el.parentNode.classList.remove(''.concat(this.className, '__item--is-open'));
                            el.setAttribute('aria-expanded', 'false');
                            content.style.height = '0px';
                            content.addEventListener(
                                'transitionend',
                                function () {
                                    content.classList.remove(''.concat(_this5.className, '__content--active'));
                                },
                                {
                                    once: true,
                                },
                            );
                            content.setAttribute('aria-hidden', 'true');
                        },
                    /**
                     * Method to show accordion content
                     * @method
                     * @param {HTMLElement} el - 'Toggler' HTML element.
                     */
                },
                {
                    key: 'slideContentDown',
                    value: function slideContentDown(el) {
                        var content = accordion.getNextSibling(el, '.'.concat(this.className, '__content'));
                        el.classList.add(''.concat(this.className, '__toggle--active'));
                        el.parentNode.classList.add(''.concat(this.className, '__item--is-open'));
                        el.setAttribute('aria-expanded', 'true');
                        content.classList.add(''.concat(this.className, '__content--active'));
                        content.style.height = 'auto';
                        var height = content.clientHeight + 'px';
                        content.style.height = '0px';
                        setTimeout(function () {
                            content.style.height = height;
                        }, 0);
                        content.setAttribute('aria-hidden', 'false');
                    },
                    /**
                     * Method to hide all other accordion content except for passed element.
                     * @method
                     * @param {HTMLElement} el - Excluded 'Toggler' HTML element.
                     * @param {HTMLElement[]} togglers - List of 'toggler' elements.
                     */
                },
                {
                    key: 'slideUpOthers',
                    value: function slideUpOthers(el, togglers) {
                        for (var i = 0; i < togglers.length; i++) {
                            if (togglers[i] !== el) {
                                if (togglers[i].classList.contains(''.concat(this.className, '__toggle--active'))) {
                                    this.slideContentUp(togglers[i]);
                                }
                            }
                        }
                    },
                    /**
                     * Click handler for 'togglers'
                     * @method
                     * @param {HTMLElement[]} togglers - List of 'toggler' elements.
                     */
                },
                {
                    key: 'handleToggle',
                    value: function handleToggle(togglers) {
                        var _this6 = this;

                        return function (e) {
                            e.preventDefault();
                            var toggle = e.target.closest('.'.concat(_this6.className, '__toggle'));

                            if (toggle.classList.contains(''.concat(_this6.className, '__toggle--active'))) {
                                _this6.slideContentUp(toggle);
                            } else {
                                if (
                                    toggle
                                        .closest('.'.concat(_this6.className))
                                        .classList.contains(''.concat(_this6.className, '--is-manual'))
                                ) {
                                    _this6.slideContentDown(toggle);
                                } else {
                                    _this6.slideContentDown(toggle);

                                    _this6.slideUpOthers(toggle, togglers);
                                }
                            }
                        };
                    },
                    /**
                     * Initialise accordion behavior
                     * @method
                     */
                },
                {
                    key: 'init',
                    value: function init() {
                        var _this7 = this;

                        if (window.location.hash) {
                            this.hash = window.location.hash;
                        } // Scroll to hash (param string) selected accordion

                        if (this.hash && this.hash !== '') {
                            var hashSelectedContent = document.querySelector(
                                ''.concat(this.hash, '.').concat(this.className, '__content'),
                            );

                            if (hashSelectedContent) {
                                // Only apply classes on load when linking directly to an accordion item.
                                var hashSelected = accordion.getPrevSibling(
                                    hashSelectedContent,
                                    '.'.concat(this.className, '__toggle'),
                                );
                                this.slideContentDown(hashSelected); // Scroll to top of selected item.

                                window.scrollTo(0, hashSelected.getBoundingClientRect().top);
                            }
                        }

                        var accordions = document.querySelectorAll('.'.concat(this.className));
                        accordions.forEach(function (el) {
                            var togglers = el.querySelectorAll('.'.concat(_this7.className, '__toggle'));
                            togglers.forEach(function (el) {
                                el.addEventListener('click', _this7.handleToggle(togglers));
                            });
                        }); // wrap contents of uq-accordion__content in a wrapper to apply padding and prevent animation jump

                        var accordionContents = document.querySelectorAll('.'.concat(this.className, '__content'));
                        var accordionName = this.className;
                        accordionContents.forEach(function (accordionContent) {
                            var innerContent = accordionContent.innerHTML;
                            accordionContent.innerHTML = '';
                            var contentWrapper =
                                '<div class ="' + accordionName + '__content-wrapper">'.concat(innerContent, '</div>');
                            accordionContent.innerHTML = contentWrapper;
                        });
                    },
                },
            ],
            [
                {
                    key: 'getNextSibling',
                    value:
                        /**
                         * Method to replace jQuery's .next() method.
                         * See: https://gomakethings.com/finding-the-next-and-previous-sibling-elements-that-match-a-selector-with-vanilla-js/
                         * @static
                         * @param {HTMLElement} el - HTML element.
                         * @param {String} selector - CSS selector string.
                         */
                        function getNextSibling(el, selector) {
                            // Get the next sibling element
                            var sibling = el.nextElementSibling; // If there's no selector, return the first sibling

                            if (!selector) {
                                return sibling;
                            } // If the sibling matches our selector, use it
                            // If not, jump to the next sibling and continue the loop

                            while (sibling) {
                                if (sibling.matches(selector)) {
                                    return sibling;
                                }

                                sibling = sibling.nextElementSibling;
                            }
                        },
                    /**
                     * Method to get previous sibling element.
                     * @static
                     * @param {HTMLElement} el - HTML element.
                     * @param {String} selector - CSS selector string.
                     */
                },
                {
                    key: 'getPrevSibling',
                    value: function getPrevSibling(el, selector) {
                        // Get the next sibling element
                        var sibling = el.previousElementSibling; // If there's no selector, return the first sibling

                        if (!selector) {
                            return sibling;
                        } // If the sibling matches our selector, use it
                        // If not, jump to the next sibling and continue the loop

                        while (sibling) {
                            if (sibling.matches(selector)) {
                                return sibling;
                            }

                            sibling = sibling.previousElementSibling;
                        }
                    },
                },
            ],
        );

        return accordion;
    })();
    /**
     * @file UQ (Automatic Activation) Tabs JS module.
     *
     * You need to make sure your HTML is correctly formatted as per the design
     * system docs and that the accompanying SCSS/CSS is loaded as well.
     *
     * This software includes material copied from or derived from "Example of Tabs
     * with Automatic Activation," (https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/js/tabs.js).
     * Copyright © 2021 W3C® (MIT, ERCIM, Keio, Beihang). Licensed according to the
     * W3C Software License at https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document.
     *
     * @author University of Queensland
     */

    /**
     * Tabs module
     * @module @uqds/tabs
     */

    var Tabs = /*#__PURE__*/ (function () {
        /**
         * @constructor
         * @param {Object} [options] - Configuration object for the tabs
         * @param {HTMLElement} [options.container] - Optional container for tabs and panels
         * @param {String} [options.tabListSelector=.tabs__tab-list] - Selector string of the tab lists
         * @param {String} [options.tabSelector=.tabs__tab] - Selector string of the tabs
         * @param {String} [options.tabPanelSelector=.tabs__tab-panel] - Selector string of the tab panels
         */
        function Tabs(options) {
            _classCallCheck(this, Tabs);

            // Check for valid DOM element as container
            if (
                options !== null &&
                options !== void 0 &&
                options.container &&
                Tabs.isHTMLElement(options === null || options === void 0 ? void 0 : options.container)
            ) {
                this.container = options.container;
            } // Define selectors for working elements

            this.tabListSelector =
                options !== null && options !== void 0 && options.tabListSelector
                    ? options.tabListSelector
                    : '.uq-tabs__tab-list';
            this.tabSelector =
                options !== null && options !== void 0 && options.tabSelector ? options.tabSelector : '.uq-tabs__tab';
            this.tabPanelSelector =
                options !== null && options !== void 0 && options.tabPanelSelector
                    ? options.tabPanelSelector
                    : '.uq-tabs__tab-panel'; // Bind handler method context

            this.clickEventHandler = this.clickEventHandler.bind(this);
            this.keydownEventHandler = this.keydownEventHandler.bind(this);
            this.keyupEventHandler = this.keyupEventHandler.bind(this);
            this.focusEventHandler = this.focusEventHandler.bind(this);
            this.init();
        } // For reference

        _createClass(
            Tabs,
            [
                {
                    key: 'determineDelay',
                    value:
                        /**
                         * Determine whether there should be a delay when user navigates with the
                         * arrow keys
                         * @method
                         */
                        function determineDelay() {
                            var hasDelay = this.tablist.hasAttribute('data-delay');
                            var delay = 0;

                            if (hasDelay) {
                                var delayValue = tablist.getAttribute('data-delay');

                                if (delayValue) {
                                    delay = delayValue;
                                } else {
                                    // If no value is specified, default to 300ms
                                    delay = 300;
                                }
                            }

                            return delay;
                        },
                },
                {
                    key: 'addListeners',
                    value:
                        /**
                         * Bind listeners to tab
                         * @method
                         * @param {Number} index
                         */
                        function addListeners(index) {
                            this.tabs[index].addEventListener('click', this.clickEventHandler);
                            this.tabs[index].addEventListener('keydown', this.keydownEventHandler);
                            this.tabs[index].addEventListener('keyup', this.keyupEventHandler); // Build an array with all tabs (<button>s) in it

                            this.tabs[index].index = index;
                        },
                    /**
                     * When a tab is clicked, activateTab is fired to activate it
                     * @method
                     * @param {Event}
                     */
                },
                {
                    key: 'clickEventHandler',
                    value: function clickEventHandler(event) {
                        var tab = event.target;
                        this.activateTab(tab, false);
                    },
                    /**
                     * Handle keydown on tabs
                     * @method
                     * @param {Event} event
                     */
                },
                {
                    key: 'keydownEventHandler',
                    value: function keydownEventHandler(event) {
                        var key = event.keyCode;

                        switch (key) {
                            case Tabs.keys.end:
                                event.preventDefault(); // Activate last tab

                                this.activateTab(this.tabs[this.tabs.length - 1]);
                                break;

                            case Tabs.keys.home:
                                event.preventDefault(); // Activate first tab

                                this.activateTab(this.tabs[0]);
                                break;
                            // Up and down are in keydown
                            // because we need to prevent page scroll >:)

                            case Tabs.keys.up:
                            case Tabs.keys.down:
                                this.determineOrientation(event);
                                break;
                        }
                    },
                },
                {
                    key: 'keyupEventHandler',
                    value:
                        /**
                         * Handle keyup on tabs
                         * @method
                         * @param {Event} event
                         */
                        function keyupEventHandler(event) {
                            var key = event.keyCode;

                            switch (key) {
                                case Tabs.keys.left:
                                case Tabs.keys.right:
                                    this.determineOrientation(event);
                                    break;
                            }
                        },
                },
                {
                    key: 'determineOrientation',
                    value:
                        /**
                         * When a tablist's aria-orientation is set to vertical, only up and down
                         * arrow should function. In all other cases only left and right arrow
                         * function.
                         * @method
                         * @param {Event} event
                         */
                        function determineOrientation(event) {
                            var key = event.keyCode;
                            var vertical = this.tablist.getAttribute('aria-orientation') == 'vertical';
                            var proceed = false;

                            if (vertical) {
                                if (key === Tabs.keys.up || key === Tabs.keys.down) {
                                    event.preventDefault();
                                    proceed = true;
                                }
                            } else {
                                if (key === Tabs.keys.left || key === Tabs.keys.right) {
                                    proceed = true;
                                }
                            }

                            if (proceed) {
                                this.switchTabOnArrowPress(event);
                            }
                        },
                },
                {
                    key: 'switchTabOnArrowPress',
                    value:
                        /**
                         * Either focus the next, previous, first, or last tab depending on the key
                         * pressed.
                         * @method
                         * @param {Event} event
                         */
                        function switchTabOnArrowPress(event) {
                            var pressed = event.keyCode;

                            for (var x = 0; x < this.tabs.length; x++) {
                                this.tabs[x].addEventListener('focus', this.focusEventHandler);
                            }

                            if (Tabs.direction[pressed]) {
                                var target = event.target;

                                if (target.index !== undefined) {
                                    if (this.tabs[target.index + Tabs.direction[pressed]]) {
                                        this.tabs[target.index + Tabs.direction[pressed]].focus();
                                    } else if (pressed === Tabs.keys.left || pressed === Tabs.keys.up) {
                                        this.focusLastTab();
                                    } else if (pressed === Tabs.keys.right || pressed == Tabs.keys.down) {
                                        this.focusFirstTab();
                                    }
                                }
                            }
                        },
                },
                {
                    key: 'activateTab',
                    value:
                        /**
                         * Activates any given tab panel
                         * @method
                         * @param {HTMLElement} tab
                         * @param {Boolean} setFocus
                         */
                        function activateTab(tab, setFocus) {
                            setFocus = setFocus || true; // Deactivate all other tabs

                            this.deactivateTabs(); // Remove tabindex attribute

                            tab.removeAttribute('tabindex'); // Add class active

                            tab.classList.add('uq-tabs__tab--active'); // Set the tab as selected

                            tab.setAttribute('aria-selected', 'true'); // Get the value of aria-controls (which is an ID)

                            var controls = tab.getAttribute('aria-controls'); // Remove hidden attribute from tab panel to make it visible

                            document.getElementById(controls).removeAttribute('hidden'); // Set focus when required

                            if (setFocus) {
                                tab.focus();
                            }
                        },
                },
                {
                    key: 'deactivateTabs',
                    value:
                        /**
                         * Deactivate all tabs and tab panels
                         * @method
                         */
                        function deactivateTabs() {
                            for (var t = 0; t < this.tabs.length; t++) {
                                this.tabs[t].setAttribute('tabindex', '-1');
                                this.tabs[t].setAttribute('aria-selected', 'false');
                                this.tabs[t].classList.remove('uq-tabs__tab--active');
                                this.tabs[t].removeEventListener('focus', this.focusEventHandler);
                            }

                            for (var p = 0; p < this.panels.length; p++) {
                                this.panels[p].setAttribute('hidden', 'hidden');
                            }
                        },
                },
                {
                    key: 'focusFirstTab',
                    value:
                        /**
                         * Make a guess
                         * @method
                         */
                        function focusFirstTab() {
                            this.tabs[0].focus();
                        },
                },
                {
                    key: 'focusLastTab',
                    value:
                        /**
                         * Make a guess
                         * @method
                         */
                        function focusLastTab() {
                            this.tabs[this.tabs.length - 1].focus();
                        },
                },
                {
                    key: 'focusEventHandler',
                    value:
                        /**
                         * Handle focus on tabs
                         * @method
                         * @param {Event} event
                         */
                        function focusEventHandler(event) {
                            var _this8 = this;

                            var target = event.target;
                            setTimeout(
                                function () {
                                    _this8.checkTabFocus(target);
                                },
                                this.delay,
                                target,
                            );
                        },
                },
                {
                    key: 'checkTabFocus',
                    // Only activate tab on focus if it still has focus after the delay
                    value: function checkTabFocus(target) {
                        var focused = document.activeElement;

                        if (target === focused) {
                            this.activateTab(target, false);
                        }
                    },
                },
                {
                    key: 'init',
                    value:
                        /**
                         * Initialise tabs arrays and such
                         * @method
                         */
                        function init() {
                            var scope = this.container ? this.container : document;
                            this.tablist = scope.querySelector(this.tabListSelector);
                            this.panels = scope.querySelectorAll(this.tabPanelSelector);
                            this.tabs = this.tablist.querySelectorAll(this.tabSelector);
                            this.delay = this.determineDelay(); // Bind listeners

                            for (var i = 0; i < this.tabs.length; ++i) {
                                this.addListeners(i);
                            }
                        },
                },
            ],
            [
                {
                    key: 'isHTMLElement',
                    value:
                        /**
                         * Method to check if an arg is an DOM element.
                         * @static
                         * @param {HTMLElement} obj - DOM element (hopefully) to confirm
                         */
                        function isHTMLElement(obj) {
                            // Returns true if DOM element
                            return (typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) ===
                                'object'
                                ? obj instanceof HTMLElement //DOM2
                                : obj &&
                                      _typeof(obj) === 'object' &&
                                      obj !== null &&
                                      obj.nodeType === 1 &&
                                      typeof obj.nodeName === 'string';
                        },
                },
            ],
        );

        return Tabs;
    })();

    _defineProperty(Tabs, 'keys', {
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
    });

    _defineProperty(Tabs, 'direction', {
        37: -1,
        38: -1,
        39: 1,
        40: 1,
    });

    exports.Tabs = Tabs;
    exports.accordion = accordion;
    exports.header = NewHeader;
    exports.siteHeaderNavigation = MainNavigation;
    Object.defineProperty(exports, '__esModule', {
        value: true,
    });
    return exports;
})({});
