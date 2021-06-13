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

const uq = (function (exports) {
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
                            var _this = this;

                            var content = accordion.getNextSibling(el, '.'.concat(this.className, '__content'));
                            el.classList.remove(''.concat(this.className, '__toggle--active'));
                            el.setAttribute('aria-expanded', 'false');
                            content.style.height = '0px';
                            content.addEventListener(
                                'transitionend',
                                function () {
                                    content.classList.remove(''.concat(_this.className, '__content--active'));
                                },
                                {
                                    once: true,
                                },
                            );
                            content.setAttribute('aria-hidden', 'true');
                        },
                },
                {
                    key: 'slideContentDown',
                    /**
                     * Method to hide all other accordion content except for passed element.
                     * @method
                     * @param {HTMLElement} el - Excluded 'Toggler' HTML element.
                     * @param {HTMLElement[]} togglers - List of 'toggler' elements.
                     */
                    value: function slideContentDown(el) {
                        var content = accordion.getNextSibling(el, '.'.concat(this.className, '__content'));
                        el.classList.add(''.concat(this.className, '__toggle--active'));
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
                },
                {
                    key: 'slideUpOthers',
                    /**
                     * Click handler for 'togglers'
                     * @method
                     * @param {HTMLElement[]} togglers - List of 'toggler' elements.
                     */
                    value: function slideUpOthers(el, togglers) {
                        for (var i = 0; i < togglers.length; i++) {
                            if (togglers[i] !== el) {
                                if (togglers[i].classList.contains(''.concat(this.className, '__toggle--active'))) {
                                    this.slideContentUp(togglers[i]);
                                }
                            }
                        }
                    },
                },
                {
                    key: 'handleToggle',
                    value: function handleToggle(togglers) {
                        var _this2 = this;

                        return function (e) {
                            e.preventDefault();

                            let toggler = e.target;
                            while (!toggler.classList.contains(''.concat(_this2.className, '__toggle'))) {
                                toggler = toggler.parentElement;
                            }

                            if (toggler.classList.contains(''.concat(_this2.className, '__toggle--active'))) {
                                _this2.slideContentUp(toggler);
                            } else {
                                _this2.slideContentDown(toggler);

                                _this2.slideUpOthers(toggler, togglers);
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
                        var _this3 = this;

                        document
                            .querySelectorAll('library-training[events-loaded]:not([accordions-active])')
                            .forEach((trainingInstance) => {
                                trainingInstance.setAttribute('accordions-active', '');
                                const document = trainingInstance.shadowRoot.querySelector('training-list').shadowRoot;
                                const accordions = document.querySelectorAll('.'.concat(_this3.className));
                                accordions.forEach(function (el) {
                                    const togglers = el.querySelectorAll('.'.concat(_this3.className, '__toggle'));
                                    togglers.forEach(function (el) {
                                        el.addEventListener('click', _this3.handleToggle(togglers));
                                    });
                                });
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
                            var sibling = el.nextElementSibling;

                            // If there's no selector, return the first sibling
                            if (!selector) {
                                return sibling;
                            }

                            // If the sibling matches our selector, use it
                            // If not, jump to the next sibling and continue the loop
                            while (sibling) {
                                if (sibling.matches(selector)) {
                                    return sibling;
                                }

                                sibling = sibling.nextElementSibling;
                            }
                        },
                },
                {
                    key: 'getPrevSibling',
                    value: function getPrevSibling(el, selector) {
                        // Get the next sibling element
                        var sibling = el.previousElementSibling;

                        // If there's no selector, return the first sibling
                        if (!selector) {
                            return sibling;
                        }

                        // If the sibling matches our selector, use it
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

    exports.accordion = accordion;
    Object.defineProperty(exports, '__esModule', {
        value: true,
    });
    return exports;
})({});

export default uq;
