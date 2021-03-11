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
            </ul>
        </div>
        <!-- Screen wrapper -->
        <div id="mylibrary-pane" aria-hidden="true" class=closed-pane style="display: none" />
    `;
};
