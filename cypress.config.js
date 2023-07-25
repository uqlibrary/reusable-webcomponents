const { defineConfig } = require('cypress');

module.exports = defineConfig({
    waitForAnimations: true,
    pageLoadTimeout: 30000,
    video: false,
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    videoUploadOnPasses: false,
    projectId: '2nei7f',
    blockHosts: ['www.googletagmanager.com'],
    e2e: {
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        setupNodeEvents(on, config) {
            return require('./cypress/plugins/index.js')(on, config);
        },
        baseUrl: 'http://localhost:8080',
        specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    },
});
