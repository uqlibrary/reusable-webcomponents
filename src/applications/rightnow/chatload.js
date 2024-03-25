function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function adjustPageContent() {
    // code to tweak content goes here
}

ready(adjustPageContent);
