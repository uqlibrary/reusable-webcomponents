export const mylibrary = () => {
  return `
        <!-- Button -->
        <button id="mylibrary-button">
            <svg id="mylibrary-icon" class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"></path></svg>
            <div id="mylibrary-label">My library</div>
        </button>
        <!-- Menu -->
        <div id="mylibrary-menu" class="closed-menu" style="display: none">
            <ul class="mylibrary-menu-list" role="menu" >
                <!-- Borrowing -->
                <li role="menuitem" aria-disabled="false">
                    <a href="https://search.library.uq.edu.au/primo-explore/account?vid=61UQ&section=loans&lang=en_US" rel="noreferrer">
                        <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .65.73.45.75.45C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.41.21.75-.19.75-.45V6c-1.49-1.12-3.63-1.5-5.5-1.5zm3.5 14c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"></path></svg>
                        <span>Borrowing</span>
                    </a>
                </li>
                
                <!-- Course resources -->
                <li role="menuitem" aria-disabled="false">
                    <a href="https://www.library.uq.edu.au/courseresources" rel="noreferrer">
                        <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"></path></svg>
                        <span>Course resources</span>
                    </a>
                </li>
                
                <!-- Document delivery -->
                <li role="menuitem" aria-disabled="false">
                    <a href="https://auth.library.uq.edu.au/login?relais_return=1" rel="noreferrer">
                        <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"></path></svg>
                        <span>Document delivery</span>
                    </a>
                </li>
                
                <!-- Masquerade -->
                <li data-testid="mylibrary-masquerade" id="mylibrary-masquerade" role="menuitem" aria-disabled="false">
                    <a href="https://www.library.uq.edu.au/admin/masquerade" rel="noreferrer">
                        <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.66 13 9 13z"></path></svg>
                        <span>Masquerade</span>
                    </a>
                </li>
                
                <!-- Printing balance -->
                <li role="menuitem" aria-disabled="false">
                    <a href="https://lib-print.library.uq.edu.au:9192/user" rel="noreferrer">
                        <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"></path></svg>
                        <span>Print balance</span>
                    </a>
                </li>
                
                <!-- eSpace dashboard -->
                <li data-testid="mylibrary-espace" id="mylibrary-espace" role="menuitem" aria-disabled="false">
                    <a href="https://espace.library.uq.edu.au/dashboard" rel="noreferrer">
                        <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"></path></svg>
                        <span>eSpace dashboard</span>
                    </a>
                </li>
                
                <!-- Room bookings -->
                <li role="menuitem" aria-disabled="false">
                    <a href="https://uqbookit.uq.edu.au/#/app/booking-types/77b52dde-d704-4b6d-917e-e820f7df07cb" rel="noreferrer">
                        <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M2 17h20v2H2zm11.84-9.21c.1-.24.16-.51.16-.79 0-1.1-.9-2-2-2s-2 .9-2 2c0 .28.06.55.16.79C6.25 8.6 3.27 11.93 3 16h18c-.27-4.07-3.25-7.4-7.16-8.21z"></path></svg>
                        <span>Room bookings</span>
                    </a>
                </li>
                
                <!-- Saved items -->
                <li role="menuitem" aria-disabled="false">
                    <a href="https://search.library.uq.edu.au/primo-explore/favorites?vid=61UQ&lang=en_US&section=items" rel="noreferrer">
                        <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                        <span>Saved items</span>
                    </a>
                </li>
                
                <!-- Saved searches -->
                <li role="menuitem" aria-disabled="false">
                    <a href="https://search.library.uq.edu.au/primo-explore/favorites?vid=61UQ&lang=en_US&section=queries" rel="noreferrer">
                        <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M17.01 14h-.8l-.27-.27c.98-1.14 1.57-2.61 1.57-4.23 0-3.59-2.91-6.5-6.5-6.5s-6.5 3-6.5 6.5H2l3.84 4 4.16-4H6.51C6.51 7 8.53 5 11.01 5s4.5 2.01 4.5 4.5c0 2.48-2.02 4.5-4.5 4.5-.65 0-1.26-.14-1.82-.38L7.71 15.1c.97.57 2.09.9 3.3.9 1.61 0 3.08-.59 4.22-1.57l.27.27v.79l5.01 4.99L22 19l-4.99-5z"></path></svg>
                        <span>Saved searches</span>
                    </a>
                </li>
                
                <!-- Feedback -->
                <li role="menuitem" aria-disabled="false">
                    <a href="https://support.my.uq.edu.au/app/library/feedback" rel="noreferrer">
                        <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="margin-right: 6px; margin-bottom: -6px;"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"></path></svg>
                        <span>Feedback</span>
                    </a>
                </li>
                
            </ul>
        </div>
        <!-- Screen wrapper -->
        <div id="mylibrary-pane" aria-hidden="true" class=closed-pane style="display: none" />
    `;
};
