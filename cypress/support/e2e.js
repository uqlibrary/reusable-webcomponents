// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
require('cypress-plugin-tab');
// Import commands.js using ES2015 syntax:
import './commands';
import 'cypress-axe';
import '@cypress/code-coverage/support';
import 'cypress-wait-until';

// Alternatively you can use CommonJS syntax:
// require('./commands')

export const A11YOptions = {
    runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'section508'],
    },
};
