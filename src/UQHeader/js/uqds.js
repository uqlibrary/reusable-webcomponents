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
    for (let i = 0; i < props.length; i++) {
        const descriptor = props[i];
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

function _removeClassFrom(elem, className) {
    !!elem && !!elem.classList.contains(className) && elem.classList.remove(className);
}

function _addClassTo(elem, className) {
    !!elem && !elem.classList.contains(className) && elem.classList.add(className);
}

var uq = (function (exports) {
    'use strict';

    /**
     * NewHeader module
     * @file Handles interaction behaviour for the Header. Does not output any HTML elements.
     * TODO: make this class configurable
     */
    const NewHeader = /*#__PURE__*/ (function () {
        function NewHeader(el) {
            console.log('AD294:: NewHeader constructor', this);
            _classCallCheck(this, NewHeader);

            this.init(el);
        }

        _createClass(NewHeader, [
            {
                key: 'init',
                value: function init(el) {
                    const _this = this;

                    this.mobileMenuToggleButton = !!el && el.querySelector('.nav-primary__menu-toggle');
                    this.siteSearchToggle = !!el && el.querySelector('.nav-primary__search-toggle');
                    this.siteSearchLabel = !!el && el.querySelector('.search-toggle__label');
                    this.siteSearchPanel = !!el && el.querySelector('.uq-header__search');

                    console.log('AD294:: this.searchToggle=', this.searchToggle);

                    // clicking the uq-header hamburger button clicks the hidden menu button on uq-site-header
                    function clickSiteHeaderMenuButton() {
                        const siteHeader = document.querySelector('uq-site-header');
                        const siteHeaderHiddenMobileButton =
                            !!siteHeader && siteHeader.shadowRoot.getElementById('uq-site-header__navigation-toggle');
                        !!siteHeaderHiddenMobileButton && siteHeaderHiddenMobileButton.click();
                    }

                    function openCloseMobileMenu() {
                        // Disable no scroll toggle, which re-enables scrolling for
                        // library page when mobile menu open
                        // document.body.classList.toggle('no-scroll');

                        _this.mobileMenuToggleButton.classList.toggle('nav-primary__menu-toggle--is-open');

                        // hide the site search field, if its open
                        _removeClassFrom(_this.siteSearchToggle, 'nav-primary__search-toggle--is-open');
                        _this.siteSearchLabel.innerHTML = 'Search';

                        _removeClassFrom(_this.siteSearchPanel, 'uq-header__search--is-open');

                        // primo: when the mobile menu is open, hide the menu bar
                        // its the only way to have it not sit on _top_ of the mobile menu :(
                        // NOTE: this code is duplicated in the Resize function of uq-site-header
                        const primoNavbar = document.querySelector('.top-nav-bar.layout-row');
                        if (_this.mobileMenuToggleButton.classList.contains('nav-primary__menu-toggle--is-open')) {
                            !!primoNavbar && (primoNavbar.style.display = 'none');
                        } else {
                            !!primoNavbar && (primoNavbar.style.display = null);
                        }

                        clickSiteHeaderMenuButton();
                    }

                    !!this.mobileMenuToggleButton &&
                        this.mobileMenuToggleButton.addEventListener('click', openCloseMobileMenu);
                },
            },
        ]);

        return NewHeader;
    })();

    exports.header = NewHeader;
    Object.defineProperty(exports, '__esModule', {
        value: true,
    });
    return exports;
})({});
