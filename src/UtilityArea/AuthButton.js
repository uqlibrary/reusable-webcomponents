import loggedinstyles from './css/loggedinauth.css';
import loggedoutstyles from './css/loggedoutauth.css';
import ApiAccess from '../ApiAccess/ApiAccess';
import { authLocale } from './auth.locale';
import { isBackTabKeyPressed, isEscapeKeyPressed, isTabKeyPressed } from '../helpers/keyDetection';
import { apiLocale } from '../ApiAccess/ApiAccess.locale';
import {
    canSeeAlertsAdmin,
    canSeeDlorAdmin,
    canSeeEspace,
    canSeeSpringshareAdmin,
    canSeeTestTag,
    linkToDrupal,
} from '../helpers/access';
import { getAccountMenuRoot } from './helpers';

/*
 * usage:
 *  <auth-button />
 *  <auth-button overwriteasloggedout />
 *
 */

// ===============================
// ===============================
//
// IF YOU ARE MASQUERADING YOU WILL SEE ***YOUR*** ADMIN MENU OPTIONS, NOT THOSE OF ThE MASQUERADED USER
// This is because your AD groups are not wiped by the masquerade - we have tried, see repo `auth`
//
// auth button is the place where the api function that writes account etc into session storage is called
// any page that show-hides things based on the account MUST show the auth button web component
//
// ===============================
// ===============================

// THESE LINKS MUST BE DUPLICATED ON PRIMO! (see repo exlibris-primo)
// (NOTE: due to complexity of an account check in primo, we are not showing the espace dashboard link or admin items there)
const authorisedtemplate = document.createElement('template');
authorisedtemplate.innerHTML = `
    <style>${loggedinstyles.toString()}</style>
    <div id="auth" class="auth loggedin">
        <button id="account-option-button" data-testid="account-option-button" data-analyticsid="account-option-button">
            <div id="username-area" data-testid="username-area-label" data-analyticsid="username-area-label" class="username-area">
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <g>
                        <path d="M9 1C11.2222 1 13 2.77778 13 5C13 7.22222 11.2222 9 9 9C6.77778 9 5 7.22222 5 5C5 2.77778 6.77778 1 9 1Z" stroke="#51247A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M1.6001 18.5716C1.6001 14.4685 4.91626 11.1523 9.01932 11.1523C13.1224 11.1523 16.4385 14.4685 16.4385 18.5716" stroke="#51247A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                </svg>
                <span id="username-area-label" data-testid="username-area-label" class="username-area-label"></span>
                <svg id="down-arrow" data-testid="down-arrow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                    <g id="icon/standard/chevron-down-sml">
                        <path id="Chevron-down" d="M7 10L12 15L17 10" stroke="#51247A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                </svg>
                <svg id="up-arrow" data-testid="up-arrow" style="display: none" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <path d="M17 14L12 9L7 14" stroke="#19151C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </button>
        <!-- Menu -->
        <div id="account-options-menu" class="auth-menu" data-testid="account-options-menu" class="account-options-menu account-options-menu-closed" style="display: none;">
            <div class="account-options-menu-list">
                <h2 class="accessible-only">Menu</h2>
                <div class="md-menu-content prm-user-menu-content" role="menu">
                    <ul id="account-menu-list" data-analyticsid="mylibrary-menu-list-public" class="mylibrary-menu-list" role="menu">
                        <!-- Primo account -->
                        <li role="menuitem" aria-disabled="false">
                            <a tabindex="0" data-testid="mylibrary-menu-borrowing" data-analyticsid="mylibrary-menu-borrowing" href="https://search.library.uq.edu.au/primo-explore/login?vid=61UQ&targetURL=https%3A%2F%2Fsearch.library.uq.edu.au%2Fprimo-explore%2Faccount%3Fvid%3D61UQ%26section%3Doverview%26lang%3Den_US" rel="noreferrer" style="padding-top: 0">
                                <svg viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                    <rect width="24" height="24" transform="translate(0 1)" />
                                    <path d="M12 4C14.2222 4 16 5.77778 16 8C16 10.2222 14.2222 12 12 12C9.77778 12 8 10.2222 8 8C8 5.77778 9.77778 4 12 4Z" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M4.59961 21.5716C4.59961 17.4685 7.91578 14.1523 12.0188 14.1523C16.1219 14.1523 19.438 17.4685 19.438 21.5716" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span><span>Library account</span></span>
                            </a>
                        </li>
                                
                        <!-- Primo Favourites -->
                        <li role="menuitem" aria-disabled="false">
                            <a tabindex="0" data-testid="mylibrary-menu-saved-items" data-analyticsid="mylibrary-menu-saved-items" href="https://search.library.uq.edu.au/primo-explore/login?vid=61UQ&targetURL=https%3A%2F%2Fsearch.library.uq.edu.au%2Fprimo-explore%2Ffavorites%3Fvid%3D61UQ%26lang%3Den_US%26section%3Ditems" rel="noreferrer">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                    <rect width="24" height="24" />
                                    <path d="M12.6988 3.43449L14.9056 7.8896C14.9557 8.00269 15.0347 8.10063 15.1345 8.17369C15.2344 8.24675 15.3516 8.29235 15.4746 8.30597L20.3461 9.02767C20.4871 9.04581 20.6201 9.1037 20.7294 9.19458C20.8388 9.28545 20.9201 9.40559 20.9639 9.54094C21.0074 9.67627 21.0117 9.82125 20.9761 9.95891C20.9404 10.0966 20.8663 10.2213 20.7625 10.3184L17.2511 13.802C17.1615 13.8857 17.0942 13.9905 17.0554 14.1069C17.0167 14.2232 17.0075 14.3474 17.0291 14.4682L17.8757 19.3674C17.9001 19.5081 17.8847 19.653 17.831 19.7854C17.7771 19.9178 17.6873 20.0325 17.5717 20.1163C17.456 20.2003 17.3191 20.25 17.1765 20.2598C17.0339 20.2698 16.8915 20.2394 16.7654 20.1724L12.3796 17.8546C12.2673 17.7995 12.1439 17.7708 12.0188 17.7708C11.8936 17.7708 11.7702 17.7995 11.6579 17.8546L7.27219 20.1724C7.14601 20.2394 7.00355 20.2698 6.861 20.2598C6.71845 20.25 6.58153 20.2003 6.46585 20.1163C6.35016 20.0325 6.26034 19.9178 6.2066 19.7854C6.15286 19.653 6.13737 19.5081 6.16188 19.3674L7.00849 14.4127C7.02995 14.2919 7.02087 14.1677 6.98209 14.0514C6.9433 13.935 6.87604 13.8302 6.78643 13.7465L3.23344 10.3184C3.12833 10.2186 3.05441 10.0905 3.02063 9.94953C2.98686 9.80858 2.99468 9.66085 3.04315 9.52425C3.09162 9.38766 3.17866 9.26805 3.29372 9.17991C3.40879 9.09178 3.54694 9.0389 3.69145 9.02767L8.56292 8.30597C8.68589 8.29235 8.80314 8.24675 8.90298 8.17369C9.00281 8.10063 9.08177 8.00269 9.13195 7.8896L11.3387 3.43449C11.3988 3.30474 11.4947 3.19489 11.6153 3.1179C11.7358 3.04091 11.8758 3 12.0188 3C12.1617 3 12.3018 3.04091 12.4223 3.1179C12.5428 3.19489 12.6387 3.30474 12.6988 3.43449Z" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span><span>Favourites</span></span>
                            </a>
                        </li>

                        <!-- Learning resources -->
                        <li role="menuitem" aria-disabled="false">
                            <a tabindex="0" id="mylibrary-menu-course-resources" data-analyticsid="mylibrary-menu-course-resources" data-testid="mylibrary-menu-course-resources" href="https://www.library.uq.edu.au/learning-resources" rel="noreferrer">
                                <svg viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                    <path d="M11.9999 21.4003V6.78587C11.9999 6.78587 9.94278 4.51443 2.99986 4.42871C2.87129 4.42871 2.78558 4.47157 2.69986 4.55728C2.61415 4.643 2.57129 4.72871 2.57129 4.85729V18.5717C2.57129 18.786 2.74272 19.0003 2.99986 19.0003C9.94278 19.1288 11.9999 21.4003 11.9999 21.4003Z" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M9.46999 12.2291C8.05569 11.7577 6.55568 11.4577 5.05566 11.3291" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M9.46999 15.7428C8.05569 15.2713 6.55568 14.9713 5.05566 14.8428" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M14.5293 12.2291C15.9436 11.7577 17.4436 11.4577 18.9436 11.3291" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M14.5293 15.7428C15.9436 15.2713 17.4436 14.9713 18.9436 14.8428" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12.001 21.4003V6.78587C12.001 6.78587 14.0581 4.51443 21.001 4.42871C21.1296 4.42871 21.2153 4.47157 21.3011 4.55728C21.3868 4.643 21.4296 4.72871 21.4296 4.85729V18.5717C21.4296 18.786 21.2582 19.0003 21.001 19.0003C14.0581 19.1288 12.001 21.4003 12.001 21.4003Z" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span><span>Learning resources</span></span>
                            </a>
                        </li>

                        <!-- Printing balance -->
                        <li role="menuitem" aria-disabled="false">
                            <a tabindex="0" data-testid="mylibrary-menu-print-balance" data-analyticsid="mylibrary-menu-print-balance"
                                href="${linkToDrupal('/library-services/it/print-scan-copy/your-printing-account')}"
                                rel="noreferrer">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                    <g clip-path="url(#clip0_1723_14098)">
                                        <path d="M3.01562 12C3.01563 14.3828 3.96219 16.668 5.64709 18.3529C7.33198 20.0378 9.6172 20.9844 12 20.9844C14.3828 20.9844 16.668 20.0378 18.3529 18.3529C20.0378 16.668 20.9844 14.3828 20.9844 12C20.9844 9.6172 20.0378 7.33198 18.3529 5.64709C16.668 3.96219 14.3828 3.01563 12 3.01562C9.6172 3.01563 7.33198 3.96219 5.64709 5.64709C3.96219 7.33198 3.01563 9.6172 3.01562 12Z" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M10.2031 13.7969C10.2031 14.1523 10.3085 14.4997 10.506 14.7952C10.7034 15.0907 10.984 15.321 11.3124 15.457C11.6407 15.593 12.002 15.6286 12.3506 15.5592C12.6991 15.4899 13.0193 15.3188 13.2706 15.0675C13.5219 14.8162 13.693 14.496 13.7623 14.1474C13.8317 13.7989 13.7961 13.4376 13.6601 13.1092C13.5241 12.7809 13.2938 12.5003 12.9983 12.3028C12.7028 12.1054 12.3554 12 12 12C11.6446 12 11.2972 11.8946 11.0017 11.6972C10.7062 11.4997 10.4759 11.2191 10.3399 10.8908C10.2039 10.5624 10.1683 10.2011 10.2377 9.85257C10.307 9.50401 10.4781 9.18384 10.7294 8.93254C10.9807 8.68125 11.3009 8.51011 11.6494 8.44078C11.998 8.37144 12.3593 8.40703 12.6876 8.54303C13.016 8.67903 13.2966 8.90934 13.494 9.20484C13.6915 9.50033 13.7969 9.84774 13.7969 10.2031" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M12 7.20801V8.40592" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M12 15.5938V16.7917" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1723_14098">
                                            <rect width="20" height="20" fill="white" transform="translate(2 2)"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span><span>Print balance</span></span>
                            </a>
                        </li>

                        <!-- Room bookings -->
                        <li role="menuitem" aria-disabled="false">
                            <a tabindex="0" data-testid="mylibrary-menu-room-bookings" data-analyticsid="mylibrary-menu-room-bookings" href="https://uqbookit.uq.edu.au/#/app/booking-types/77b52dde-d704-4b6d-917e-e820f7df07cb" rel="noreferrer">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                    <path d="M4.18907 5.41406H19.8109C20.467 5.41406 21 5.94588 21 6.60043V19.8141C21 20.4686 20.467 21.0004 19.8109 21.0004H4.18907C3.53303 21.0004 3 20.4686 3 19.8141V6.60043C3 5.94588 3.53303 5.41406 4.18907 5.41406Z" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M3 10.2002H20.5399" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M7.79688 7.21364V3" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M16.2441 7.21364V3" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span><span>Book a room or desk</span></span>
                            </a>
                        </li>
                        
                        <!-- eSpace dashboard -->
                        <li data-testid="mylibrary-espace" id="mylibrary-espace" role="menuitem" aria-disabled="false">
                            <a tabindex="0" data-analyticsid="mylibrary-menu-espace-dashboard" href="https://espace.library.uq.edu.au/dashboard" rel="noreferrer">
                                <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.09961 12.7431L6.64248 11.2003C6.94248 10.9003 7.45677 10.9003 7.79963 11.2003L8.7425 12.1431C9.0425 12.4431 9.55679 12.4431 9.89965 12.1431L12.1711 9.87169C12.4711 9.57168 12.9854 9.57168 13.3282 9.87169L15.0854 11.6288C15.3854 11.9288 15.8997 11.9288 16.2426 11.6288L18.9426 8.97168" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M11.8291 3.57129V4.77624" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M3.42844 4.77148H20.5714C21.0429 4.77148 21.4286 5.1572 21.4286 5.62863V17.1573C21.4286 17.6287 21.0429 18.0144 20.5714 18.0144H3.42844C2.95701 18.0144 2.57129 17.6287 2.57129 17.1573V5.62863C2.57129 5.1572 2.95701 4.77148 3.42844 4.77148Z" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12 17.9717V20.5016" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M9.42773 22.4286L11.9992 20.5L14.5706 22.4286" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span><span>UQ eSpace dashboard</span></span>
                            </a>
                        </li>

                        <!-- Feedback -->
                        <li role="menuitem" aria-disabled="false" style="margin-bottom: 8px;">
                            <a tabindex="0" id="mylibrary-menu-feedback" data-testid="mylibrary-menu-feedback" data-analyticsid="mylibrary-menu-feedback" href="https://support.my.uq.edu.au/app/library/feedback" rel="noreferrer">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="24" height="24"/>
                                        <path d="M19.7998 17.3998H11.3999L6.59995 20.9998V17.3998H4.19998C3.88173 17.3998 3.57651 17.2734 3.35147 17.0483C3.12643 16.8233 3 16.5181 3 16.1998V4.19998C3 3.88173 3.12643 3.57651 3.35147 3.35147C3.57651 3.12643 3.88173 3 4.19998 3H19.7998C20.118 3 20.4233 3.12643 20.6483 3.35147C20.8733 3.57651 20.9998 3.88173 20.9998 4.19998V16.1998C20.9998 16.5181 20.8733 16.8233 20.6483 17.0483C20.4233 17.2734 20.118 17.3998 19.7998 17.3998Z" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M6.59961 8.39941H17.3995" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M6.59961 12H14.9995" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span><span>Feedback</span></span>
                            </a>
                        </li>
                        <!-- Logout -->
                        <li role="menuitem" aria-disabled="false" class="logout borderTop" >
                            <button class="logout" type="button" data-analyticsid="auth-button-logout" id="signOutButton">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <g id="Login-1--Streamline-Ultimate 1" clip-path="url(#clip0_1654_3032)">
                                        <path id="Vector" d="M17.0859 9.00293H5.76562" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path id="Vector_2" d="M8.46094 11.6982L5.76562 9.00293L8.46094 6.30762" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path id="Vector_3" d="M11.6954 12.2344V15.4688C11.7077 15.7416 11.6115 16.0081 11.4278 16.2102C11.2441 16.4122 10.9878 16.5333 10.715 16.5469H1.89383C1.62121 16.5331 1.36513 16.412 1.18156 16.2099C0.997988 16.0079 0.901855 15.7414 0.91417 15.4688V2.53125C0.901664 2.25851 0.997731 1.99193 1.18134 1.78987C1.36495 1.5878 1.62114 1.46672 1.89383 1.45312H10.715C10.9878 1.46672 11.2441 1.58778 11.4278 1.78982C11.6115 1.99186 11.7077 2.25844 11.6954 2.53125V5.76562" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1654_3032">
                                            <rect width="18" height="18"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span><span>Log out</span></span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- Screen wrapper -->
        <div id="account-options-pane" data-testid="account-options-pane" aria-hidden="true" class="account-options-pane account-options-pane-closed" style="display: none" />
    </div>
`;
const unauthorisedtemplate = document.createElement('template');
unauthorisedtemplate.innerHTML = `
    <style>${loggedoutstyles.toString()}</style>
    <div class="auth loggedout">
        <button id="auth-button-login" class="login-button" data-testid="auth-button-login" data-analyticsid="auth-button-login">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <g>
                    <path d="M9 1C11.2222 1 13 2.77778 13 5C13 7.22222 11.2222 9 9 9C6.77778 9 5 7.22222 5 5C5 2.77778 6.77778 1 9 1Z" stroke="#51247A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M1.59998 18.5714C1.59998 14.4684 4.91614 11.1522 9.01919 11.1522C13.1222 11.1522 16.4384 14.4684 16.4384 18.5714" stroke="#51247A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
            </svg>
            <span class="auth-log-in-label" data-testid="auth-button-login-label">Log in</span>
        </button>
    </div>
`;

class AuthButton extends HTMLElement {
    constructor() {
        super();
        // Add a shadow DOM
        const shadowDOM = this.attachShadow({ mode: 'open' });

        // if account is the first call then it wipes the session storage and says "Im logged out"
        // we need to call the opening hours api to make authbutton work on first load?!?!?
        // (the askus button used to go first to call hours api before account api,but its been removed)
        // slack fix for mocking: dummy a call to hours
        !!process.env.USE_MOCK && new ApiAccess().loadOpeningHours();

        if (this.isOverwriteAsLoggedOutRequested()) {
            // Render the template
            shadowDOM.appendChild(unauthorisedtemplate.content.cloneNode(true));
            this.addLoginButtonListener(shadowDOM);
            this.addLogoutButtonListeners(shadowDOM);
        } else {
            this.showLoginFromAuthStatus(shadowDOM);
        }

        // Bindings
        this.showLoginFromAuthStatus = this.showLoginFromAuthStatus.bind(this);
        this.addLoginButtonListener = this.addLoginButtonListener.bind(this);
        this.addLogoutButtonListeners = this.addLogoutButtonListeners.bind(this);
        this.addAdminMenuOptions = this.addAdminMenuOptions.bind(this);
        this.displayUserNameAsButtonLabel = this.displayUserNameAsButtonLabel.bind(this);
        this.isOverwriteAsLoggedOutRequested = this.isOverwriteAsLoggedOutRequested.bind(this);
        this.removeEspaceMenuOptionWhenNotAuthor = this.removeEspaceMenuOptionWhenNotAuthor.bind(this);
    }

    async showLoginFromAuthStatus(shadowDOM) {
        await new ApiAccess().loadAccountApi().then((accountFound) => {
            if (!accountFound) {
                shadowDOM.appendChild(unauthorisedtemplate.content.cloneNode(true));
                this.addLoginButtonListener(shadowDOM);
                return;
            }

            const waitOnStorage = setInterval(() => {
                // sometimes it takes a moment before it is readable
                const currentUserDetails = new ApiAccess().getAccountFromStorage();

                const accountIsSet =
                    currentUserDetails.hasOwnProperty('account') &&
                    !!currentUserDetails.account &&
                    currentUserDetails.account.hasOwnProperty('id') &&
                    !!currentUserDetails.account.id;
                if (!!accountIsSet) {
                    clearInterval(waitOnStorage);

                    shadowDOM.appendChild(authorisedtemplate.content.cloneNode(true));
                    const account = currentUserDetails.account;
                    this.displayUserNameAsButtonLabel(shadowDOM, account);
                    this.addAdminMenuOptions(shadowDOM, account);
                    this.removeEspaceMenuOptionWhenNotAuthor(shadowDOM);
                    this.addLogoutButtonListeners(shadowDOM, account);
                } else if (
                    !!currentUserDetails &&
                    currentUserDetails.hasOwnProperty('status') &&
                    currentUserDetails.status === apiLocale.USER_LOGGED_OUT
                ) {
                    // final check to add logged out button - should never happen
                    clearInterval(waitOnStorage);
                    const authButton = document.querySelector('auth-button');
                    const authshadowdom = !!authButton && authButton.shadowRoot;
                    const unauthbutton = !!authshadowdom && authshadowdom.getElementById('auth-button-login');
                    if (!unauthbutton) {
                        shadowDOM.appendChild(unauthorisedtemplate.content.cloneNode(true));
                        this.addLoginButtonListener(shadowDOM);
                    }
                }
            }, 200);
        });
    }

    addAdminMenuOptions(shadowDOM, account) {
        function addAdminMenuOption(elementId, linkId, link, iconPath, linkText, firstEntry) {
            const ulElement = shadowDOM.getElementById('account-menu-list');
            const liElements = ulElement.getElementsByTagName('li');
            const lastLi = liElements[liElements.length - 1];
            const template = document.createElement('template');
            template.innerHTML = `
                <li data-testid="${elementId}" data-analyticsid="${elementId}" id="${elementId}" role="menuitem" aria-disabled="false">
                    <a tabIndex="0" id="${linkId}" data-testid="${linkId}" data-analyticsid="${linkId}"
                       href="${link}" rel="noreferrer">
                        <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                            ${iconPath}
                        </svg>
                        <span><span>${linkText}</span></span>
                    </a>
                </li>`;
            const newLi = template.content.cloneNode(true);
            ulElement.insertBefore(newLi, lastLi); //log out is the final item - insert before it
            if (firstEntry) {
                const li = ulElement.querySelector('#' + elementId);
                !!li && li.classList.add('borderTop');
            }
        }

        // we reset the links in the account menu according to the current branch
        const linkRoot = getAccountMenuRoot();
        const linkAppend = // get the user id for local use
            window.location.hostname === 'localhost' && !!window.location.search ? window.location.search : '';

        // for convenience, rewrite the LR link when we are not in prod
        const learningResourcePageLink = `${linkRoot}learning-resources${linkAppend}`;
        const learningResourceLinkElement = shadowDOM.getElementById('mylibrary-menu-course-resources');
        !!learningResourcePageLink &&
            !!learningResourceLinkElement &&
            learningResourceLinkElement.setAttribute('href', learningResourcePageLink);

        let firstEntry = true;
        if (!!account.canMasquerade) {
            addAdminMenuOption(
                'mylibrary-masquerade',
                'mylibrary-menu-masquerade',
                `${linkRoot}admin/masquerade${linkAppend}`,
                `<path d="M8.22829 5.14258C10.1569 5.14258 11.6997 6.68545 11.6997 8.61403C11.6997 10.5426 10.1569 12.0855 8.22829 12.0855C6.29971 12.0855 4.75684 10.5426 4.75684 8.61403C4.75684 6.68545 6.29971 5.14258 8.22829 5.14258Z" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<path d="M2.57129 18.9853C2.57129 15.8567 5.09988 13.3281 8.22848 13.3281C11.3571 13.3281 13.8857 15.8567 13.8857 18.9853" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<path d="M16.8003 7.6709C18.3431 7.6709 19.6289 8.95662 19.6289 10.4995C19.6289 12.0424 18.3431 13.3281 16.8003 13.3281C15.2574 13.3281 13.9717 12.0424 13.9717 10.4995C13.9717 8.95662 15.2574 7.6709 16.8003 7.6709Z" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<path d="M15.2139 14.6147C17.6139 13.7146 20.2711 14.9575 21.1711 17.3575C21.3425 17.8718 21.4711 18.429 21.4711 18.9433" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
                'Masquerade',
                firstEntry,
            );
            firstEntry = false;
        }

        if (!!canSeeAlertsAdmin(account)) {
            addAdminMenuOption(
                'alerts-admin',
                'mylibrary-menu-alerts-admin',
                `${linkRoot}admin/alerts${linkAppend}`,
                `<circle cx="10" cy="10" r="9.5" stroke="#51247A" fill="none"/>
<path d="M10 5.7998L10 9.7998" stroke="#51247A" stroke-linecap="round" fill="none"/>
<circle cx="9.89981" cy="13.6" r="0.6" fill="#19151C" stroke="#51247A"/>`,
                'Website alerts',
                firstEntry,
            );
            firstEntry = false;
        }

        // pre-done in case spotlights returns. remove in 2026 if not used by then
        //         const canSeeSpotlightsAdmin = () => true;
        //         !!canSeeSpotlightsAdmin(account) &&
        //         addAdminMenuOption(
        //             'spotlights-admin',
        //             'mylibrary-menu-spotlights-admin',
        //             `${linkRoot}admin/spotlights${linkAppend}`,
        //             `<path d="M5.80729 12.5951H4.01042C3.21615 12.5951 2.45441 12.2795 1.89278 11.7179C1.33115 11.1563 1.01563 10.3945 1.01562 9.60026C1.01563 8.80599 1.33115 8.04426 1.89278 7.48262C2.45441 6.92099 3.21615 6.60547 4.01042 6.60547H5.80729V12.5951Z" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        // <path d="M5.80762 12.5951C9.32242 12.5954 12.7585 13.6357 15.6832 15.5851L16.5889 16.1888V3.01172L15.6832 3.61547C12.7585 5.56483 9.32242 6.60517 5.80762 6.60547V12.5951Z" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        // <path d="M18.9844 8.40234V10.7982" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        // <path d="M5.80762 12.5957C5.80711 13.3799 5.96614 14.156 6.27505 14.8768C6.58396 15.5976 7.03628 16.248 7.60449 16.7884" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
        //             'Website spotlights',
        //         );

        if (!!canSeeTestTag(account)) {
            addAdminMenuOption(
                'testTag-admin',
                'mylibrary-menu-testTag-admin',
                `${linkRoot}admin/testntag${linkAppend}`,
                `<path d="M3.81513 2.57129H20.1438C20.8724 2.57129 21.4296 3.12844 21.4296 3.81416V20.1429C21.4296 20.8286 20.8724 21.3857 20.1867 21.3857H3.81513C3.12941 21.4286 2.57227 20.8714 2.57227 20.1857V3.81416C2.57227 3.12844 3.12941 2.57129 3.81513 2.57129Z" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<path d="M12.0002 5.7002L8.22879 10.7145L5.7002 8.18593" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<path d="M13.8857 8.87109H17.6582" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<path d="M12.0002 13.2432L8.22879 18.2575L5.7002 15.7289" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<path d="M13.8857 16.4141H17.6582" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
                'Test and tag',
                firstEntry,
            );
            firstEntry = false;
        }

        if (!!canSeeDlorAdmin(account)) {
            addAdminMenuOption(
                'dlor-admin',
                'mylibrary-menu-dlor-admin',
                `${linkRoot}admin/dlor${linkAppend}`,
                `<path d="M18.9007 7.34277V14.8857C18.9007 15.5714 18.3436 16.1286 17.6578 16.1286H6.34345C5.65773 16.1286 5.10059 15.5714 5.10059 14.8857V7.34277" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<path d="M20.1867 22.4291H3.81513C3.12941 22.4291 2.57227 21.8719 2.57227 21.1862C2.57227 20.9719 2.61512 20.8005 2.70084 20.6291L4.24371 17.5433C4.67228 16.6862 5.52943 16.1719 6.4723 16.1719H17.4867C18.4295 16.1719 19.3295 16.729 19.7153 17.5433L21.2581 20.6291C21.5581 21.2291 21.301 22.0005 20.701 22.3005C20.5724 22.3862 20.3581 22.4291 20.1867 22.4291Z" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<path d="M10.7568 19.9004H13.2868" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<path d="M12.0004 4.9853C12.0004 4.9853 11.6147 3.74243 8.18605 3.61386C7.88605 3.571 7.62891 3.78529 7.62891 4.08529V9.27105C7.67176 9.57105 7.88605 9.78534 8.18605 9.74248C11.6147 9.87105 12.0432 11.1139 12.0432 11.1139M12.0004 4.9853C12.0004 4.9853 12.3861 3.74243 15.8147 3.61386C16.1147 3.571 16.3718 3.78529 16.3718 4.08529V9.27105C16.329 9.57105 16.1147 9.78534 15.8147 9.74248C12.3861 9.87105 11.9575 11.1139 11.9575 11.1139V4.9853H12.0004Z" stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<path d="M40.3984 18H38.0234L38.0391 16.7734H40.3984C41.2109 16.7734 41.888 16.6042 42.4297 16.2656C42.9714 15.9219 43.3776 15.4427 43.6484 14.8281C43.9245 14.2083 44.0625 13.4844 44.0625 12.6562V11.9609C44.0625 11.3099 43.9844 10.7318 43.8281 10.2266C43.6719 9.71615 43.4427 9.28646 43.1406 8.9375C42.8385 8.58333 42.4688 8.3151 42.0312 8.13281C41.599 7.95052 41.1016 7.85938 40.5391 7.85938H37.9766V6.625H40.5391C41.2839 6.625 41.9635 6.75 42.5781 7C43.1927 7.24479 43.7214 7.60156 44.1641 8.07031C44.612 8.53385 44.9557 9.09635 45.1953 9.75781C45.4349 10.4141 45.5547 11.1536 45.5547 11.9766V12.6562C45.5547 13.4792 45.4349 14.2214 45.1953 14.8828C44.9557 15.5391 44.6094 16.099 44.1562 16.5625C43.7083 17.026 43.1667 17.3828 42.5312 17.6328C41.901 17.8776 41.1901 18 40.3984 18ZM38.8281 6.625V18H37.3203V6.625H38.8281ZM49.3319 9.54688V18H47.8787V9.54688H49.3319ZM47.7694 7.30469C47.7694 7.07031 47.8397 6.8724 47.9803 6.71094C48.1261 6.54948 48.3397 6.46875 48.6209 6.46875C48.897 6.46875 49.1079 6.54948 49.2537 6.71094C49.4048 6.8724 49.4803 7.07031 49.4803 7.30469C49.4803 7.52865 49.4048 7.72135 49.2537 7.88281C49.1079 8.03906 48.897 8.11719 48.6209 8.11719C48.3397 8.11719 48.1261 8.03906 47.9803 7.88281C47.8397 7.72135 47.7694 7.52865 47.7694 7.30469ZM57.2887 9.54688H58.6012V17.8203C58.6012 18.5651 58.4502 19.2005 58.1481 19.7266C57.846 20.2526 57.4242 20.651 56.8825 20.9219C56.346 21.1979 55.7262 21.3359 55.0231 21.3359C54.7315 21.3359 54.3877 21.2891 53.9919 21.1953C53.6012 21.1068 53.2158 20.9531 52.8356 20.7344C52.4606 20.5208 52.1455 20.2318 51.8903 19.8672L52.6481 19.0078C53.0023 19.4349 53.3721 19.7318 53.7575 19.8984C54.1481 20.0651 54.5335 20.1484 54.9137 20.1484C55.3721 20.1484 55.7679 20.0625 56.1012 19.8906C56.4346 19.7188 56.6924 19.4635 56.8747 19.125C57.0622 18.7917 57.1559 18.3802 57.1559 17.8906V11.4062L57.2887 9.54688ZM51.4684 13.8672V13.7031C51.4684 13.0573 51.544 12.4714 51.695 11.9453C51.8512 11.4141 52.0726 10.9583 52.3591 10.5781C52.6507 10.1979 53.0023 9.90625 53.4137 9.70312C53.8252 9.49479 54.2887 9.39062 54.8044 9.39062C55.3356 9.39062 55.7992 9.48438 56.195 9.67188C56.596 9.85417 56.9346 10.1224 57.2106 10.4766C57.4919 10.8255 57.7132 11.2474 57.8747 11.7422C58.0361 12.237 58.1481 12.7969 58.2106 13.4219V14.1406C58.1533 14.7604 58.0414 15.3177 57.8747 15.8125C57.7132 16.3073 57.4919 16.7292 57.2106 17.0781C56.9346 17.4271 56.596 17.6953 56.195 17.8828C55.794 18.0651 55.3252 18.1562 54.7887 18.1562C54.2835 18.1562 53.8252 18.0495 53.4137 17.8359C53.0075 17.6224 52.6585 17.3229 52.3669 16.9375C52.0752 16.5521 51.8512 16.099 51.695 15.5781C51.544 15.0521 51.4684 14.4818 51.4684 13.8672ZM52.9137 13.7031V13.8672C52.9137 14.2891 52.9554 14.6849 53.0387 15.0547C53.1273 15.4245 53.2601 15.75 53.4372 16.0312C53.6195 16.3125 53.8512 16.5339 54.1325 16.6953C54.4137 16.8516 54.7497 16.9297 55.1403 16.9297C55.6195 16.9297 56.0153 16.8281 56.3278 16.625C56.6403 16.4219 56.8877 16.1536 57.07 15.8203C57.2575 15.487 57.4033 15.125 57.5075 14.7344V12.8516C57.4502 12.5651 57.3617 12.2891 57.2419 12.0234C57.1273 11.7526 56.9762 11.513 56.7887 11.3047C56.6065 11.0911 56.3799 10.9219 56.1091 10.7969C55.8382 10.6719 55.5205 10.6094 55.1559 10.6094C54.7601 10.6094 54.419 10.6927 54.1325 10.8594C53.8512 11.0208 53.6195 11.2448 53.4372 11.5312C53.2601 11.8125 53.1273 12.1406 53.0387 12.5156C52.9554 12.8854 52.9137 13.2812 52.9137 13.7031ZM62.5269 9.54688V18H61.0737V9.54688H62.5269ZM60.9644 7.30469C60.9644 7.07031 61.0347 6.8724 61.1753 6.71094C61.3211 6.54948 61.5347 6.46875 61.8159 6.46875C62.092 6.46875 62.3029 6.54948 62.4487 6.71094C62.5998 6.8724 62.6753 7.07031 62.6753 7.30469C62.6753 7.52865 62.5998 7.72135 62.4487 7.88281C62.3029 8.03906 62.092 8.11719 61.8159 8.11719C61.5347 8.11719 61.3211 8.03906 61.1753 7.88281C61.0347 7.72135 60.9644 7.52865 60.9644 7.30469ZM68.5462 9.54688V10.6562H63.9759V9.54688H68.5462ZM65.5228 7.49219H66.9681V15.9062C66.9681 16.1927 67.0124 16.4089 67.1009 16.5547C67.1895 16.7005 67.3041 16.7969 67.4447 16.8438C67.5853 16.8906 67.7364 16.9141 67.8978 16.9141C68.0176 16.9141 68.1426 16.9036 68.2728 16.8828C68.4082 16.8568 68.5098 16.8359 68.5775 16.8203L68.5853 18C68.4707 18.0365 68.3197 18.0703 68.1322 18.1016C67.9499 18.138 67.7285 18.1562 67.4681 18.1562C67.114 18.1562 66.7884 18.0859 66.4916 17.9453C66.1947 17.8047 65.9577 17.5703 65.7806 17.2422C65.6087 16.9089 65.5228 16.4609 65.5228 15.8984V7.49219ZM75.3859 16.5547V12.2031C75.3859 11.8698 75.3182 11.5807 75.1828 11.3359C75.0526 11.0859 74.8547 10.8932 74.5891 10.7578C74.3234 10.6224 73.9953 10.5547 73.6047 10.5547C73.2401 10.5547 72.9198 10.6172 72.6437 10.7422C72.3729 10.8672 72.1594 11.0312 72.0031 11.2344C71.8521 11.4375 71.7766 11.6562 71.7766 11.8906H70.3312C70.3312 11.5885 70.4094 11.2891 70.5656 10.9922C70.7219 10.6953 70.9458 10.4271 71.2375 10.1875C71.5344 9.94271 71.8885 9.75 72.3 9.60938C72.7167 9.46354 73.1802 9.39062 73.6906 9.39062C74.3052 9.39062 74.8469 9.49479 75.3156 9.70312C75.7896 9.91146 76.1594 10.2266 76.425 10.6484C76.6958 11.0651 76.8312 11.5885 76.8312 12.2188V16.1562C76.8312 16.4375 76.8547 16.737 76.9016 17.0547C76.9536 17.3724 77.0292 17.6458 77.1281 17.875V18H75.6203C75.5474 17.8333 75.4901 17.612 75.4484 17.3359C75.4068 17.0547 75.3859 16.7943 75.3859 16.5547ZM75.6359 12.875L75.6516 13.8906H74.1906C73.7792 13.8906 73.412 13.9245 73.0891 13.9922C72.7661 14.0547 72.4953 14.151 72.2766 14.2812C72.0578 14.4115 71.8911 14.5755 71.7766 14.7734C71.662 14.9661 71.6047 15.1927 71.6047 15.4531C71.6047 15.7188 71.6646 15.9609 71.7844 16.1797C71.9042 16.3984 72.0839 16.5729 72.3234 16.7031C72.5682 16.8281 72.8677 16.8906 73.2219 16.8906C73.6646 16.8906 74.0552 16.7969 74.3937 16.6094C74.7323 16.4219 75.0005 16.1927 75.1984 15.9219C75.4016 15.651 75.5109 15.388 75.5266 15.1328L76.1437 15.8281C76.1073 16.0469 76.0083 16.2891 75.8469 16.5547C75.6854 16.8203 75.4693 17.0755 75.1984 17.3203C74.9328 17.5599 74.6151 17.7604 74.2453 17.9219C73.8807 18.0781 73.4693 18.1562 73.0109 18.1562C72.438 18.1562 71.9354 18.0443 71.5031 17.8203C71.076 17.5964 70.7427 17.2969 70.5031 16.9219C70.2687 16.5417 70.1516 16.1172 70.1516 15.6484C70.1516 15.1953 70.2401 14.7969 70.4172 14.4531C70.5943 14.1042 70.8495 13.8151 71.1828 13.5859C71.5161 13.3516 71.9172 13.1745 72.3859 13.0547C72.8547 12.9349 73.3781 12.875 73.9562 12.875H75.6359ZM80.835 6V18H79.3819V6H80.835ZM89.0144 6V18H87.5612V6H89.0144ZM95.0025 18.1562C94.414 18.1562 93.8801 18.0573 93.4009 17.8594C92.927 17.6562 92.5181 17.3724 92.1744 17.0078C91.8358 16.6432 91.5754 16.2109 91.3931 15.7109C91.2108 15.2109 91.1197 14.6641 91.1197 14.0703V13.7422C91.1197 13.0547 91.2212 12.4427 91.4244 11.9062C91.6275 11.3646 91.9035 10.9062 92.2525 10.5312C92.6015 10.1562 92.9973 9.8724 93.44 9.67969C93.8827 9.48698 94.341 9.39062 94.815 9.39062C95.4192 9.39062 95.94 9.49479 96.3775 9.70312C96.8202 9.91146 97.1822 10.2031 97.4634 10.5781C97.7447 10.9479 97.953 11.3854 98.0884 11.8906C98.2239 12.3906 98.2916 12.9375 98.2916 13.5312V14.1797H91.9791V13H96.8462V12.8906C96.8254 12.5156 96.7473 12.151 96.6119 11.7969C96.4817 11.4427 96.2733 11.151 95.9869 10.9219C95.7004 10.6927 95.3098 10.5781 94.815 10.5781C94.4869 10.5781 94.1848 10.6484 93.9087 10.7891C93.6327 10.9245 93.3957 11.1276 93.1978 11.3984C92.9999 11.6693 92.8462 12 92.7369 12.3906C92.6275 12.7812 92.5728 13.2318 92.5728 13.7422V14.0703C92.5728 14.4714 92.6275 14.849 92.7369 15.2031C92.8515 15.5521 93.0155 15.8594 93.2291 16.125C93.4478 16.3906 93.7108 16.599 94.0181 16.75C94.3306 16.901 94.6848 16.9766 95.0806 16.9766C95.591 16.9766 96.0233 16.8724 96.3775 16.6641C96.7317 16.4557 97.0416 16.1771 97.3072 15.8281L98.1822 16.5234C97.9999 16.7995 97.7681 17.0625 97.4869 17.3125C97.2056 17.5625 96.8593 17.7656 96.4478 17.9219C96.0416 18.0781 95.5598 18.1562 95.0025 18.1562ZM105.123 16.5547V12.2031C105.123 11.8698 105.056 11.5807 104.92 11.3359C104.79 11.0859 104.592 10.8932 104.327 10.7578C104.061 10.6224 103.733 10.5547 103.342 10.5547C102.978 10.5547 102.657 10.6172 102.381 10.7422C102.11 10.8672 101.897 11.0312 101.741 11.2344C101.59 11.4375 101.514 11.6562 101.514 11.8906H100.069C100.069 11.5885 100.147 11.2891 100.303 10.9922C100.459 10.6953 100.683 10.4271 100.975 10.1875C101.272 9.94271 101.626 9.75 102.037 9.60938C102.454 9.46354 102.918 9.39062 103.428 9.39062C104.043 9.39062 104.584 9.49479 105.053 9.70312C105.527 9.91146 105.897 10.2266 106.162 10.6484C106.433 11.0651 106.569 11.5885 106.569 12.2188V16.1562C106.569 16.4375 106.592 16.737 106.639 17.0547C106.691 17.3724 106.767 17.6458 106.866 17.875V18H105.358C105.285 17.8333 105.228 17.612 105.186 17.3359C105.144 17.0547 105.123 16.7943 105.123 16.5547ZM105.373 12.875L105.389 13.8906H103.928C103.517 13.8906 103.149 13.9245 102.827 13.9922C102.504 14.0547 102.233 14.151 102.014 14.2812C101.795 14.4115 101.629 14.5755 101.514 14.7734C101.399 14.9661 101.342 15.1927 101.342 15.4531C101.342 15.7188 101.402 15.9609 101.522 16.1797C101.642 16.3984 101.821 16.5729 102.061 16.7031C102.306 16.8281 102.605 16.8906 102.959 16.8906C103.402 16.8906 103.793 16.7969 104.131 16.6094C104.47 16.4219 104.738 16.1927 104.936 15.9219C105.139 15.651 105.248 15.388 105.264 15.1328L105.881 15.8281C105.845 16.0469 105.746 16.2891 105.584 16.5547C105.423 16.8203 105.207 17.0755 104.936 17.3203C104.67 17.5599 104.353 17.7604 103.983 17.9219C103.618 18.0781 103.207 18.1562 102.748 18.1562C102.176 18.1562 101.673 18.0443 101.241 17.8203C100.814 17.5964 100.48 17.2969 100.241 16.9219C100.006 16.5417 99.8891 16.1172 99.8891 15.6484C99.8891 15.1953 99.9776 14.7969 100.155 14.4531C100.332 14.1042 100.587 13.8151 100.92 13.5859C101.254 13.3516 101.655 13.1745 102.123 13.0547C102.592 12.9349 103.116 12.875 103.694 12.875H105.373ZM110.448 10.875V18H109.002V9.54688H110.408L110.448 10.875ZM113.088 9.5L113.08 10.8438C112.961 10.8177 112.846 10.8021 112.737 10.7969C112.632 10.7865 112.513 10.7812 112.377 10.7812C112.044 10.7812 111.75 10.8333 111.494 10.9375C111.239 11.0417 111.023 11.1875 110.846 11.375C110.669 11.5625 110.528 11.7865 110.424 12.0469C110.325 12.3021 110.26 12.5833 110.229 12.8906L109.823 13.125C109.823 12.6146 109.872 12.1354 109.971 11.6875C110.075 11.2396 110.234 10.8438 110.448 10.5C110.661 10.151 110.932 9.88021 111.26 9.6875C111.593 9.48958 111.989 9.39062 112.448 9.39062C112.552 9.39062 112.671 9.40365 112.807 9.42969C112.942 9.45052 113.036 9.47396 113.088 9.5ZM116.029 11.3516V18H114.584V9.54688H115.951L116.029 11.3516ZM115.686 13.4531L115.084 13.4297C115.089 12.8516 115.175 12.3177 115.342 11.8281C115.509 11.3333 115.743 10.9036 116.045 10.5391C116.347 10.1745 116.706 9.89323 117.123 9.69531C117.545 9.49219 118.011 9.39062 118.522 9.39062C118.938 9.39062 119.313 9.44792 119.647 9.5625C119.98 9.67188 120.264 9.84896 120.498 10.0938C120.738 10.3385 120.92 10.6562 121.045 11.0469C121.17 11.4323 121.232 11.9036 121.232 12.4609V18H119.779V12.4453C119.779 12.0026 119.714 11.6484 119.584 11.3828C119.454 11.112 119.264 10.9167 119.014 10.7969C118.764 10.6719 118.456 10.6094 118.092 10.6094C117.732 10.6094 117.404 10.6849 117.107 10.8359C116.816 10.987 116.563 11.1953 116.35 11.4609C116.141 11.7266 115.977 12.0312 115.857 12.375C115.743 12.7135 115.686 13.0729 115.686 13.4531ZM125.158 9.54688V18H123.705V9.54688H125.158ZM123.596 7.30469C123.596 7.07031 123.666 6.8724 123.807 6.71094C123.952 6.54948 124.166 6.46875 124.447 6.46875C124.723 6.46875 124.934 6.54948 125.08 6.71094C125.231 6.8724 125.307 7.07031 125.307 7.30469C125.307 7.52865 125.231 7.72135 125.08 7.88281C124.934 8.03906 124.723 8.11719 124.447 8.11719C124.166 8.11719 123.952 8.03906 123.807 7.88281C123.666 7.72135 123.596 7.52865 123.596 7.30469ZM129.084 11.3516V18H127.638V9.54688H129.006L129.084 11.3516ZM128.74 13.4531L128.138 13.4297C128.144 12.8516 128.23 12.3177 128.396 11.8281C128.563 11.3333 128.797 10.9036 129.099 10.5391C129.401 10.1745 129.761 9.89323 130.177 9.69531C130.599 9.49219 131.066 9.39062 131.576 9.39062C131.993 9.39062 132.368 9.44792 132.701 9.5625C133.034 9.67188 133.318 9.84896 133.552 10.0938C133.792 10.3385 133.974 10.6562 134.099 11.0469C134.224 11.4323 134.287 11.9036 134.287 12.4609V18H132.834V12.4453C132.834 12.0026 132.769 11.6484 132.638 11.3828C132.508 11.112 132.318 10.9167 132.068 10.7969C131.818 10.6719 131.511 10.6094 131.146 10.6094C130.787 10.6094 130.459 10.6849 130.162 10.8359C129.87 10.987 129.618 11.1953 129.404 11.4609C129.196 11.7266 129.032 12.0312 128.912 12.375C128.797 12.7135 128.74 13.0729 128.74 13.4531ZM142.119 9.54688H143.431V17.8203C143.431 18.5651 143.28 19.2005 142.978 19.7266C142.676 20.2526 142.254 20.651 141.713 20.9219C141.176 21.1979 140.556 21.3359 139.853 21.3359C139.561 21.3359 139.218 21.2891 138.822 21.1953C138.431 21.1068 138.046 20.9531 137.666 20.7344C137.291 20.5208 136.976 20.2318 136.72 19.8672L137.478 19.0078C137.832 19.4349 138.202 19.7318 138.588 19.8984C138.978 20.0651 139.364 20.1484 139.744 20.1484C140.202 20.1484 140.598 20.0625 140.931 19.8906C141.265 19.7188 141.522 19.4635 141.705 19.125C141.892 18.7917 141.986 18.3802 141.986 17.8906V11.4062L142.119 9.54688ZM136.298 13.8672V13.7031C136.298 13.0573 136.374 12.4714 136.525 11.9453C136.681 11.4141 136.903 10.9583 137.189 10.5781C137.481 10.1979 137.832 9.90625 138.244 9.70312C138.655 9.49479 139.119 9.39062 139.634 9.39062C140.166 9.39062 140.629 9.48438 141.025 9.67188C141.426 9.85417 141.765 10.1224 142.041 10.4766C142.322 10.8255 142.543 11.2474 142.705 11.7422C142.866 12.237 142.978 12.7969 143.041 13.4219V14.1406C142.983 14.7604 142.871 15.3177 142.705 15.8125C142.543 16.3073 142.322 16.7292 142.041 17.0781C141.765 17.4271 141.426 17.6953 141.025 17.8828C140.624 18.0651 140.155 18.1562 139.619 18.1562C139.114 18.1562 138.655 18.0495 138.244 17.8359C137.838 17.6224 137.489 17.3229 137.197 16.9375C136.905 16.5521 136.681 16.099 136.525 15.5781C136.374 15.0521 136.298 14.4818 136.298 13.8672ZM137.744 13.7031V13.8672C137.744 14.2891 137.785 14.6849 137.869 15.0547C137.957 15.4245 138.09 15.75 138.267 16.0312C138.449 16.3125 138.681 16.5339 138.963 16.6953C139.244 16.8516 139.58 16.9297 139.97 16.9297C140.449 16.9297 140.845 16.8281 141.158 16.625C141.47 16.4219 141.718 16.1536 141.9 15.8203C142.088 15.487 142.233 15.125 142.338 14.7344V12.8516C142.28 12.5651 142.192 12.2891 142.072 12.0234C141.957 11.7526 141.806 11.513 141.619 11.3047C141.436 11.0911 141.21 10.9219 140.939 10.7969C140.668 10.6719 140.351 10.6094 139.986 10.6094C139.59 10.6094 139.249 10.6927 138.963 10.8594C138.681 11.0208 138.449 11.2448 138.267 11.5312C138.09 11.8125 137.957 12.1406 137.869 12.5156C137.785 12.8854 137.744 13.2812 137.744 13.7031ZM151.361 6V18H149.915V6H151.361ZM151.017 13.4531L150.415 13.4297C150.421 12.8516 150.506 12.3177 150.673 11.8281C150.84 11.3333 151.074 10.9036 151.376 10.5391C151.678 10.1745 152.038 9.89323 152.454 9.69531C152.876 9.49219 153.342 9.39062 153.853 9.39062C154.269 9.39062 154.644 9.44792 154.978 9.5625C155.311 9.67188 155.595 9.84896 155.829 10.0938C156.069 10.3385 156.251 10.6562 156.376 11.0469C156.501 11.4323 156.564 11.9036 156.564 12.4609V18H155.111V12.4453C155.111 12.0026 155.046 11.6484 154.915 11.3828C154.785 11.112 154.595 10.9167 154.345 10.7969C154.095 10.6719 153.788 10.6094 153.423 10.6094C153.064 10.6094 152.736 10.6849 152.439 10.8359C152.147 10.987 151.894 11.1953 151.681 11.4609C151.473 11.7266 151.309 12.0312 151.189 12.375C151.074 12.7135 151.017 13.0729 151.017 13.4531ZM164.06 16.0469V9.54688H165.513V18H164.13L164.06 16.0469ZM164.333 14.2656L164.935 14.25C164.935 14.8125 164.875 15.3333 164.755 15.8125C164.64 16.2865 164.453 16.6979 164.192 17.0469C163.932 17.3958 163.591 17.6693 163.169 17.8672C162.747 18.0599 162.234 18.1562 161.63 18.1562C161.219 18.1562 160.841 18.0964 160.497 17.9766C160.159 17.8568 159.867 17.6719 159.622 17.4219C159.377 17.1719 159.187 16.8464 159.052 16.4453C158.922 16.0443 158.857 15.5625 158.857 15V9.54688H160.302V15.0156C160.302 15.3958 160.344 15.7109 160.427 15.9609C160.515 16.2057 160.633 16.401 160.778 16.5469C160.929 16.6875 161.096 16.7865 161.278 16.8438C161.466 16.901 161.659 16.9297 161.857 16.9297C162.471 16.9297 162.958 16.8125 163.317 16.5781C163.677 16.3385 163.935 16.0182 164.091 15.6172C164.252 15.2109 164.333 14.7604 164.333 14.2656ZM167.868 6H169.321V16.3594L169.196 18H167.868V6ZM175.032 13.7031V13.8672C175.032 14.4818 174.959 15.0521 174.813 15.5781C174.668 16.099 174.454 16.5521 174.173 16.9375C173.892 17.3229 173.548 17.6224 173.142 17.8359C172.735 18.0495 172.269 18.1562 171.743 18.1562C171.207 18.1562 170.735 18.0651 170.329 17.8828C169.928 17.6953 169.589 17.4271 169.313 17.0781C169.037 16.7292 168.816 16.3073 168.649 15.8125C168.488 15.3177 168.376 14.7604 168.313 14.1406V13.4219C168.376 12.7969 168.488 12.237 168.649 11.7422C168.816 11.2474 169.037 10.8255 169.313 10.4766C169.589 10.1224 169.928 9.85417 170.329 9.67188C170.73 9.48438 171.196 9.39062 171.727 9.39062C172.259 9.39062 172.73 9.49479 173.142 9.70312C173.553 9.90625 173.897 10.1979 174.173 10.5781C174.454 10.9583 174.668 11.4141 174.813 11.9453C174.959 12.4714 175.032 13.0573 175.032 13.7031ZM173.579 13.8672V13.7031C173.579 13.2812 173.54 12.8854 173.462 12.5156C173.384 12.1406 173.259 11.8125 173.087 11.5312C172.915 11.2448 172.688 11.0208 172.407 10.8594C172.126 10.6927 171.78 10.6094 171.368 10.6094C171.004 10.6094 170.686 10.6719 170.415 10.7969C170.149 10.9219 169.923 11.0911 169.735 11.3047C169.548 11.513 169.394 11.7526 169.274 12.0234C169.16 12.2891 169.074 12.5651 169.017 12.8516V14.7344C169.1 15.099 169.235 15.4505 169.423 15.7891C169.616 16.1224 169.871 16.3958 170.188 16.6094C170.511 16.8229 170.91 16.9297 171.384 16.9297C171.774 16.9297 172.108 16.8516 172.384 16.6953C172.665 16.5339 172.892 16.3125 173.063 16.0312C173.241 15.75 173.371 15.4245 173.454 15.0547C173.537 14.6849 173.579 14.2891 173.579 13.8672Z" fill="#19151C"/>`,
                'Digital learning hub',
                firstEntry,
            );
            firstEntry = false;
        }

        if (!!canSeeSpringshareAdmin(account)) {
            addAdminMenuOption(
                'springshare-admin',
                'mylibrary-menu-springshare-admin',
                `https://uq.libapps.com/libapps/login.php?site_id=731`,
                // Book cog - https://www.streamlinehq.com/icons/ultimate-regular-free?search=book&icon=ico_nm3BvxBXpWkni8Ms
                // (UQ has a streamline licence, but the freebies are easy)
                `<path stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M21.65 23.2H4.45001c-1.2 0 -2.20001 -1 -2.20001 -2.2 0 -1.2 1.00001 -2.2 2.20001 -2.2H20.25m0 0c0.8 0 1.5 -0.7 1.5 -1.5V2.29999c0 -0.8 -0.7 -1.500002 -1.5 -1.500002h-16c-1.1 0 -2 0.900002 -2 2.000002V21.4m18 -2.6v4.4" stroke-width="1" fill="none"></path>
                <path stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M11.95 11.1875c0.8284 0 1.5 -0.6716 1.5 -1.5 0 -0.82843 -0.6716 -1.5 -1.5 -1.5 -0.8285 0 -1.5 0.67157 -1.5 1.5 0 0.8284 0.6715 1.5 1.5 1.5Z" stroke-width="1" fill="none"></path>
                <path stroke="#51247A" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="m13.15 4.30004 0.4 1.3c0.1 0.5 0.6 0.70001 1.1 0.60001l1.4 -0.30001c1.2 -0.3 2 1.19999 1.2 2.09999l-1 1c-0.3 0.4 -0.3 0.90001 0 1.29997l1 1c0.8 0.9 0 2.3 -1.2 2.1l-1.4 -0.3c-0.5 -0.1 -0.9 0.2 -1.1 0.6l-0.4 1.3c-0.4 1.2 -2 1.2 -2.4 0l-0.4 -1.3c-0.1 -0.5 -0.59997 -0.7 -1.09997 -0.6l-1.39999 0.3c-1.2 0.3 -2.00001 -1.2 -1.20001 -2.1l1 -1c0.3 -0.39996 0.3 -0.89997 0 -1.29997l-1 -1c-0.8 -0.9 0.00001 -2.29999 1.20001 -2.09999l1.39999 0.30001c0.5 0.1 0.89997 -0.20001 1.09997 -0.60001l0.4 -1.3c0.4 -1.1 2.1 -1.1 2.4 0Z" stroke-width="1" fill="none"></path>`,
                'Springshare admin',
                firstEntry,
            );
            firstEntry = false;
        }

        // // if admin area has no entries, delete the area so we lose the border at the top
        // const adminarealist = !!shadowDOM && shadowDOM.getElementById('mylibrary-menu-list');
        // if (!!adminarealist && adminarealist.children.length === 0) {
        //     const adminarea = !!shadowDOM && shadowDOM.getElementById('admin-options');
        //     !!adminarea && adminarea.remove();
        // }

        // // add the user's name to the open menu
        // const userNameArea = !!shadowDOM && shadowDOM.getElementById('user-display-name');
        // const textNode = document.createTextNode(this.getUserDisplayName(account));
        // !!userNameArea && !!textNode && userNameArea.appendChild(textNode);
    }

    getUserDisplayName(account) {
        const maxLength = 40;
        const firstInitial = account.firstName.substring(0, 1);

        if (this.usesASingleName(account)) {
            return account.firstName;
        }
        const displayName = `${account.lastName}, ${account.firstName}`.trim();
        if (displayName.length > maxLength) {
            return `${firstInitial} ${account.lastName}`;
        }
        return displayName;
    }

    // some people have a '.' or a '-' for their last name.
    // Assume this is notation for 'user uses a single word name'
    usesASingleName(account) {
        const lastName = account.lastName.trim();
        return lastName.length <= 1 && !lastName.match(/[a-z]/i);
    }

    displayUserNameAsButtonLabel(shadowDOM, account) {
        const parentUserNameArea = !!shadowDOM && shadowDOM.getElementById('username-area-label');
        const textNode = document.createTextNode(this.getUserDisplayName(account));
        !!parentUserNameArea && parentUserNameArea.appendChild(textNode);
    }

    addLoginButtonListener(shadowDOM) {
        function visitLoginPage() {
            if (!new ApiAccess().isSessionStorageEnabled) {
                alert('Please enable browser Session Storage to log into the Library');
            }
            const returnUrl = window.location.href;
            window.location.assign(`${authLocale.AUTH_URL_LOGIN}${window.btoa(returnUrl)}`);
        }

        const loginButton = !!shadowDOM && shadowDOM.getElementById('auth-button-login');
        !!loginButton && loginButton.addEventListener('click', visitLoginPage);
        return loginButton;
    }

    addLogoutButtonListeners(shadowDOM, account = null) {
        const that = this;
        let accountOptionsClosed = true;

        function visitLogOutPage() {
            const apiAccess = new ApiAccess();
            apiAccess.markAccountStorageLoggedOut();
            apiAccess.logUserOut();
        }

        function hideElement(elementId) {
            const element = shadowDOM.getElementById(elementId);
            !!element && (element.style.display = 'none');
        }

        function showElement(elementId) {
            const element = shadowDOM.getElementById(elementId);
            !!element && (element.style.display = 'block');
        }

        function openAccountOptionsMenu() {
            accountOptionsClosed = false;
            const accountMenu = shadowDOM.getElementById('account-options-menu');
            const backgroundPane = shadowDOM.getElementById('account-options-pane');

            !!accountMenu && (accountMenu.style.display = 'block');
            !!backgroundPane && (backgroundPane.style.display = 'block');
            hideElement('down-arrow');
            showElement('up-arrow');
            // apply hover style to username
            const username = shadowDOM.getElementById('username-area-label');
            !!username && username.classList.add('menu-open');

            let bottomPosition = 41;
            if (window.innerWidth <= 390) {
                const utilityBar = document.querySelector('uq-site-header');

                // Get the bottom position of the utilityBar element
                const childRect = utilityBar.getBoundingClientRect();
                bottomPosition = childRect?.bottom;
            }
            !!bottomPosition && !!accountMenu && (accountMenu.style.top = `${bottomPosition}px`);

            function showDisplay() {
                !!accountMenu && accountMenu.classList.remove('account-options-menu-closed');
                !!backgroundPane && backgroundPane.classList.remove('account-options-pane-closed');
            }

            setTimeout(showDisplay, 100);
            document.onkeydown = function (e) {
                const evt = e || /* istanbul ignore next */ window.event;
                if (isEscapeKeyPressed(evt) && accountOptionsClosed === false) {
                    closeAccountOptionsMenu();
                }
            };
        }

        function closeAccountOptionsMenu(e) {
            if (e?.ctrlKey || e?.metaKey) {
                return; // ctrl-click on windows, cmd-click on mac
            }
            accountOptionsClosed = true;
            const accountMenu = shadowDOM.getElementById('account-options-menu');
            !!accountMenu && accountMenu.classList.add('account-options-menu-closed');
            const backgroundPane = shadowDOM.getElementById('account-options-pane');
            !!backgroundPane && backgroundPane.classList.add('account-options-pane-closed');
            showElement('down-arrow');
            hideElement('up-arrow');
            const username = shadowDOM.getElementById('username-area-label');
            !!username && username.classList.remove('menu-open');
            !!accountMenu && (accountMenu.style.display = 'none');
            !!backgroundPane && (backgroundPane.style.display = 'none');
        }

        function handleAccountOptionsButton() {
            const openButton = shadowDOM.getElementById('account-options-button');
            accountOptionsClosed
                ? !!openButton && openButton.blur()
                : /* istanbul ignore next */ !!openButton && openButton.focus();
            const shadowPane = shadowDOM.getElementById('account-options-pane');
            !!shadowPane && shadowPane.addEventListener('click', handleAccountOptionsMouseOut);
            openAccountOptionsMenu();
        }

        function handleAccountOptionsMouseOut() {
            accountOptionsClosed = !accountOptionsClosed;
            const shadowPane = shadowDOM.getElementById('account-options-pane');
            !!shadowPane && shadowPane.removeEventListener('mouseleave', handleAccountOptionsMouseOut);
            closeAccountOptionsMenu();
        }

        // when the user clicks a link that is supplied by the homepage repo, manually close the account menu
        function closeAccountMenuOnLinkClick(elementId) {
            const link = !!shadowDOM && shadowDOM.getElementById(elementId);
            !!link &&
                link.addEventListener('click', function (e) {
                    closeAccountOptionsMenu(e);
                });
        }

        // Attach a listener to the options button
        const accountOptionsButton = !!shadowDOM && shadowDOM.getElementById('account-option-button');
        !!accountOptionsButton && accountOptionsButton.addEventListener('click', handleAccountOptionsButton);

        const logoutButton = !!shadowDOM && shadowDOM.getElementById('signOutButton');
        if (!!logoutButton) {
            logoutButton.addEventListener('click', visitLogOutPage);
            logoutButton.addEventListener('keydown', function (e) {
                if (isTabKeyPressed(e)) {
                    closeAccountOptionsMenu();
                }
            });
        }

        closeAccountMenuOnLinkClick('mylibrary-menu-course-resources');
        closeAccountMenuOnLinkClick('mylibrary-menu-masquerade');
        closeAccountMenuOnLinkClick('mylibrary-menu-alerts-admin');
        closeAccountMenuOnLinkClick('mylibrary-menu-testTag-admin');
        closeAccountMenuOnLinkClick('mylibrary-menu-dlor-admin');
    }

    // we have an option to add the attribute `overwriteasloggedout` to the authbutton
    // this will display the auth button, but always show them as logged out
    isOverwriteAsLoggedOutRequested() {
        const isOverwriteRequired = this.getAttribute('overwriteasloggedout');
        return (!!isOverwriteRequired || isOverwriteRequired === '') && isOverwriteRequired !== 'false';
    }

    async removeEspaceMenuOptionWhenNotAuthor(shadowDOM) {
        const espaceitem = !!shadowDOM && shadowDOM.getElementById('mylibrary-espace');
        if (!espaceitem) {
            return;
        }

        let storedUserDetails = {};

        const getStoredUserDetails = setInterval(() => {
            storedUserDetails = new ApiAccess().getAccountFromStorage();
            let isLoggedIn =
                !!storedUserDetails &&
                storedUserDetails.hasOwnProperty('status') &&
                (storedUserDetails.status === apiLocale.USER_LOGGED_IN ||
                    storedUserDetails.status === apiLocale.USER_LOGGED_OUT);
            if (isLoggedIn) {
                clearInterval(getStoredUserDetails);

                !canSeeEspace(storedUserDetails) && espaceitem.remove();
            }
        }, 100);
    }
}

export default AuthButton;
