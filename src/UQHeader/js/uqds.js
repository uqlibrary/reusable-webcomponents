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
            console.log('create accordion');
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
                        console.log('init accordion');
                        var _this7 = this;

                        if (window.location.hash) {
                            this.hash = window.location.hash;
                        } // Scroll to hash (param string) selected accordion

                        function isHashIgnored() {
                            console.log('isHashIgnored', this.hash);
                            return this.hash === '#keyword=;campus=;weekstart=';
                        }

                        if (this.hash && this.hash !== '' && !isHashIgnored.call(this)) {
                            var hashSelectedContent = document
                                .querySelector('uq-header')
                                .shadowRoot.querySelector(
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

                        var accordions = document
                            .querySelector('uq-header')
                            .shadowRoot.querySelectorAll('.'.concat(this.className));
                        accordions.forEach(function (el) {
                            var togglers = el.querySelectorAll('.'.concat(_this7.className, '__toggle'));
                            togglers.forEach(function (el) {
                                el.addEventListener('click', _this7.handleToggle(togglers));
                            });
                        }); // wrap contents of uq-accordion__content in a wrapper to apply padding and prevent animation jump

                        var accordionContents = document
                            .querySelector('uq-header')
                            .shadowRoot.querySelectorAll('.'.concat(this.className, '__content'));
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
                    console.log('NewHeader el=', el);

                    this.menuToggle = !!el && el.querySelector('.nav-primary__menu-toggle');
                    this.searchToggle = !!el && el.querySelector('.nav-primary__search-toggle');
                    this.searchLabel = !!el && el.querySelector('.search-toggle__label');
                    this.searchBlock = !!el && el.querySelector('.uq-header__search');
                    this.searchInput = !!el && el.querySelector('.uq-header__search-query-input'); // REFACTOR

                    // clicking the uq-header hamburger button clicks the hidden menu button on uq-site-header
                    function clickSiteHeaderMenuButton() {
                        const siteHeader = document.querySelector('uq-site-header');
                        const siteHeaderHiddenMobileButton =
                            !!siteHeader && siteHeader.shadowRoot.getElementById('uq-site-header__navigation-toggle');
                        console.log('clickSiteHeaderMenuButton', siteHeaderHiddenMobileButton);
                        !!siteHeaderHiddenMobileButton && siteHeaderHiddenMobileButton.click();
                    }

                    !!this.menuToggle &&
                        this.menuToggle.addEventListener('click', function () {
                            document.body.classList.toggle('no-scroll');

                            _this.menuToggle.classList.toggle('nav-primary__menu-toggle--is-open');

                            _this.searchToggle.classList.remove('nav-primary__search-toggle--is-open');

                            _this.searchBlock.classList.remove('uq-header__search--is-open');

                            console.log('clicking');
                            clickSiteHeaderMenuButton();
                        });
                    !!this.searchToggle &&
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

    exports.accordion = accordion;
    exports.header = NewHeader;
    Object.defineProperty(exports, '__esModule', {
        value: true,
    });
    return exports;
})({});
